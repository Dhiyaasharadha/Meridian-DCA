import httpx
from backend.core.config import settings

class HubSpotClient:
    def __init__(self, access_token: str = None):
        self.base_url = "https://api.hubapi.com"
        self.access_token = access_token
        self.client = httpx.AsyncClient(base_url=self.base_url)

    async def get_auth_url(self):
        return f"https://app.hubspot.com/oauth/authorize?client_id={settings.HUBSPOT_CLIENT_ID}&redirect_uri={settings.HUBSPOT_REDIRECT_URI}&scope={settings.HUBSPOT_SCOPES}"

    async def exchange_code_for_token(self, code: str):
        data = {
            "grant_type": "authorization_code",
            "client_id": settings.HUBSPOT_CLIENT_ID,
            "client_secret": settings.HUBSPOT_CLIENT_SECRET,
            "redirect_uri": settings.HUBSPOT_REDIRECT_URI,
            "code": code
        }
        response = await self.client.post("/oauth/v1/token", data=data)
        response.raise_for_status()
        return response.json()

    async def get_workflows(self):
        if not self.access_token:
            raise Exception("Access token required")
        
        headers = {"Authorization": f"Bearer {self.access_token}"}
        # Note: This is a simplified endpoint. Real HubSpot API might need pagination and specific params.
        # V3 automation API: GET /automation/v3/workflows
        response = await self.client.get("/automation/v3/workflows", headers=headers)
        response.raise_for_status()
        return response.json()

    async def close(self):
        await self.client.aclose()
