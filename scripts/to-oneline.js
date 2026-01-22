const fs = require('fs');
const path = require('path');

// Input JSON file path (parent of project root)
const filePath = path.join(__dirname, '..', '..', 'accessnmore-firebase-adminsdk-fbsvc-d5ddea5f15.json');
// Output file path (same directory)
const outputPath = path.join(__dirname, 'firebase-service-account-oneline.txt');

const json = fs.readFileSync(filePath, 'utf8');
const oneline = JSON.stringify(JSON.parse(json));

fs.writeFileSync(outputPath, oneline);
console.log('Done! Output written to', outputPath);
