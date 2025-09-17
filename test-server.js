const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <html>
      <head><title>Test Server</title></head>
      <body>
        <h1>✅ Node.js HTTP Server Working!</h1>
        <p>Time: ${new Date().toISOString()}</p>
        <p>If you can see this, networking is working.</p>
      </body>
    </html>
  `);
});

server.listen(3333, '127.0.0.1', () => {
  console.log('✅ Test server running at http://127.0.0.1:3333');
  console.log('Try opening this URL in your browser');
});

// Keep server running
setTimeout(() => {
  console.log('Server will stop in 30 seconds...');
  setTimeout(() => {
    console.log('Stopping server...');
    server.close();
    process.exit(0);
  }, 30000);
}, 5000);