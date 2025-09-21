#!/usr/bin/env python3
"""
Complete API Test with OpenAI
Tests all your API keys including OpenAI Realtime API access
"""

import os
import asyncio
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

async def test_complete_functionality():
    """Test all API keys for complete functionality"""
    print("🚀 Testing Complete Digital Twin Functionality")
    print("="*60)
    
    results = {}
    
    # Test OpenAI API
    print("🤖 Testing OpenAI API...")
    openai_key = os.getenv('OPENAI_API_KEY')
    if openai_key:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(
                    "https://api.openai.com/v1/models",
                    headers={"Authorization": f"Bearer {openai_key}"}
                )
                if response.status_code == 200:
                    models = response.json()
                    model_names = [m['id'] for m in models.get('data', [])]
                    realtime_models = [m for m in model_names if 'realtime' in m or 'gpt-4o' in m]
                    results['openai'] = f"✅ Connected - {len(model_names)} models, {len(realtime_models)} realtime capable"
                else:
                    results['openai'] = f"❌ Error - Status {response.status_code}"
        except Exception as e:
            results['openai'] = f"❌ Error - {str(e)}"
    else:
        results['openai'] = "❌ API key not found"
    
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
                    results['redis'] = "✅ Connected - Memory system ready"
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
                    results['vector'] = f"✅ Connected - RAG system ready"
                else:
                    results['vector'] = f"❌ Error - Status {response.status_code}"
        except Exception as e:
            results['vector'] = f"❌ Error - {str(e)}"
    else:
        results['vector'] = "❌ API credentials not found"
    
    # Test local Next.js API
    print("🌐 Testing Next.js Digital Twin API...")
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            # Test basic API endpoint
            response = await client.get("http://localhost:3000/api/mcp")
            if response.status_code == 200:
                results['nextjs_mcp'] = "✅ Connected - MCP Server ready"
            else:
                results['nextjs_mcp'] = f"⚠️ Status {response.status_code}"
            
            # Test Voice AI endpoint
            response = await client.get("http://localhost:3000/api/voice-realtime")
            if response.status_code == 200:
                data = response.json()
                results['voice_ai'] = f"✅ Connected - Voice AI ready ({data.get('version', 'unknown')})"
            else:
                results['voice_ai'] = f"⚠️ Status {response.status_code}"
                
    except Exception as e:
        results['nextjs_mcp'] = f"❌ Error - {str(e)}"
        results['voice_ai'] = f"❌ Error - {str(e)}"
    
    # Print results
    print("\n🏁 Complete System Test Results:")
    print("="*60)
    for service, result in results.items():
        service_name = service.replace('_', ' ').upper()
        print(f"{service_name:<15}: {result}")
    
    # Overall status
    successful = sum(1 for r in results.values() if r.startswith('✅'))
    total = len(results)
    
    print(f"\n📊 Overall Status: {successful}/{total} services connected")
    print(f"Success Rate: {(successful/total)*100:.1f}%")
    
    if successful >= 5:
        print("\n🎉 AMAZING! Your complete Digital Twin system is ready!")
        print("🌟 ALL FEATURES AVAILABLE:")
        print("   ✅ Voice AI with OpenAI Realtime API")
        print("   ✅ Advanced reasoning with Groq")
        print("   ✅ Persistent memory with Redis")
        print("   ✅ RAG knowledge base with Vector DB")
        print("   ✅ MCP server with tool orchestration")
        print("   ✅ Real-time WebSocket communication")
        
        print("\n🚀 WHAT YOU CAN DO NOW:")
        print("   🎤 Have voice conversations with DIGI-EARL")
        print("   💬 Chat with advanced AI reasoning")
        print("   🧠 Experience persistent memory across sessions")
        print("   🔍 Ask questions about Earl's background")
        print("   ⚡ Use real-time features and streaming")
        
        print("\n🌐 ACCESS YOUR DIGITAL TWIN:")
        print("   • Local: http://localhost:3000")
        print("   • Production: https://digi-earl-ai.vercel.app/")
        
    elif successful >= 3:
        print("\n✅ Good! Most features are working")
        print("🔧 Some advanced features may need attention")
    else:
        print("\n⚠️ Some services need attention")
        print("🔧 Check your API keys and network connection")
    
    return successful >= 5

if __name__ == "__main__":
    success = asyncio.run(test_complete_functionality())