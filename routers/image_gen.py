import base64
import urllib.parse
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/image-gen", tags=["AI Image Generation"])

# Pollinations.ai — free, no API key, Flux-based image generation
POLLINATIONS_URL = "https://image.pollinations.ai/prompt/{prompt}"

CATEGORY_CONTEXT = {
    "tshirt":  "crew-neck t-shirt, short sleeves, flat lay apparel product photography",
    "hoodie":  "oversized hoodie, kangaroo pocket, drawstring, flat lay apparel product photography",
    "jacket":  "windbreaker jacket, zip-up front, flat lay apparel product photography",
    "uniform": "sports jersey, v-neck, athletic performance fit, flat lay apparel product photography",
}


class ImageGenRequest(BaseModel):
    category: str
    prompt: str


class ImageGenResponse(BaseModel):
    image_base64: str
    mime_type: str


@router.post("", response_model=ImageGenResponse)
async def generate_design_image(req: ImageGenRequest):
    category_key = req.category.lower()
    garment_desc = CATEGORY_CONTEXT.get(category_key, f"{req.category}, flat lay apparel product photography")

    full_prompt = (
        f"{garment_desc}, design concept: {req.prompt}, "
        "pure white studio background, soft diffused lighting, high detail, "
        "commercial clothing product photo, no text overlays, no mannequin"
    )

    encoded = urllib.parse.quote(full_prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?model=flux&width=768&height=768&nologo=true&seed={hash(req.prompt) % 9999}"

    try:
        async with httpx.AsyncClient(timeout=45.0, follow_redirects=True) as client:
            r = await client.get(url)
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Image generation timed out — please try again.")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Image service unreachable: {e}")

    if r.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Image generation failed (HTTP {r.status_code}).")

    content_type = r.headers.get("content-type", "image/jpeg").split(";")[0].strip()
    image_b64 = base64.b64encode(r.content).decode("utf-8")

    return ImageGenResponse(image_base64=image_b64, mime_type=content_type)
