"""Test script to verify MongoDB connection"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

async def test_mongodb_connection():
    """Test MongoDB connection"""
    print(f"Testing MongoDB connection...")
    print(f"MongoDB URL: {settings.MONGODB_URL}")
    print(f"Database Name: {settings.DATABASE_NAME}")
    print("-" * 50)
    
    try:
        # Create client with short timeout for quick test
        client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=5000  # 5 second timeout
        )
        
        # Test connection by pinging the server
        print("Attempting to connect...")
        result = await client.admin.command('ping')
        print(f"✅ MongoDB connection successful!")
        print(f"   Ping result: {result}")
        
        # List databases
        print("\n📊 Available databases:")
        db_list = await client.list_database_names()
        for db in db_list:
            print(f"   - {db}")
        
        # Check if our database exists
        if settings.DATABASE_NAME in db_list:
            print(f"\n✅ Database '{settings.DATABASE_NAME}' exists")
            
            # List collections in our database
            db = client[settings.DATABASE_NAME]
            collections = await db.list_collection_names()
            if collections:
                print(f"\n📁 Collections in '{settings.DATABASE_NAME}':")
                for collection in collections:
                    count = await db[collection].count_documents({})
                    print(f"   - {collection} ({count} documents)")
            else:
                print(f"\n📁 No collections found in '{settings.DATABASE_NAME}'")
        else:
            print(f"\n⚠️  Database '{settings.DATABASE_NAME}' does not exist yet (will be created on first use)")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"\n❌ MongoDB connection failed!")
        print(f"   Error: {str(e)}")
        print("\n💡 Troubleshooting:")
        print("   1. Make sure MongoDB is running:")
        print("      - Windows: Check Services or run 'mongod'")
        print("      - Check if MongoDB is listening on port 27017")
        print("   2. Verify the MongoDB URL in your config")
        print("   3. Check firewall settings")
        return False

if __name__ == "__main__":
    asyncio.run(test_mongodb_connection())

