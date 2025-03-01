#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const generateFiles = require('./schema-generator');
const generateRouter = require('./router-generator');
const generateIndex = require('./index-generator');
const generateUtils = require('./utils-generator');
const process = require('process');

const main = (schemaPath) => {
    if (!fs.existsSync(schemaPath)) {
        console.error(`O arquivo de schema não foi encontrado: ${schemaPath}`);
        process.exit(1);
    }

    const projectDir = path.dirname(schemaPath);

    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    const models = schemaContent.match(/model (\w+)/g).map(model => model.split(' ')[1]);

    const baseDir = path.join(projectDir, 'src', 'api', 'v1');
    const indexDir = path.join(projectDir, 'src');

    models.forEach(modelName => generateFiles(modelName, baseDir, indexDir));
    generateRouter(models, baseDir);
    generateIndex(indexDir);
    generateUtils(baseDir);


    // Mensagem ao final
    console.log("Para instalar as libs, digite o seguinte: \npnpm add bcrypt dotenv jsonwebtoken zod fastify @fastify/cors @prisma/client zod-to-json-schema\npnpm add -D ts-node typescript prisma @types/bcrypt @types/cors @types/node")
    console.log("\nConfira o código fonte no GitHub: \nhttps://github.com/RuanVPSantos/MartinAuxiliador");
    console.log("Para preencher os seus arquivos 'interface.ts' e 'schema.ts', por favor, acesse o link:");
    console.log("https://poe.com/Martin-Auxiliador");
};

const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error('Uso: martin-auxiliador <caminho_para_o_schema.prisma>');
    process.exit(1);
}

main(args[0]);