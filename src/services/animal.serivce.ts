import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import { z } from 'zod';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

const animalSchema = z.object({
    name: z.string(),
    age: z.number().int().nonnegative(),
    species: z.enum(["dog", "cat"]),
    breed: z.string().optional(),
    size: z.string().optional(),
    behavior: z.string().optional(),
    description: z.string().optional(),
    photos: z.array(z.string()).optional(),
    ownerId: z.string().optional(),
    ngoId: z.string().optional()
});

export const animalService = {
    async create(data: any) {
        const parsedData = animalSchema.parse(data);
        const animal = await prisma.animal.create({
            // cast to any to satisfy Prisma's generated types when using parsed Zod output
            data: parsedData as any
        });
        return { message: "Animal created successfully", animal };
    },
    async getAnimals() {
        return prisma.animal.findMany({
            orderBy: { createdAt: "desc" }
        });
    },
    async getAnimalById(id: string) {
        const animal = await prisma.animal.findUnique({ where: { id } });
        if (!animal) throw new Error("Animal not found");
        return animal;
    },

    async updateAnimal(id: string, data: any) {
        const parsed = animalSchema.partial().parse(data);

        const updated = await prisma.animal.update({
            where: { id },
            data: parsed as any
        });

        return { message: "Animal updated", updated };
    },

    async deleteAnimal(id: string) {
        await prisma.animal.delete({ where: { id } });
        return { message: "Animal deleted" };
    }
};