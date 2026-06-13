import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", SMTP_USER)


def _send(to: str, subject: str, html_body: str) -> bool:
    if not SMTP_USER or not SMTP_PASS:
        logger.info(f"[EMAIL SKIPPED - no SMTP config] To: {to} | Subject: {subject}")
        return False
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = FROM_EMAIL
        msg["To"] = to
        msg.attach(MIMEText(html_body, "html"))
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(FROM_EMAIL, to, msg.as_string())
        logger.info(f"[EMAIL SENT] To: {to} | Subject: {subject}")
        return True
    except Exception as e:
        logger.error(f"[EMAIL FAILED] To: {to} | Error: {e}")
        return False


def send_otp_email(to: str, otp: str) -> bool:
    subject = "AURA-WEAR — Password Reset OTP"
    body = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px">
      <h2 style="color:#6C63FF">AURA-WEAR</h2>
      <p>Your password reset OTP is:</p>
      <h1 style="letter-spacing:8px;color:#6C63FF;font-size:36px">{otp}</h1>
      <p>This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
      <p style="font-size:12px;color:#888">If you did not request this, you can safely ignore this email.</p>
    </div>"""
    return _send(to, subject, body)


def send_order_confirmation(to: str, order_id: str, total: float) -> bool:
    subject = f"AURA-WEAR — Order Confirmed #{order_id}"
    body = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px">
      <h2 style="color:#6C63FF">Order Confirmed!</h2>
      <p>Thank you for your order. Here's a summary:</p>
      <table style="width:100%;border-collapse:collapse">
        <tr><td><strong>Order ID</strong></td><td>{order_id}</td></tr>
        <tr><td><strong>Total</strong></td><td>PKR {total:,.0f}</td></tr>
      </table>
      <p>We'll notify you when your order moves to production.</p>
      <p style="color:#888;font-size:12px">AURA-WEAR AI Custom Clothing</p>
    </div>"""
    return _send(to, subject, body)


def send_order_status_update(to: str, order_id: str, new_status: str) -> bool:
    subject = f"AURA-WEAR — Order {order_id} Status Updated"
    body = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px">
      <h2 style="color:#6C63FF">Order Status Update</h2>
      <p>Your order <strong>{order_id}</strong> has been updated:</p>
      <p style="font-size:20px;font-weight:bold;color:#6C63FF">{new_status}</p>
      <p>Log in to AURA-WEAR to track your order in detail.</p>
      <p style="color:#888;font-size:12px">AURA-WEAR AI Custom Clothing</p>
    </div>"""
    return _send(to, subject, body)


def send_new_order_admin_notification(order_id: str, customer_name: str, total: float) -> bool:
    if not ADMIN_EMAIL:
        logger.info(f"[ADMIN EMAIL SKIPPED - no ADMIN_EMAIL] Order: {order_id}")
        return False
    subject = f"AURA-WEAR — New Order Received #{order_id}"
    body = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px">
      <h2 style="color:#6C63FF">New Order Alert</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td><strong>Order ID</strong></td><td>{order_id}</td></tr>
        <tr><td><strong>Customer</strong></td><td>{customer_name}</td></tr>
        <tr><td><strong>Total</strong></td><td>PKR {total:,.0f}</td></tr>
      </table>
      <p>Log in to the admin panel to review and process this order.</p>
    </div>"""
    return _send(ADMIN_EMAIL, subject, body)
