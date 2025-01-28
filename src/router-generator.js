const fs = require('fs');
const path = require('path');

const generateFiles = (models, baseDir) => {

    // Cria o diretório para o modelo
    fs.mkdirSync(baseDir, { recursive: true });

    // Conteúdo do arquivo
    let routesHeader = ``;  // Use "let" para permitir a modificação da variável
    models.forEach(modelName => {
        routesHeader +=
            `import ${modelName}Router from "./${modelName.toLowerCase()}/router";
`;
    });

    let routesContent = ``;  // Também usará "let" para poder modificar a variável
    models.forEach(modelName => {
        routesContent += `
    { router: ${modelName}Router, prefix: "/${modelName.toLowerCase()}" },`;
    });

    const fileContent = `
${routesHeader}

const routes = [${routesContent}
];
        
export default routes;
    `;

    const filePath = path.join(baseDir, 'routes.ts');
    fs.writeFileSync(filePath, fileContent);
};

module.exports = generateFiles;
