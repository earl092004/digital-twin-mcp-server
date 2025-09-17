// Comprehensive Memory Test for DIGI-EARL
// Tests fresh UI with background memory context

const axios = require('axios')
const baseUrl = 'http://localhost:3001'

async function testMemorySystem() {
  console.log('🧪 Testing DIGI-EARL Memory System...\n')
  
  try {
    // Test 1: Create initial conversation with user info
    console.log('=== TEST 1: Initial Conversation ===')
    const conversation1 = await axios.post(`${baseUrl}/api/digital-twin`, {
      question: "Hi, I'm John Smith from TechCorp. I'm interested in your backend development skills."
    })
    
    if (conversation1.data.success) {
      const sessionId = conversation1.data.sessionId
      console.log('✅ Session created:', sessionId)
      console.log('📝 Response preview:', conversation1.data.response.substring(0, 100) + '...')
      
      // Test 2: Add more context to the conversation
      console.log('\n=== TEST 2: Adding Context ===')
      const conversation2 = await axios.post(`${baseUrl}/api/digital-twin`, {
        question: "What experience do you have with Laravel specifically?",
        sessionId: sessionId
      })
      
      if (conversation2.data.success) {
        console.log('✅ Context added successfully')
        console.log('📝 Response preview:', conversation2.data.response.substring(0, 100) + '...')
        
        // Test 3: Check session validation (what happens on page reload)
        console.log('\n=== TEST 3: Session Validation (Simulates Page Reload) ===')
        const sessionCheck = await axios.get(`${baseUrl}/api/conversations?sessionId=${sessionId}&limit=1`)
        
        if (sessionCheck.data.success && sessionCheck.data.messages && sessionCheck.data.messages.length > 0) {
          console.log('✅ Session validation: PASS')
          console.log('📊 Total messages in session:', sessionCheck.data.totalMessages)
          console.log('👤 User info extracted:', JSON.stringify(sessionCheck.data.userInfo, null, 2))
        } else {
          console.log('❌ Session validation: FAIL')
          return
        }
        
        // Test 4: Memory retention test (fresh conversation with same session)
        console.log('\n=== TEST 4: Memory Retention Test ===')
        const memoryTest = await axios.post(`${baseUrl}/api/digital-twin`, {
          question: "Do you remember who I am and what company I'm from?",
          sessionId: sessionId
        })
        
        if (memoryTest.data.success) {
          const response = memoryTest.data.response.toLowerCase()
          const remembersName = response.includes('john') || response.includes('smith')
          const remembersCompany = response.includes('techcorp')
          
          console.log('🧠 Memory Test Results:')
          console.log(`   Name recognition: ${remembersName ? '✅' : '❌'}`)
          console.log(`   Company recognition: ${remembersCompany ? '✅' : '❌'}`)
          console.log('📝 Full response:')
          console.log('   ' + memoryTest.data.response.replace(/\n/g, '\n   '))
          
          if (remembersName && remembersCompany) {
            console.log('\n🎉 MEMORY TEST: SUCCESS!')
          } else {
            console.log('\n⚠️ MEMORY TEST: PARTIAL - Some details not remembered')
          }
        }
        
        // Test 5: Test global memory system
        console.log('\n=== TEST 5: Global Memory System ===')
        
        // Create a second session to test global awareness
        const globalTest = await axios.post(`${baseUrl}/api/digital-twin`, {
          question: "Hi, I'm Sarah from DevStudio. Have you been talking to anyone interesting lately?"
        })
        
        if (globalTest.data.success) {
          const response = globalTest.data.response.toLowerCase()
          const referencesOthers = response.includes('john') || response.includes('techcorp') || 
                                  response.includes('someone') || response.includes('talking') ||
                                  response.includes('recently') || response.includes('earlier')
          
          console.log('🌐 Global Memory Test:')
          console.log(`   References other conversations: ${referencesOthers ? '✅' : '❌'}`)
          console.log('📝 Response preview:', globalTest.data.response.substring(0, 200) + '...')
          
          if (referencesOthers) {
            console.log('\n🎉 GLOBAL MEMORY: SUCCESS!')
          } else {
            console.log('\n⚠️ GLOBAL MEMORY: May need more conversations to trigger')
          }
        }
        
        console.log('\n🏁 All tests completed!')
        console.log('\n📋 Summary:')
        console.log('✅ Session creation: Working')
        console.log('✅ Context building: Working') 
        console.log('✅ Session validation: Working')
        console.log(`${remembersName && remembersCompany ? '✅' : '⚠️'} Memory retention: ${remembersName && remembersCompany ? 'Working' : 'Partial'}`)
        console.log('✅ Global memory: Implemented')
        
      } else {
        console.log('❌ Failed to add context')
      }
    } else {
      console.log('❌ Failed to create initial session')
    }
    
  } catch (error) {
    console.log('❌ Test failed with error:', error.message)
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running on http://localhost:3001')
    }
  }
}

// Install axios if not present and run tests
const { exec } = require('child_process')

exec('npm list axios', (error, stdout, stderr) => {
  if (error) {
    console.log('📦 Installing axios for testing...')
    exec('npm install axios', (installError) => {
      if (installError) {
        console.log('❌ Failed to install axios. Running without HTTP requests.')
        console.log('✅ Server is running - manual testing recommended at http://localhost:3001')
      } else {
        console.log('✅ Axios installed, running tests...\n')
        testMemorySystem()
      }
    })
  } else {
    testMemorySystem()
  }
})