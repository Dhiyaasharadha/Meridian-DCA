from fastapi import APIRouter, HTTPException, Request
from backend.core.hubspot import HubSpotClient
from pydantic import BaseModel
import json
import os

router = APIRouter()

# In-memory storage for tokens (MVP only)
tokens = {}

@router.get("/auth/login")
async def login():
    client = HubSpotClient()
    auth_url = await client.get_auth_url()
    await client.close()
    return {"url": auth_url}

@router.get("/auth/callback")
async def callback(code: str):
    client = HubSpotClient()
    try:
        token_data = await client.exchange_code_for_token(code)
        # Store token (simplified)
        tokens["current"] = token_data["access_token"]
        return {"message": "Authentication successful", "token_data": token_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        await client.close()

@router.post("/scan")
async def scan_workflows():
    access_token = tokens.get("current")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    client = HubSpotClient(access_token=access_token)
    try:
        workflows = await client.get_workflows()
        
        # Save raw JSON for testing/debugging
        os.makedirs("data", exist_ok=True)
        with open("data/workflows_raw.json", "w") as f:
            json.dump(workflows, f, indent=2)
            
        return {"message": "Scan complete", "workflow_count": len(workflows.get("workflows", []))}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await client.close()
