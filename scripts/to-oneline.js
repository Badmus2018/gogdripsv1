const fs = require('fs');
const path = require('path');

// Input JSON file path (parent of project root)
const filePath = path.join(__dirname, '..', '..', 'gogodrips-firebase-adminsdk-fbsvc-c4c9f9ba07.json');
// Output file path (same directory)
const outputPath = path.join(__dirname, 'firebase-service-account-oneline.txt');

const json = fs.readFileSync(filePath, 'utf8');
const oneline = JSON.stringify(JSON.parse(json));

fs.writeFileSync(outputPath, oneline);
console.log('Done! Output written to', outputPath);
