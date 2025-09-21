// Simple OpenAI API Test
// Run this in browser console or as a test endpoint

const testOpenAIAPI = async () => {
  try {
    console.log('Testing OpenAI API access...')
    
    // Test basic chat completion
    const chatResponse = await fetch('/api/digital-twin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'Hi, can you tell me about Earl? Just a quick test.'
      })
    })
    
    console.log('Chat API Status:', chatResponse.status)
    
    if (chatResponse.ok) {
      const chatData = await chatResponse.json()
      console.log('✅ Chat API working:', chatData.response?.substring(0, 100) + '...')
    } else {
      console.log('❌ Chat API failed:', await chatResponse.text())
    }
    
    // Test voice API
    console.log('Testing Voice API access...')
    const voiceResponse = await fetch('/api/voice-chat', {
      method: 'GET'
    })
    
    console.log('Voice API Status:', voiceResponse.status)
    
    if (voiceResponse.ok) {
      const voiceData = await voiceResponse.json()
      console.log('✅ Voice API endpoint accessible:', voiceData.status)
    } else {
      console.log('❌ Voice API failed:', await voiceResponse.text())
    }
    
  } catch (error) {
    console.error('API Test Error:', error)
  }
}

// Run the test
testOpenAIAPI()