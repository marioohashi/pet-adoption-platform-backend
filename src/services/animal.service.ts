import { Prisma } from '@prisma/client';
import prisma from '../../prisma/client';

export class AnimalService {
  async getAll() {
    return prisma.animal.findMany();
  }

  async create(data: Prisma.AnimalUncheckedCreateInput) {
    return prisma.animal.create({ data });
  }

  async getById(id: string) {
    return prisma.animal.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.AnimalUncheckedUpdateInput) {
    return prisma.animal.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.animal.delete({ where: { id } });
  }
}

export const animalService = new AnimalService();