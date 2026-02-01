const path = require('path');
const fs = require('fs');

const relativePath = '../../ai_model/ai_engine';
const absolutePath = path.resolve(__dirname, relativePath);

console.log('Current __dirname:', __dirname);
console.log('Trying to require relative:', relativePath);
console.log('Resolved absolute path:', absolutePath);

if (fs.existsSync(absolutePath + '.js')) {
    console.log('File EXISTS at path: ' + absolutePath + '.js');
} else {
    console.log('File DOES NOT EXIST at path: ' + absolutePath + '.js');
    // List parent dir
    const parentDir = path.dirname(absolutePath);
    console.log(`Listing contents of ${parentDir}:`);
    try {
        console.log(fs.readdirSync(parentDir));
    } catch (e) {
        console.log('Could not list parent dir');
    }
}

try {
    const aiEngine = require(absolutePath);
    console.log('Require SUCCESS');
} catch (e) {
    console.error('Require FAILED');
    console.error('Message:', e.message);
    console.error('Code:', e.code);
    if (e.code === 'MODULE_NOT_FOUND') {
        console.error('Missing Module:', e.requireStack);
    }
}
