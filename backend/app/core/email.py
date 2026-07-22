# import os
# import resend
# from dotenv import load_dotenv

# load_dotenv()

# resend.api_key = os.getenv("RESEND_API_KEY")
# FROM_EMAIL = os.getenv("EMAIL_FROM", "Drop Found <onboarding@resend.dev>")
# FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


# def send_verification_email(to_email: str, token: str, first_name: str = ""):
#     verify_link = f"{FRONTEND_URL}/verify-email?token={token}"
#     try:
#         resend.Emails.send(
#             {
#                 "from": FROM_EMAIL,
#                 "to": to_email,
#                 "subject": "Verify your Drop Found account",
#                 "html": f"""
#                 <!DOCTYPE html>
#                 <html>
#                 <head>
#                     <meta charset="UTF-8">
#                     <meta name="viewport" content="width=device-width, initial-scale=1.0">
#                     <title>Verify Your Email</title>
#                 </head>
#                 <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #fafafa;">
#                     <div style="max-width: 560px; margin: 40px auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
#                         <div style="text-align: center; margin-bottom: 32px;">
#                             <h1 style="font-weight: 300; font-size: 24px; letter-spacing: 2px; color: #1a1a1a; margin: 0;">
#                                 DropFound
#                             </h1>
#                             <p style="color: #888; font-size: 13px; margin: 4px 0 0;">Nepal's Thrift & Surplus Marketplace</p>
#                         </div>
                        
#                         <h2 style="font-weight: 300; font-size: 22px; color: #1a1a1a; margin: 0 0 12px;">
#                             Welcome, {first_name or 'there'}! 👋
#                         </h2>
                        
#                         <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 8px;">
#                             Thanks for joining DropFound. To get started, please verify your email address.
#                         </p>
                        
#                         <div style="text-align: center; margin: 32px 0;">
#                             <a href="{verify_link}" 
#                                style="display: inline-block; background: #1a1a1a; color: white; text-decoration: none; 
#                                       padding: 14px 48px; font-size: 14px; font-weight: 500; letter-spacing: 1px;
#                                       border-radius: 4px; transition: background 0.2s;">
#                                 Verify Email Address
#                             </a>
#                         </div>
                        
#                         <p style="color: #888; font-size: 13px; line-height: 1.6; margin: 0 0 4px;">
#                             If you didn't create an account with DropFound, you can safely ignore this email.
#                         </p>
                        
#                         <p style="color: #999; font-size: 12px; line-height: 1.6; margin: 20px 0 0; border-top: 1px solid #eee; padding-top: 20px;">
#                             This link expires in 24 hours.<br>
#                             <span style="color: #bbb;">DropFound — Patan Dhoka, Lalitpur, Nepal</span>
#                         </p>
#                     </div>
#                 </body>
#                 </html>
#             """,
#             }
#         )
#     except Exception as e:
#         print(f"[email] Failed to send verification email to {to_email}: {e}")
