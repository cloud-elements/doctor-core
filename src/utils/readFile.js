const fs = require('fs');

module.exports = async (fileName) => new Promise((resolve) => resolve(JSON.parse(fs.readFileSync(fileName))));
