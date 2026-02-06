// The Path module is a core module in Node.js, so no installation is needed.
// You can import it using either CommonJS or ES modules syntax:
// import fs from "fs"; //Es6 module syntax this is used when you have "type": "module" in your package.json file
// import os from "os";
const fs = require("fs");//CommonJS module syntax by default this is used in Node.js
const os = require("os");

//fs (File System): Provides an API for interacting with the file system (reading, writing, deleting, and updating files and directories).
//os (Operating System): Provides operating system-related utility methods and properties (information about the OS, CPU, memory, etc.).

console.log('cpu size', os.cpus().length);

// Default Thread Pool Size is 4
// You can change it by setting the UV_THREADPOOL_SIZE environment variable
// Maximun thread pool size is based on the number of CPU cores available, but it cannot exceed 128. 
// If you set UV_THREADPOOL_SIZE to a value greater than the number of CPU cores, Node.js will use the maximum number of threads allowed (128) for the thread pool. 

console.log("1");


fs.writeFile('contact.txt', 'varun:9834978189\nram:9826253626', (err) => {
    if (err) {
        console.error('Error writing file:', err);
        return;
    }
    console.log('File written successfully');
});

////Non blocking code
fs.readFile('contact.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log('File content:', data);
});

////Blocking code
// const result = fs.readFileSync("contact.txt", "utf-8");
// console.log("File content:", result);

console.log("2");
