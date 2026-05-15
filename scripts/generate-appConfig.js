// scripts/generate-appConfig.js
// Converts config/appConfig.ts to public/config/appConfig.js as a global variable for service worker

const fs = require('fs');
const path = require('path');

const tsConfigPath = path.join(__dirname, '../config/appConfig.ts');
const jsConfigPath = path.join(__dirname, '../public/config/appConfig.js');


function stripCommentsAndTrailingCommas(str) {
  // Remove single-line comments
  str = str.replace(/\/\/.*$/gm, '');
  // Remove multi-line comments
  str = str.replace(/\/\*[\s\S]*?\*\//gm, '');
  // Remove trailing commas before } or ]
  str = str.replace(/,\s*([}\]])/g, '$1');
  return str;
}

function extractConfig(tsContent) {
  // Remove TypeScript export and trailing semicolon
  let jsonBlock = tsContent
    .replace(/^export const appConfig = /, '')
    .replace(/;\s*$/, '');
  jsonBlock = stripCommentsAndTrailingCommas(jsonBlock);
  // Try to parse as JS object
  try {
    // eslint-disable-next-line no-eval
    const configObj = eval('(' + jsonBlock + ')');
    return configObj;
  } catch (e) {
    console.error('Failed to parse appConfig.ts:', e);
    process.exit(1);
  }
}

const tsContent = fs.readFileSync(tsConfigPath, 'utf8');
const configObj = extractConfig(tsContent);
const jsContent = 'self.appConfig = ' + JSON.stringify(configObj, null, 2) + ';\n';

fs.writeFileSync(jsConfigPath, jsContent);
console.log('Generated public/config/appConfig.js');
