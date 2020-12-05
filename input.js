const fs = require('fs');

module.exports = (inputFile) => fs.readFileSync(inputFile, 'utf-8');
