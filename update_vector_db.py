#!/usr/bin/env python3
"""
Update Vector Database with Correct Digital Twin Information
"""

import os
import json

# Load environment variables
from dotenv import load_dotenv
load_dotenv('.env.local')

def main():
    # Initialize Upstash Vector client
    from upstash_vector import Index
    vector_client = Index(
        url=os.getenv('UPSTASH_VECTOR_REST_URL'),
        token=os.getenv('UPSTASH_VECTOR_REST_TOKEN')
    )
    
    # Load the correct digital twin data
    with open('../digitaltwin.json', 'r') as f:
        data = json.load(f)
    
    print("🔥 Deleting old vectors...")
    try:
        # Reset the database by deleting all vectors
        result = vector_client.reset()
        print(f"✅ Database reset successful: {result}")
    except Exception as e:
        print(f"⚠️ Reset failed (might be empty already): {e}")
    
    print("📚 Uploading correct digital twin data...")
    
    # Upload each content chunk with proper embedding
    for i, chunk in enumerate(data['content_chunks']):
        try:
            vector_data = {
                'id': f"earl_{chunk['id']}",
                'data': chunk['content'],
                'metadata': {
                    'title': chunk['title'],
                    'type': chunk['type'],
                    'category': chunk['metadata']['category'],
                    'tags': chunk['metadata']['tags'],
                    'name': 'Earl Sean Lawrence A. Pacho',
                    'source': 'digitaltwin.json'
                }
            }
            
            result = vector_client.upsert([vector_data])
            print(f"✅ Uploaded chunk {i+1}/{len(data['content_chunks'])}: {chunk['title']}")
            
        except Exception as e:
            print(f"❌ Failed to upload {chunk['title']}: {e}")
    
    print("🎉 Vector database update complete!")
    
    # Test a query to verify the data
    print("\n🧪 Testing query...")
    try:
        query_result = vector_client.query(
            data="Who is Earl Sean Lawrence A. Pacho?",
            top_k=3,
            include_metadata=True
        )
        
        print("Query results:")
        for i, result in enumerate(query_result):
            print(f"  {i+1}. Score: {result.score:.4f}")
            print(f"      Title: {result.metadata.get('title', 'N/A')}")
            print(f"      Content: {result.data[:100]}...")
            print()
            
    except Exception as e:
        print(f"❌ Test query failed: {e}")

if __name__ == "__main__":
    main()