import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['adopter', 'donor', 'ngo']),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const authService = {
    async register(data: any) {
        const parsedData = registerSchema.parse(data);
        const existing = await prisma.user.findUnique({ where: { email: parsedData.email } });
        if (existing) { throw new Error('Email already registered') };
        const hashed = await bcrypt.hash(parsedData.password, 10);
        const user = await prisma.user.create({
            data: {
                name: parsedData.name,
                email: parsedData.email,
                password: hashed,
                role: parsedData.role,
            },
        });
        return { message: 'User registered successfully', user }
    },

    async login(data: any) {
        const parsed = loginSchema.parse(data);
        const user = await prisma.user.findUnique({ where: { email: parsed.email } });
        if (!user) { throw new Error('Invalid email or password') };
        const isValid = await bcrypt.compare(parsed.password, user.password);
        if (!isValid) { throw new Error('Invalid email or password') };
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        return { message: 'Login successful', token, user };
    }
}