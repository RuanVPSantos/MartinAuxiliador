const fs = require('fs');
const path = require('path');

const generateFiles = (modelName, baseDir) => {
    const modelDir = path.join(baseDir, modelName.toLowerCase());

    // Cria o diretório para o modelo
    fs.mkdirSync(modelDir, { recursive: true });

    // Conteúdo dos arquivos
    const modelContent = `
import { PrismaClient } from "@prisma/client";
import { I${modelName}, I${modelName}Input, I${modelName}Update } from "./interface";

export default class ${modelName}Model {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async create${modelName}(data: I${modelName}Input): Promise<I${modelName}> {
        return await this.prisma.${modelName.toLowerCase()}.create({ data });
    }

    async get${modelName}s(): Promise<I${modelName}[]> {
        return await this.prisma.${modelName.toLowerCase()}.findMany();
    }

    async get${modelName}ById(id: number): Promise<I${modelName}> {
        return await this.prisma.${modelName.toLowerCase()}.findUniqueOrThrow({ where: { id } });
    }

    async update${modelName}(id: number, data: I${modelName}Update): Promise<I${modelName}> {
        return await this.prisma.${modelName.toLowerCase()}.update({ where: { id }, data });
    }

    async delete${modelName}(id: number): Promise<I${modelName}> {
        return await this.prisma.${modelName.toLowerCase()}.delete({ where: { id } });
    }
}`;

    const serviceContent = `
import ${modelName}Model from './model';
import { I${modelName}, I${modelName}Input, I${modelName}Update } from './interface';

export default class ${modelName}Services {
    private model: ${modelName}Model;

    constructor(model: ${modelName}Model) {
        this.model = model;
    }

    async getAll${modelName}s(): Promise<I${modelName}[]> {
        try {
            return await this.model.get${modelName}s();
        } catch (error) {
            throw error;
        }
    }

    async get${modelName}ById(id: number): Promise<I${modelName}> {
        try {
            return await this.model.get${modelName}ById(id);
        } catch (error) {
            throw error;
        }
    }

    async create${modelName}(data: I${modelName}Input): Promise<I${modelName}> {
        try {
            return await this.model.create${modelName}(data);
        } catch (error) {
            throw error;
        }
    }

    async update${modelName}(id: number, data: I${modelName}Update): Promise<I${modelName}> {
        try {
            return await this.model.update${modelName}(id, data);
        } catch (error) {
            throw error;
        }
    }

    async delete${modelName}(id: number): Promise<I${modelName}> {
        try {
            return await this.model.delete${modelName}(id);
        } catch (error) {
            throw error;
        }
    }
}`;

    const controllerContent = `
import ${modelName}Services from "./service";
import ${modelName}Model from "./model";
import { I${modelName}, I${modelName}Input, I${modelName}Update } from "./interface";
import { getPrismaPrincipal } from "../utils/prisma.clients";

const modelService = new ${modelName}Services(new ${modelName}Model(getPrismaPrincipal()));

export default class ${modelName}Controller {
    async getAll${modelName}s(): Promise<I${modelName}[]> {
        return await modelService.getAll${modelName}s();
    }
    async get${modelName}ById(id: number): Promise<I${modelName}> {
        return await modelService.get${modelName}ById(id);
    }

    async create${modelName}(data: I${modelName}Input): Promise<I${modelName}> {
        return await modelService.create${modelName}(data);
    }

    async update${modelName}(id: number, data: I${modelName}Update): Promise<I${modelName}> {
        return await modelService.update${modelName}(id, data);
    }

    async delete${modelName}(id: number): Promise<I${modelName}> {
        return await modelService.delete${modelName}(id);
    }
}`;

    const routerContent = `
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { checkLogin } from '../utils/check.login';
import { ${modelName}InputSchemaJson, ${modelName}UpdateSchemaJson } from './schemas';
import { I${modelName}Input, I${modelName}Update } from './interface';
import ${modelName}Controller from './controller';

const modelController = new ${modelName}Controller();

async function ${modelName}Router(fastify: FastifyInstance) {
    fastify.get('/all',
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const models = await modelController.getAll${modelName}s();
                return reply.status(200).send(models);
            } catch (error) {
                console.error('Error fetching models:', error);
                return reply.status(500).send({ message: 'Internal server error' });
            }
        }
    );

    fastify.get('/:id',
        {
            preHandler: [checkLogin],
            schema: {
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                    },
                    required: ['id'],
                },
            },
        },
        async (request, reply) => {
            try {
                const { id } = request.params as { id: string };
                const model = await modelController.get${modelName}ById(parseInt(id, 10));
                return reply.status(200).send(model);
            } catch (error) {
                console.error('Error fetching model:', error);
                return reply.status(500).send({ message: 'Internal server error' });
            }
        }
    );

    fastify.post('/', 
        {
            preHandler: [checkLogin],
            schema: {
                body: ${modelName}InputSchemaJson,
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const data = request.body as I${modelName}Input;
                const model = await modelController.create${modelName}(data);
                return reply.status(200).send(model);
            } catch (error) {
                console.error('Error creating model:', error);
                return reply.status(500).send({ message: 'Internal server error' });
            }
        }
    );

    fastify.put('/:id',
        {
            preHandler: [checkLogin],
            schema: {
                body: ${modelName}UpdateSchemaJson,
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                    },
                    required: ['id'],
                },
            },
        },
        async (request, reply) => {
            try {
                const { id } = request.params as { id: string };
                const data = request.body as I${modelName}Update;
                const model = await modelController.update${modelName}(parseInt(id, 10), data);
                return reply.status(200).send(model);
            } catch (error) {
                console.error('Error updating model:', error);
                return reply.status(500).send({ message: 'Internal server error' });
            }
        }
    );

    fastify.delete('/:id',
        {
            preHandler: [checkLogin],
            schema: {
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                    },
                    required: ['id'],
                },
            },
        },
        async (request, reply) => {
            try {
                const { id } = request.params as { id: string };
                const model = await modelController.delete${modelName}(parseInt(id, 10));
                return reply.status(200).send(model);
            } catch (error) {
                console.error('Error deleting model:', error);
                return reply.status(500).send({ message: 'Internal server error' });
            }
        }
    );
}

export default ${modelName}Router;`;

    // Cria os arquivos
    fs.writeFileSync(path.join(modelDir, 'interface.ts'), '');
    fs.writeFileSync(path.join(modelDir, 'schemas.ts'), '');
    fs.writeFileSync(path.join(modelDir, 'model.ts'), modelContent);
    fs.writeFileSync(path.join(modelDir, 'service.ts'), serviceContent);
    fs.writeFileSync(path.join(modelDir, 'controller.ts'), controllerContent);
    fs.writeFileSync(path.join(modelDir, 'router.ts'), routerContent);
};

module.exports = generateFiles;
