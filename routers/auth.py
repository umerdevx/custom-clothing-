import datetime
import random
import string
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.database import get_db
from models.models import User, PasswordReset
from schemas.schemas import UserRegister, UserLogin, Token, UserOut, ProfileUpdate, ForgotPasswordRequest, OTPVerifyRequest, ResetPasswordRequest
from utils.email import send_otp_email

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Cryptography Settings
SECRET_KEY = "SUPER_SECRET_KEY_FOR_FYP_2026" # In production, load from env var
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login-form")
optional_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login-form", auto_error=False)

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        if email is None or user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    result = await db.execute(select(User).where(User.user_id == user_id))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    return user

async def get_optional_user(token: str = Depends(optional_oauth2_scheme), db: AsyncSession = Depends(get_db)) -> Optional[User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        if email is None or user_id is None:
            return None
    except JWTError:
        return None
    result = await db.execute(select(User).where(User.user_id == user_id))
    return result.scalars().first()

async def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Admin role required"
        )
    return current_user

# Endpoints
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    # Check if email is already taken
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )
    
    # Hash password and create record
    hashed = hash_password(user_data.password)
    
    # First user registered gets Admin role automatically for easy testing
    result_any = await db.execute(select(User))
    has_users = result_any.scalars().first() is not None
    role = "customer" if has_users else "admin"
    
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed,
        phone=user_data.phone,
        address=user_data.address,
        role=role
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalars().first()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create token
    access_token = create_access_token(data={"sub": user.email, "user_id": user.user_id, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

# Form URL-encoded login for Swagger UI OAuth2 workflow
from fastapi.security import OAuth2PasswordRequestForm
@router.post("/login-form", include_in_schema=False)
async def login_form(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    access_token = create_access_token(data={"sub": user.email, "user_id": user.user_id, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/profile", response_model=UserOut)
async def update_profile(
    data: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(current_user, field, value)
    await db.commit()
    await db.refresh(current_user)
    return current_user


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(data: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalars().first()
    # Always return success to prevent email enumeration
    if not user:
        return {"message": "If this email is registered, an OTP will be sent."}

    otp = ''.join(random.choices(string.digits, k=6))
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)

    reset = PasswordReset(email=data.email, otp=otp, expires_at=expires_at, used=False)
    db.add(reset)
    await db.commit()

    send_otp_email(data.email, otp)
    return {"message": "If this email is registered, an OTP will be sent.", "debug_otp": otp}


@router.post("/verify-otp", status_code=status.HTTP_200_OK)
async def verify_otp(data: OTPVerifyRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(PasswordReset)
        .where(PasswordReset.email == data.email, PasswordReset.otp == data.otp, PasswordReset.used == False)
        .order_by(PasswordReset.expires_at.desc())
    )
    reset = result.scalars().first()
    if not reset or reset.expires_at < datetime.datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP")
    return {"message": "OTP verified. You may now reset your password."}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(PasswordReset)
        .where(PasswordReset.email == data.email, PasswordReset.otp == data.otp, PasswordReset.used == False)
        .order_by(PasswordReset.expires_at.desc())
    )
    reset = result.scalars().first()
    if not reset or reset.expires_at < datetime.datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP")

    user_res = await db.execute(select(User).where(User.email == data.email))
    user = user_res.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.password_hash = hash_password(data.new_password)
    reset.used = True
    await db.commit()
    return {"message": "Password reset successfully. You can now log in."}
