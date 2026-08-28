import os

class Settings:
    HUBSPOT_CLIENT_ID = os.getenv("HUBSPOT_CLIENT_ID")
    HUBSPOT_CLIENT_SECRET = os.getenv("HUBSPOT_CLIENT_SECRET")
    HUBSPOT_REDIRECT_URI = os.getenv("HUBSPOT_REDIRECT_URI", "http://localhost:8000/api/auth/callback")
    HUBSPOT_SCOPES = "automation" # Add other scopes as needed

settings = Settings()
