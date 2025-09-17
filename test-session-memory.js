require('dotenv').config({ path: '.env.local' });
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Test script to validate session memory functionality
async function testSessionMemory() {
    console.log('🧪 Testing DIGI-EARL Session Memory System...\n');
    
    const baseUrl = 'http://localhost:3000/api';
    
    // Test 1: Create a new session
    console.log('📝 Test 1: Creating new session...');
    const createResponse = await fetch(`${baseUrl}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create' })
    });
    const sessionData = await createResponse.json();
    console.log('✅ Session created:', sessionData.sessionId);
    
    // Test 2: Send a message with user name
    console.log('\n📝 Test 2: Sending message with user name...');
    const chatResponse = await fetch(`${baseUrl}/digital-twin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: "Hi, my name is John Doe and I want to know about Earl's projects",
            sessionId: sessionData.sessionId
        })
    });
    const chatData = await chatResponse.json();
    console.log('✅ Chat response received');
    
    // Test 3: Validate session exists
    console.log('\n📝 Test 3: Validating session exists...');
    const validateResponse = await fetch(`${baseUrl}/sessions?action=validate&sessionId=${sessionData.sessionId}`);
    const validateData = await validateResponse.json();
    console.log('✅ Session validation:', validateData);
    
    // Test 4: Send follow-up message without name
    console.log('\n📝 Test 4: Sending follow-up message...');
    const followupResponse = await fetch(`${baseUrl}/digital-twin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: "What are Earl's technical skills?",
            sessionId: sessionData.sessionId
        })
    });
    const followupData = await followupResponse.json();
    console.log('✅ Follow-up response received');
    
    // Test 5: Check if name is remembered in response
    const remembersName = followupData.response.toLowerCase().includes('john');
    console.log(`${remembersName ? '✅' : '❌'} Name memory test:`, remembersName ? 'PASSED' : 'FAILED');
    
    // Test 6: Test invalid session validation
    console.log('\n📝 Test 6: Testing invalid session validation...');
    const invalidValidateResponse = await fetch(`${baseUrl}/sessions?action=validate&sessionId=invalid-session-id`);
    const invalidValidateData = await invalidValidateResponse.json();
    console.log('✅ Invalid session validation:', invalidValidateData);
    
    console.log('\n🎉 All tests completed!');
    return {
        sessionCreated: !!sessionData.sessionId,
        sessionValid: validateData.exists,
        nameRemembered: remembersName,
        invalidSessionHandled: !invalidValidateData.exists
    };
}

// Run the test
testSessionMemory()
    .then(results => {
        console.log('\n📊 Test Results Summary:');
        console.log('- Session Creation:', results.sessionCreated ? '✅ PASS' : '❌ FAIL');
        console.log('- Session Validation:', results.sessionValid ? '✅ PASS' : '❌ FAIL');
        console.log('- Name Memory:', results.nameRemembered ? '✅ PASS' : '❌ FAIL');
        console.log('- Invalid Session Handling:', results.invalidSessionHandled ? '✅ PASS' : '❌ FAIL');
        
        const allPassed = Object.values(results).every(result => result === true);
        console.log('\n🏆 Overall Result:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
    })
    .catch(error => {
        console.error('❌ Test failed:', error);
    });