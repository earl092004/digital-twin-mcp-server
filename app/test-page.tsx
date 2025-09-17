export default function TestPage() {
  return (
    <div>
      <h1>DIGI-EARL Simple Test</h1>  
      <p>Server is working if you can see this!</p>
      <p>Current time: {new Date().toISOString()}</p>
    </div>
  )
}