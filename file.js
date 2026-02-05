const fs = require("fs");
const os = require("os");

console.log('cpu size', os.cpus().length);

// Default Thread Pool Size is 4
// You can change it by setting the UV_THREADPOOL_SIZE environment variable
// Maximun thread pool size is based on the number of CPU cores available, but it cannot exceed 128. 
// If you set UV_THREADPOOL_SIZE to a value greater than the number of CPU cores, Node.js will use the maximum number of threads allowed (128) for the thread pool. 

console.log("1");

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
