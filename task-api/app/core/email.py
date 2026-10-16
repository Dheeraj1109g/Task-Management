import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", os.getenv("SMTP_USER", "no-reply@taskpulse.io"))
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

def send_verification_email(email: str, token: str) -> dict:
    """
    Sends a verification email with the token and verification link.
    If SMTP credentials are configured, sends via SMTP.
    Otherwise, logs the full email and link for local development/testing.
    """
    verification_link = f"{FRONTEND_URL}/verify-email?token={token}"
    subject = "Verify your TaskPulse account"
    
    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 24px; }}
    .card {{ max-width: 520px; margin: 0 auto; background: #131b2e; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }}
    .logo {{ font-size: 20px; font-weight: 700; color: #818cf8; margin-bottom: 20px; }}
    h1 {{ font-size: 22px; color: #ffffff; margin-bottom: 12px; }}
    p {{ font-size: 14px; line-height: 1.6; color: #94a3b8; }}
    .token-box {{ background: #0f172a; border: 1px dashed #38bdf8; border-radius: 10px; padding: 12px; margin: 20px 0; text-align: center; }}
    .token-code {{ font-family: monospace; font-size: 16px; font-weight: bold; color: #38bdf8; letter-spacing: 1px; word-break: break-all; }}
    .btn {{ display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px; margin-top: 10px; }}
    .footer {{ margin-top: 30px; border-top: 1px solid #1e293b; padding-top: 16px; font-size: 12px; color: #64748b; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">✦ TaskPulse B2B Fintech &amp; Tasks</div>
    <h1>Verify Your Email Address</h1>
    <p>Welcome to TaskPulse! Please verify your email to unlock your workspace and activate your assigned role permissions.</p>
    <div class="token-box">
      <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">YOUR VERIFICATION TOKEN</div>
      <div class="token-code">{token}</div>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="{verification_link}" class="btn">Verify Account Now</a>
    </div>
    <p>Or paste this link into your browser:<br/><a href="{verification_link}" style="color: #818cf8; word-break: break-all;">{verification_link}</a></p>
    <div class="footer">
      If you did not sign up for TaskPulse, you can safely ignore this email.
    </div>
  </div>
</body>
</html>"""

    text_content = f"""TaskPulse - Verify Your Email
Welcome! Please verify your email using the link below:
{verification_link}

Your verification token:
{token}
"""

    sent_via_smtp = False
    if SMTP_HOST and SMTP_USER and SMTP_PASSWORD:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = SMTP_FROM
            msg["To"] = email
            msg.attach(MIMEText(text_content, "plain"))
            msg.attach(MIMEText(html_content, "html"))

            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.sendmail(SMTP_FROM, [email], msg.as_string())
            sent_via_smtp = True
            logger.info("Verification email sent via SMTP to %s", email)
        except Exception as e:
            logger.warning("Failed to send email via SMTP (%s). Falling back to console log.", e)

    # Always log for development / debugging visibility
    logger.info("================== EMAIL DISPATCH ==================")
    logger.info("Recipient: %s", email)
    logger.info("Subject: %s", subject)
    logger.info("Verification Token: %s", token)
    logger.info("Verification Link: %s", verification_link)
    logger.info("====================================================")

    return {
        "email": email,
        "token": token,
        "verification_link": verification_link,
        "sent_via_smtp": sent_via_smtp,
    }
