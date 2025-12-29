"""Quick test script to verify CORS configuration"""
import requests

# Test OPTIONS request (preflight)
print("Testing OPTIONS request (preflight)...")
try:
    response = requests.options(
        "http://localhost:8000/api/v1/auth/register",
        headers={
            "Origin": "http://localhost:5138",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type"
        }
    )
    print(f"Status Code: {response.status_code}")
    print(f"CORS Headers:")
    for key, value in response.headers.items():
        if "access-control" in key.lower():
            print(f"  {key}: {value}")
    if "Access-Control-Allow-Origin" not in response.headers:
        print("❌ ERROR: Access-Control-Allow-Origin header is missing!")
    else:
        print("✅ CORS headers are present")
except requests.exceptions.ConnectionError:
    print("❌ ERROR: Cannot connect to server. Is it running on http://localhost:8000?")
except Exception as e:
    print(f"❌ ERROR: {e}")


