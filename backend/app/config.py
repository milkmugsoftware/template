import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
SOFTWARE_NAME = os.getenv("SOFTWARE_NAME")
COMPANY_NAME = os.getenv("COMPANY_NAME")

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"

MERCADO_PAGO_ACCESS_TOKEN = os.getenv("MERCADO_PAGO_ACCESS_TOKEN")
MERCADO_PAGO_PUBLIC_KEY = os.getenv("MERCADO_PAGO_PUBLIC_KEY")
CREDIT_VALUE = float(os.getenv("CREDIT_VALUE", "1.0"))  # Default to 1.0 if not set

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAIL_FROM = os.getenv("EMAIL_FROM")

# Base URL for email verification
BASE_URL = os.getenv("BASE_URL")