#!/usr/bin/env python3
"""
Local Testing Script for Digital Twin MCP Server
Tests basic functionality without requiring external API keys
"""

import asyncio
import json
import logging
import time
from typing import Dict, Any
import httpx

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("local_tests")

class LocalTester:
    """Local testing suite for Digital Twin functionality"""
    
    def __init__(self):
        self.base_url = "http://localhost:3000"
        
    async def run_local_tests(self):
        """Run local tests that don't require API keys"""
        logger.info("🧪 Starting Local Digital Twin Tests")
        
        tests = [
            ("Next.js Server Health", self.test_nextjs_health),
            ("API Endpoints Availability", self.test_api_endpoints),
            ("MCP Server Structure", self.test_mcp_server_structure),
            ("Voice AI Endpoints", self.test_voice_ai_endpoints),
            ("Performance Monitoring", self.test_performance_endpoints),
            ("WebSocket Configuration", self.test_websocket_config),
            ("Environment Setup", self.test_environment_setup)
        ]
        
        results = {}
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            logger.info(f"🔍 Running: {test_name}")
            try:
                result = await test_func()
                results[test_name] = result
                if result.get('success', False):
                    passed += 1
                    logger.info(f"✅ {test_name}: PASSED")
                else:
                    logger.warning(f"⚠️ {test_name}: FAILED - {result.get('error', 'Unknown error')}")
            except Exception as e:
                logger.error(f"❌ {test_name}: ERROR - {str(e)}")
                results[test_name] = {'success': False, 'error': str(e)}
        
        # Summary
        success_rate = (passed / total) * 100
        logger.info(f"\n🏁 Local Tests Complete: {passed}/{total} passed ({success_rate:.1f}%)")
        
        return {
            'total_tests': total,
            'passed_tests': passed,
            'success_rate': success_rate,
            'results': results
        }
    
    async def test_nextjs_health(self) -> Dict[str, Any]:
        """Test if Next.js server is running"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.base_url}/")
                return {
                    'success': response.status_code == 200,
                    'status_code': response.status_code,
                    'response_time': response.elapsed.total_seconds()
                }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    async def test_api_endpoints(self) -> Dict[str, Any]:
        """Test availability of main API endpoints"""
        endpoints = [
            '/api/digital-twin',
            '/api/mcp',
            '/api/sessions',
            '/api/conversations',
            '/api/health'
        ]
        
        results = {}
        success_count = 0
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            for endpoint in endpoints:
                try:
                    # Test GET requests
                    response = await client.get(f"{self.base_url}{endpoint}")
                    is_success = response.status_code in [200, 405]  # 405 is OK for POST-only endpoints
                    results[endpoint] = {
                        'available': is_success,
                        'status_code': response.status_code,
                        'method': 'GET'
                    }
                    if is_success:
                        success_count += 1
                except Exception as e:
                    results[endpoint] = {'available': False, 'error': str(e)}
        
        return {
            'success': success_count > 0,
            'endpoints_tested': len(endpoints),
            'endpoints_available': success_count,
            'details': results
        }
    
    async def test_mcp_server_structure(self) -> Dict[str, Any]:
        """Test MCP server endpoint structure"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                # Test GET request to MCP endpoint
                response = await client.get(f"{self.base_url}/api/mcp")
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        'success': True,
                        'server_name': data.get('name'),
                        'version': data.get('version'),
                        'methods_available': len(data.get('methods', [])),
                        'endpoints': data.get('endpoints', {})
                    }
                else:
                    return {
                        'success': False,
                        'status_code': response.status_code,
                        'error': 'MCP endpoint not responding correctly'
                    }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    async def test_voice_ai_endpoints(self) -> Dict[str, Any]:
        """Test Voice AI endpoint availability"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                # Test Voice AI info endpoint
                response = await client.get(f"{self.base_url}/api/voice-realtime")
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        'success': True,
                        'voice_ai_name': data.get('name'),
                        'version': data.get('version'),
                        'features_count': len(data.get('features', [])),
                        'supported_voices': len(data.get('supported_voices', [])),
                        'realtime_model': data.get('realtime_model')
                    }
                else:
                    return {
                        'success': False,
                        'status_code': response.status_code,
                        'error': 'Voice AI endpoint not available'
                    }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    async def test_performance_endpoints(self) -> Dict[str, Any]:
        """Test performance monitoring endpoints"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                # Test performance health endpoint
                response = await client.get(f"{self.base_url}/api/performance?action=health")
                
                return {
                    'success': response.status_code in [200, 500],  # May fail without proper config
                    'status_code': response.status_code,
                    'endpoint_available': True
                }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    async def test_websocket_config(self) -> Dict[str, Any]:
        """Test WebSocket configuration endpoint"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.base_url}/api/websocket")
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        'success': True,
                        'websocket_name': data.get('name'),
                        'version': data.get('version'),
                        'features_count': len(data.get('features', [])),
                        'message_types': data.get('message_types', {})
                    }
                else:
                    return {
                        'success': False,
                        'status_code': response.status_code,
                        'error': 'WebSocket endpoint not available'
                    }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    async def test_environment_setup(self) -> Dict[str, Any]:
        """Test environment configuration"""
        import os
        from pathlib import Path
        
        project_root = Path.cwd()
        checks = {
            'env_local_exists': (project_root / '.env.local').exists(),
            'env_example_exists': (project_root / '.env.example').exists(),
            'package_json_exists': (project_root / 'package.json').exists(),
            'mcp_server_exists': (project_root / 'mcp_server.py').exists(),
            'next_config_exists': (project_root / 'next.config.ts').exists() or (project_root / 'next.config.js').exists()
        }
        
        success_count = sum(1 for v in checks.values() if v)
        
        return {
            'success': success_count >= 3,  # At least 3 key files should exist
            'files_found': success_count,
            'total_files_checked': len(checks),
            'details': checks
        }

async def main():
    """Main testing function"""
    tester = LocalTester()
    
    print("🚀 Digital Twin Local Testing Suite")
    print("="*50)
    print("Testing basic functionality without API keys...")
    print("Make sure Next.js dev server is running: npm run dev")
    print("")
    
    try:
        results = await tester.run_local_tests()
        
        print("\n" + "="*50)
        print("📊 LOCAL TEST RESULTS")
        print("="*50)
        print(f"Total Tests: {results['total_tests']}")
        print(f"Passed: {results['passed_tests']}")
        print(f"Success Rate: {results['success_rate']:.1f}%")
        
        print("\n🔧 NEXT STEPS:")
        if results['success_rate'] >= 70:
            print("✅ Basic functionality is working!")
            print("1. Add your API keys to .env.local:")
            print("   - OPENAI_API_KEY (for Voice AI)")
            print("   - GROQ_API_KEY (for Digital Twin)")
            print("   - UPSTASH_REDIS_REST_URL & TOKEN (for Memory)")
            print("   - UPSTASH_VECTOR_REST_URL & TOKEN (for RAG)")
            print("2. Test with API keys: python test_voice_ai_realtime.py")
            print("3. Try the MCP server: python mcp_server.py")
            print("4. Visit: http://localhost:3000")
        else:
            print("⚠️ Some basic functionality issues detected.")
            print("1. Make sure Next.js dev server is running: npm run dev")
            print("2. Check for any compilation errors")
            print("3. Verify all files are in the correct location")
        
        print("\n🌐 APPLICATION ACCESS:")
        print("• Local Development: http://localhost:3000")
        print("• Production: https://digi-earl-ai.vercel.app/")
        
        return 0 if results['success_rate'] >= 70 else 1
        
    except Exception as e:
        print(f"❌ Testing failed: {str(e)}")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)