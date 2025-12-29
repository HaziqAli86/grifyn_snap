import asyncio
import uvicorn
from fastapi import FastAPI
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from app.models.registry import Child, Gift, Pledge
from app.models.user import User
from app.api.v1.routers import children
from app.core.config import settings
import os
from contextlib import asynccontextmanager

# Define lifespan to initialize DB
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Use the same DB connection logic
    print(f"Connecting to MongoDB at: {settings.MONGODB_URL}")
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
        # Force a connection attempt to fail fast if DB is down
        await client.admin.command('ping')
        print("MongoDB connected successfully.")
        
        await init_beanie(database=client[settings.DATABASE_NAME], document_models=[User, Child, Gift, Pledge])
        print("Beanie initialized.")
    except Exception as e:
        print(f"ERROR: Failed to connect to MongoDB: {e}")
        # We might want to exit here or let it continue to see if uvicorn starts
        
    yield
    print("Shutting down...")
    client.close()

app = FastAPI(lifespan=lifespan)

# Mock user dependency to avoid auth issues during debug
# We need to override the dependency in the router
from app.api.deps import get_current_user
from app.models.user import User

async def mock_get_current_user():
    # Return a dummy user
    # We need to make sure this user exists or is valid enough for the endpoint
    # The endpoint uses current_user.id
    return User(id="user123", email="test@example.com", hashed_password="pw")

app.dependency_overrides[get_current_user] = mock_get_current_user

app.include_router(children.router, prefix="/api/v1/children")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)