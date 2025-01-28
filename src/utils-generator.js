const fs = require('fs');
const path = require('path');

const generateUtils = (baseDir) => {
  const utilsDir = path.join(baseDir, "utils");

  fs.mkdirSync(utilsDir, { recursive: true });

  // Conteúdo dos arquivos
  const authContent = `import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const SALT_ROUNDS = 10;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export class Auth {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  static generateToken(user: string, id: number): string {
    return jwt.sign({ user, id }, JWT_SECRET, { expiresIn: '48h' });
  }

  static verifyToken(token: string): { user: string, id: number } {
    return jwt.verify(token, JWT_SECRET) as { user: string, id: number };
  }
}`;
  const checkContent = `import { Auth } from "./auth";
import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
    interface FastifyRequest {
        user?: { id: string };
    }
}

export const checkLogin = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return reply.status(401).send({ message: 'Authorization token is missing' });
        }

        const { id } = await Auth.verifyToken(token);

        req.user = { id };
    } catch (error) {
        return reply.status(401).send({ message: 'Invalid token' });
    }
};`;

  const getPrismaPrincipalContent = `import { PrismaClient } from "@prisma/client";

let prismaPrincipal: PrismaClient | null = null;

export function getPrismaPrincipal(): PrismaClient {
    if (!prismaPrincipal) {
        prismaPrincipal = new PrismaClient();
    }
    return prismaPrincipal;
}
`;

  // Cria os arquivos
  fs.writeFileSync(path.join(utilsDir, 'auth.ts'), authContent);
  fs.writeFileSync(path.join(utilsDir, 'check.login.ts'), checkContent);
  fs.writeFileSync(path.join(utilsDir, 'prisma.clients.ts'), getPrismaPrincipalContent);
};

module.exports = generateUtils;
