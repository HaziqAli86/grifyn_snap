from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from contextlib import asynccontextmanager
from starlette.middleware.base import BaseHTTPMiddleware
import logging

from app.core.config import settings
from app.models.user import User
from app.models.registry import Child, Gift, Pledge
from app.api.v1.routers import auth, children, gifts, pledges, users

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(database=client[settings.DATABASE_NAME], document_models=[User, Child, Gift, Pledge])
    yield
    # Shutdown
    client.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Log CORS origins on startup
logger.info(f"CORS Origins configured: {settings.BACKEND_CORS_ORIGINS}")

# Add request logging middleware FIRST (runs last due to reverse order)
class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get('origin', 'None')
        method = request.method
        path = request.url.path
        # Log all relevant headers for OPTIONS requests
        if method == "OPTIONS":
            logger.info(f"OPTIONS Request: {path}")
            logger.info(f"  Origin: {origin}")
            logger.info(f"  Access-Control-Request-Method: {request.headers.get('access-control-request-method', 'None')}")
            logger.info(f"  Access-Control-Request-Headers: {request.headers.get('access-control-request-headers', 'None')}")
        else:
            logger.info(f"Request: {method} {path} - Origin: {origin}")
        
        try:
            response = await call_next(request)
            cors_header = response.headers.get('access-control-allow-origin', 'MISSING')
            logger.info(f"Response: {response.status_code} - Access-Control-Allow-Origin: {cors_header}")
            if response.status_code >= 400:
                # Log response body for errors
                try:
                    body = b""
                    async for chunk in response.body_iterator:
                        body += chunk
                    logger.error(f"Error response body: {body.decode()}")
                    # Recreate response with body
                    from starlette.responses import Response
                    response = Response(content=body, status_code=response.status_code, headers=dict(response.headers))
                except:
                    pass
            return response
        except Exception as e:
            logger.error(f"Error in middleware: {e}", exc_info=True)
            raise

# app.add_middleware(LoggingMiddleware)

# Set all CORS enabled origins
# IMPORTANT: CORS middleware added LAST (runs FIRST due to reverse order)
# This ensures CORS handles OPTIONS preflight requests before they reach routes
# Using a list that includes both localhost and 127.0.0.1 variants
cors_origins = settings.BACKEND_CORS_ORIGINS.copy()
# Ensure we have all variants
if "http://localhost:5138" not in cors_origins:
    cors_origins.append("http://localhost:5138")
if "http://127.0.0.1:5138" not in cors_origins:
    cors_origins.append("http://127.0.0.1:5138")

logger.info(f"Final CORS Origins: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",  # Allow any origin during development to fix 400 errors
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(children.router, prefix=f"{settings.API_V1_STR}/children", tags=["children"])
app.include_router(gifts.router, prefix=f"{settings.API_V1_STR}/gifts", tags=["gifts"])
app.include_router(pledges.router, prefix=f"{settings.API_V1_STR}/pledges", tags=["pledges"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])

@app.get("/")
async def root():
    return {"message": "Welcome to Grifyn API - CORS DEBUG"}

@app.get("/health")
async def health_check():
    """Health check endpoint with MongoDB connection test"""
    mongodb_status = "unknown"
    try:
        # Test MongoDB connection
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=2000)
        await client.admin.command('ping')
        mongodb_status = "connected"
        client.close()
    except Exception as e:
        mongodb_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "mongodb": mongodb_status,
        "mongodb_url": settings.MONGODB_URL,
        "database_name": settings.DATABASE_NAME,
        "cors_origins": settings.BACKEND_CORS_ORIGINS
    }