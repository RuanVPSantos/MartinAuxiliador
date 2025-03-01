

const fs = require('fs');
const path = require('path');

const generateIndex = (baseDir) => {

    // Cria o diretório para o modelo
    fs.mkdirSync(baseDir, { recursive: true });

    // Conteúdo do arquivo
    const content = `import Fastify from 'fastify';
import cors from '@fastify/cors';
import routes from './api/v1/routes';

const app = Fastify({ logger: true });

const setupCors = () => {
    app.register(cors, {
        origin: '*',
    });
};

const setupHealthCheck = () => {
    app.get('/health', async (request, reply) => {
        return 'System online!';
    });
};

setupCors();
setupHealthCheck();

routes.forEach(({ router, prefix }) => {
    app.register(router, { prefix });
});

const PORT = Number(process.env.PORT) || 3003;

app.listen({ host: '0.0.0.0', port: PORT }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
});`

    const filePath = path.join(baseDir, 'index.ts');
    fs.writeFileSync(filePath, content);
};

module.exports = generateIndex;
