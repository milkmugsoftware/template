from fastapi import HTTPException
import requests
from config import FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET

def get_facebook_auth_url(redirect_uri: str):
    """Generate Facebook OAuth 2.0 authorization URL"""
    base_url = "https://www.facebook.com/v12.0/dialog/oauth"
    params = {
        "client_id": FACEBOOK_CLIENT_ID,
        "redirect_uri": redirect_uri,
        "scope": "email,public_profile",
        "response_type": "code",
    }
    return f"{base_url}?{'&'.join(f'{k}={v}' for k, v in params.items())}"

def get_facebook_token(code: str, redirect_uri: str):
    """Exchange authorization code for access token"""
    token_url = "https://graph.facebook.com/v12.0/oauth/access_token"
    params = {
        "client_id": FACEBOOK_CLIENT_ID,
        "client_secret": FACEBOOK_CLIENT_SECRET,
        "code": code,
        "redirect_uri": redirect_uri,
    }

    try:
        response = requests.get(token_url, params=params)
        response.raise_for_status()
        return response.json()["access_token"]
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Failed to retrieve token: {str(e)}")

def get_facebook_user_info(access_token: str):
    """Get user information from Facebook"""
    user_info_url = "https://graph.facebook.com/me"
    params = {
        "fields": "id,name,email",
        "access_token": access_token,
    }

    try:
        response = requests.get(user_info_url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Failed to retrieve user info: {str(e)}")
