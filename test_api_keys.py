#!/usr/bin/env python3
"""
Quick API Key Test Script
Tests the connectivity with your actual API keys
"""

import os
import asyncio
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

async def test_api_keys():
    """Test all API keys for connectivity"""
    print("🔑 Testing API Keys Connectivity")
    print("="*50)
    
    results = {}
    
    # Test Groq API
    print("🧠 Testing Groq API...")
    groq_key = os.getenv('GROQ_API_KEY')
    if groq_key:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    "https://api.groq.com/openai/v1/models",
                    headers={"Authorization": f"Bearer {groq_key}"}
                )
                if response.status_code == 200:
                    models = response.json()
                    results['groq'] = f"✅ Connected - {len(models.get('data', []))} models available"
                else:
                    results['groq'] = f"❌ Error - Status {response.status_code}"
        except Exception as e:
            results['groq'] = f"❌ Error - {str(e)}"
    else:
        results['groq'] = "❌ API key not found"
    
    # Test Upstash Redis
    print("💾 Testing Upstash Redis...")
    redis_url = os.getenv('UPSTASH_REDIS_REST_URL')
    redis_token = os.getenv('UPSTASH_REDIS_REST_TOKEN')
    
    if redis_url and redis_token:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{redis_url}/ping",
                    headers={"Authorization": f"Bearer {redis_token}"}
                )
                if response.status_code == 200:
                    results['redis'] = "✅ Connected - Redis is responding"
                else:
                    results['redis'] = f"❌ Error - Status {response.status_code}"
        except Exception as e:
            results['redis'] = f"❌ Error - {str(e)}"
    else:
        results['redis'] = "❌ API credentials not found"
    
    # Test Upstash Vector
    print("🔍 Testing Upstash Vector...")
    vector_url = os.getenv('UPSTASH_VECTOR_REST_URL')
    vector_token = os.getenv('UPSTASH_VECTOR_REST_TOKEN')
    
    if vector_url and vector_token:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{vector_url}/info",
                    headers={"Authorization": f"Bearer {vector_token}"}
                )
                if response.status_code == 200:
                    info = response.json()
                    results['vector'] = f"✅ Connected - Vector DB ready"
                else:
                    results['vector'] = f"❌ Error - Status {response.status_code}"
        except Exception as e:
            results['vector'] = f"❌ Error - {str(e)}"
    else:
        results['vector'] = "❌ API credentials not found"
    
    # Test local Next.js API
    print("🌐 Testing Local Next.js API...")
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get("http://localhost:3000/api/health")
            if response.status_code == 200:
                results['nextjs'] = "✅ Connected - Next.js API responding"
            else:
                results['nextjs'] = f"⚠️ Status {response.status_code} - Server may be starting"
    except Exception as e:
        results['nextjs'] = f"❌ Error - {str(e)}"
    
    # Print results
    print("\n🏁 Test Results:")
    print("="*50)
    for service, result in results.items():
        print(f"{service.upper():<10}: {result}")
    
    # Overall status
    successful = sum(1 for r in results.values() if r.startswith('✅'))
    total = len(results)
    
    print(f"\n📊 Overall Status: {successful}/{total} services connected")
    
    if successful >= 3:
        print("\n🎉 Great! Your API keys are working!")
        print("✅ You can now test the full Digital Twin functionality")
        print("🌐 Visit: http://localhost:3000")
        print("💬 Try the chat interface with DIGI-EARL")
    else:
        print("\n⚠️ Some services need attention")
        print("🔧 Check your API keys and network connection")
    
    return successful >= 3

if __name__ == "__main__":
    success = asyncio.run(test_api_keys())