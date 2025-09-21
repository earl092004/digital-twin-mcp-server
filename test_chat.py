#!/usr/bin/env python3
"""
Live Chat Test - Test DIGI-EARL conversation
"""

import asyncio
import httpx
import json

async def test_chat():
    """Test the chat functionality directly"""
    print("💬 Testing DIGI-EARL Chat Functionality")
    print("="*50)
    
    questions = [
        "Hello! Can you tell me about Earl?",
        "What are Earl's technical skills?",
        "Tell me about Earl's projects"
    ]
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        for i, question in enumerate(questions, 1):
            print(f"\n🤔 Question {i}: {question}")
            
            try:
                response = await client.post(
                    "http://localhost:3000/api/digital-twin",
                    json={"question": question},
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success'):
                        print(f"✅ DIGI-EARL Response:")
                        print(f"📝 {data.get('response', 'No response')[:200]}...")
                        if data.get('sessionId'):
                            print(f"🔗 Session ID: {data['sessionId'][:20]}...")
                    else:
                        print(f"⚠️ Response failed: {data.get('error', 'Unknown error')}")
                else:
                    print(f"❌ HTTP Error: {response.status_code}")
                    print(f"Response: {response.text[:200]}")
                
            except Exception as e:
                print(f"❌ Request failed: {str(e)}")
            
            # Small delay between requests
            await asyncio.sleep(1)
    
    print(f"\n🎉 Chat test completed!")
    print(f"🌐 Your Digital Twin is live at: http://localhost:3000")

if __name__ == "__main__":
    asyncio.run(test_chat())