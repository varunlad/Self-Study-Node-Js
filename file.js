const fs = require("fs");
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
