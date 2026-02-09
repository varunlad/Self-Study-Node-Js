// const varun = require('./second.js');
// const os = require('os');
// const path = require('path');
// console.log('Hello World!');
// console.log(varun);
// console.log('Operating System Info:', os.freemem(), os.userInfo());
// console.log('Path Info:', path.dirname(__filename));

// Import the HTTP module
const http = require('http');

// Create a server object
const server = http.createServer((req, res) => {
  // Set the response HTTP header with HTTP status and Content type
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Send the response body as 'Hello, World!'
  res.end('Hello, World!\n');
});

// Define the port to listen on const PORT = 3000;

// Start the server and listen on the specified port
server.listen(3000, 'localhost', () => {
  console.log(`Server running at http://localhost:3000/`);
});