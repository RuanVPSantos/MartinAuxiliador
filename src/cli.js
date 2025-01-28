#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const generateFiles = require('./schema-generator');
const process = require('process');

const main = (schemaPath) => {
    if (!fs.existsSync(schemaPath)) {
        console.error(`O arquivo de schema não foi encontrado: ${schemaPath}`);
        process.exit(1)
    }

    const projectDir = path.dirname(schemaPath);

    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    const models = schemaContent.match(/model (\w+)/g).map(model => model.split(' ')[1]);

    const baseDir = path.join(projectDir, 'src', 'v1');

    models.forEach(modelName => generateFiles(modelName, baseDir));
};

const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error('Uso: martin-auxiliador <caminho_para_o_schema.prisma>');
    process.exit(1);
}

main(args[0]);
