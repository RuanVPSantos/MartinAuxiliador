const fs = require('fs');
const path = require('path');

// Template functions to generate file content
const generateModelContent = (modelName) => `
import { PrismaClient } from "@prisma/client";
import { I${modelName}, I${modelName}Input, I${modelName}Update } from "../interfaces/${modelName}.interface";

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

const generateServiceContent = (modelName) => `
import I${modelName}Repository from './repository';
import { I${modelName}, I${modelName}Input, I${modelName}Update } from '../../interfaces/${modelName}.interface';

export default class ${modelName}Services {
    private model: I${modelName}Repository;

    constructor(model: I${modelName}Repository) {
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

const generateRepositoryInterfaceContent = (modelName) => `
import { I${modelName}, I${modelName}Input, I${modelName}Update } from "../../../interfaces/${modelName}.interface";

export default interface I${modelName}Repository {
    get${modelName}s(): Promise<I${modelName}[]>;
    get${modelName}ById(id: number): Promise<I${modelName}>;
    create${modelName}(data: I${modelName}Input): Promise<I${modelName}>;
    update${modelName}(id: number, data: I${modelName}Update): Promise<I${modelName}>;
    delete${modelName}(id: number): Promise<I${modelName}>;
}`;

const generateControllerContent = (modelName) => `
import ${modelName}Services from "./service";
import ${modelName}Model from "../../../models/${modelName}.model";
import { I${modelName}, I${modelName}Input, I${modelName}Update } from "../../../interfaces/${modelName}.interface";
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

const generateRouterContent = (modelName) => `
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { checkLogin } from '../utils/check.login';
import { ${modelName}InputSchemaJson, ${modelName}UpdateSchemaJson } from './schemas';
import { I${modelName}Input, I${modelName}Update } from '../../../interfaces/${modelName}.interface';
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

// File type mappings
const fileTemplates = {
    'model': {
        path: (modelName, dirs) => path.join(dirs.modelDir, `${modelName.toLowerCase()}.model.ts`),
        content: generateModelContent
    },
    'service': {
        path: (modelName, dirs) => path.join(dirs.routeDir, 'service.ts'),
        content: generateServiceContent
    },
    'repository': {
        path: (modelName, dirs) => path.join(dirs.routeDir, 'repository.ts'),
        content: generateRepositoryInterfaceContent
    },
    'controller': {
        path: (modelName, dirs) => path.join(dirs.routeDir, 'controller.ts'),
        content: generateControllerContent
    },
    'router': {
        path: (modelName, dirs) => path.join(dirs.routeDir, 'router.ts'),
        content: generateRouterContent
    },
    'interface': {
        path: (modelName, dirs) => path.join(dirs.interfaceDir, `${modelName.toLowerCase()}.interface.ts`),
        content: () => ''
    },
    'schemas': {
        path: (modelName, dirs) => path.join(dirs.routeDir, 'schemas.ts'),
        content: () => ''
    }
};

// Main function to generate all files
const generateFiles = (modelName, baseDir, indexDir) => {
    // Create directories
    const dirs = {
        routeDir: path.join(baseDir, modelName.toLowerCase()),
        interfaceDir: path.join(indexDir, 'interfaces'),
        modelDir: path.join(indexDir, 'models')
    };

    // Ensure directories exist
    Object.values(dirs).forEach(dir => {
        fs.mkdirSync(dir, { recursive: true });
    });

    // Generate each file type
    Object.values(fileTemplates).forEach(template => {
        const filePath = template.path(modelName, dirs);
        const fileContent = template.content(modelName);
        fs.writeFileSync(filePath, fileContent);
    });
};

module.exports = generateFiles;