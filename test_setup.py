#!/usr/bin/env python3
"""
Simple local testing without external dependencies
Tests the basic structure and files
"""

import os
import json
from pathlib import Path

def test_local_setup():
    """Test local project setup"""
    print("🧪 Testing Digital Twin Local Setup")
    print("="*50)
    
    project_root = Path.cwd()
    
    # Check essential files
    files_to_check = {
        'package.json': 'Next.js project configuration',
        '.env.local': 'Environment variables',
        '.env.example': 'Environment template',
        'mcp_server.py': 'MCP Server implementation',
        'test_voice_ai_realtime.py': 'Voice AI tests',
        'OPENAI_SETUP_GUIDE.md': 'API setup guide',
        'PROJECT_COMPLETION_REPORT.md': 'Project summary'
    }
    
    print("📁 FILE STRUCTURE CHECK:")
    for file_name, description in files_to_check.items():
        file_path = project_root / file_name
        status = "✅" if file_path.exists() else "❌"
        print(f"{status} {file_name:<30} - {description}")
    
    print("\n📦 DIRECTORY STRUCTURE CHECK:")
    directories_to_check = {
        'app/api': 'Next.js API routes',
        'app/components': 'React components',
        'app/lib': 'Utility libraries',
        'public': 'Static assets',
        '.venv': 'Python virtual environment'
    }
    
    for dir_name, description in directories_to_check.items():
        dir_path = project_root / dir_name
        status = "✅" if dir_path.exists() else "❌"
        print(f"{status} {dir_name:<30} - {description}")
    
    # Check package.json content
    print("\n📋 PACKAGE.JSON ANALYSIS:")
    package_json_path = project_root / 'package.json'
    if package_json_path.exists():
        try:
            with open(package_json_path, 'r') as f:
                package_data = json.load(f)
            
            print(f"✅ Project Name: {package_data.get('name', 'N/A')}")
            print(f"✅ Version: {package_data.get('version', 'N/A')}")
            print(f"✅ Dependencies: {len(package_data.get('dependencies', {}))}")
            print(f"✅ Dev Dependencies: {len(package_data.get('devDependencies', {}))}")
            
            # Check for key dependencies
            dependencies = package_data.get('dependencies', {})
            key_deps = ['next', 'react', 'openai', '@upstash/redis', '@upstash/vector', 'groq-sdk']
            
            print("\n🔍 KEY DEPENDENCIES:")
            for dep in key_deps:
                if dep in dependencies:
                    print(f"✅ {dep:<20} - {dependencies[dep]}")
                else:
                    print(f"❌ {dep:<20} - Missing")
                    
        except Exception as e:
            print(f"❌ Error reading package.json: {e}")
    else:
        print("❌ package.json not found")
    
    # Check environment setup
    print("\n🔧 ENVIRONMENT SETUP:")
    env_local_path = project_root / '.env.local'
    if env_local_path.exists():
        print("✅ .env.local exists")
        try:
            with open(env_local_path, 'r') as f:
                env_content = f.read()
                
            # Check for key environment variables (without revealing values)
            key_env_vars = [
                'OPENAI_API_KEY',
                'GROQ_API_KEY', 
                'UPSTASH_REDIS_REST_URL',
                'UPSTASH_VECTOR_REST_URL'
            ]
            
            for var in key_env_vars:
                if var in env_content:
                    # Check if it has a real value (not the placeholder)
                    lines = env_content.split('\n')
                    for line in lines:
                        if line.startswith(f'{var}='):
                            value = line.split('=', 1)[1].strip()
                            if value and not value.startswith('your_'):
                                print(f"✅ {var:<25} - Configured")
                            else:
                                print(f"⚠️ {var:<25} - Needs API key")
                            break
                    else:
                        print(f"❌ {var:<25} - Not found")
                else:
                    print(f"❌ {var:<25} - Not found")
                    
        except Exception as e:
            print(f"❌ Error reading .env.local: {e}")
    else:
        print("⚠️ .env.local not found - environment variables not set")
    
    print("\n🎯 TESTING RECOMMENDATIONS:")
    print("1. Make sure Next.js dev server is running:")
    print("   → npm run dev")
    print("   → Visit: http://localhost:3000")
    
    print("\n2. To test with API keys:")
    print("   → Update .env.local with your actual API keys")
    print("   → Run: python test_voice_ai_realtime.py")
    
    print("\n3. Available test scripts:")
    print("   → python test_local.py (basic functionality)")
    print("   → python test_voice_ai_realtime.py (with API keys)")
    print("   → python deploy_advanced_mcp.py (full deployment)")
    
    print("\n4. Key URLs to test:")
    print("   → http://localhost:3000 (main application)")
    print("   → http://localhost:3000/api/mcp (MCP server info)")
    print("   → http://localhost:3000/api/voice-realtime (Voice AI info)")
    
    print("\n" + "="*50)
    print("🎉 Local setup check complete!")
    print("Your Digital Twin MCP Server is ready for testing!")

if __name__ == "__main__":
    test_local_setup()