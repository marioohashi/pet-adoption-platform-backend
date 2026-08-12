import { PrismaClient } from "@prisma/client";
import { AnimalDTO } from "../models/animal.model";

const prisma = new PrismaClient();

export class AnimalRepository {
  async create(data: AnimalDTO) {
    return prisma.animal.create({ data });
  }

  async findAll() {
    return prisma.animal.findMany();
  }

  async findById(id: string) {
    return prisma.animal.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<AnimalDTO>) {
    return prisma.animal.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.animal.delete({ where: { id } });
  }
}

