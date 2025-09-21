#!/usr/bin/env python3
"""
Update Vector Database with Enhanced Digital Twin Information
"""

import os
import json

# Load environment variables
from dotenv import load_dotenv
load_dotenv('.env.local')

def main():
    # Initialize Upstash Vector client
    try:
        from upstash_vector import Index
        vector_client = Index(
            url=os.getenv('UPSTASH_VECTOR_REST_URL'),
            token=os.getenv('UPSTASH_VECTOR_REST_TOKEN')
        )
        print("✅ Connected to Upstash Vector database")
    except Exception as e:
        print(f"❌ Failed to connect to vector database: {e}")
        return
    
    # Load the enhanced digital twin data
    try:
        with open('digitaltwin-enhanced.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✅ Loaded enhanced digital twin data with {len(data['sections'])} sections")
    except Exception as e:
        print(f"❌ Failed to load digital twin data: {e}")
        return
    
    print("🔥 Deleting old vectors...")
    try:
        # Reset the database by deleting all vectors
        result = vector_client.reset()
        print(f"✅ Database reset successful")
    except Exception as e:
        print(f"⚠️ Reset failed (might be empty already): {e}")
    
    print("📚 Uploading enhanced digital twin data...")
    
    # Upload each section with proper embedding
    uploaded_count = 0
    for i, section in enumerate(data['sections']):
        try:
            vector_data = {
                'id': f"earl_{section['id']}",
                'data': section['content'],
                'metadata': {
                    'title': section['title'],
                    'type': section['type'],
                    'category': section['category'],
                    'tags': section['tags'],
                    'name': data['name'],
                    'source': 'digitaltwin-enhanced.json',
                    'section_id': section['id']
                }
            }
            
            result = vector_client.upsert([vector_data])
            print(f"✅ Uploaded section {i+1}/{len(data['sections'])}: {section['title']}")
            uploaded_count += 1
            
        except Exception as e:
            print(f"❌ Failed to upload {section['title']}: {e}")
    
    print(f"🎉 Vector database update complete! Uploaded {uploaded_count}/{len(data['sections'])} sections")
    
    # Test queries to verify the data
    print("\n🧪 Testing queries...")
    
    test_queries = [
        "What does Earl study?",
        "What are Earl's hobbies?", 
        "Tell me about Earl's career goals",
        "What games does Earl play?",
        "What is Earl's study routine?",
        "Tell me about Earl's family"
    ]
    
    for query in test_queries:
        try:
            print(f"\n🔍 Query: {query}")
            query_result = vector_client.query(
                data=query,
                top_k=2,
                include_metadata=True
            )
            
            if query_result:
                for i, result in enumerate(query_result):
                    print(f"  {i+1}. Score: {result.score:.3f} - {result.metadata.get('title', 'N/A')}")
            else:
                print("  No results found")
                
        except Exception as e:
            print(f"❌ Test query failed: {e}")

    print("\n🎯 Database update and testing complete!")
    print("Your DIGI-EARL now has comprehensive knowledge about:")
    print("  • Academic life at SPUP")
    print("  • Career goals and work preferences") 
    print("  • Hobbies, gaming, and personal interests")
    print("  • Study habits and learning style")
    print("  • Family, personality, and lifestyle")
    print("  • Technology preferences and dislikes")
    print("  • Future plans and material goals")

if __name__ == "__main__":
    main()