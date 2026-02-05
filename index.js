const varun = require('./second.js');
const os = require('os');
const path = require('path');
console.log('Hello World!');
console.log(varun);
console.log('Operating System Info:', os.freemem(), os.userInfo());
console.log('Path Info:', path.dirname(__filename));