const fs = require('fs');
const path = require('path');
const generateFiles = require('./schema-generator');

const main = (schemaPath) => {
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    const models = schemaContent.match(/model (\w+)/g).map(model => model.split(' ')[1]);

    const baseDir = path.join(__dirname, 'src', 'v1');

    models.forEach(modelName => generateFiles(modelName, baseDir));
};

module.exports = main;
