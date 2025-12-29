import uvicorn
import os

if __name__ == "__main__":
    # Get port from environment variable or default to 10000 (Render's default)
    port = int(os.environ.get("PORT", 10000))
    
    # Run the application using Uvicorn
    # "app.main:app" refers to the 'app' object in 'app/main.py'
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, log_level="info", proxy_headers=True)