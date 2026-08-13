import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../../prisma/client';

export class UserService {
  async getAll() {
    // Retorna os usuários sem expor a senha
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        state: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        state: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        animals: true, // Traz os animais cadastrados por este usuário
      },
    });
  }

  async getByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    // Hash da senha com 10 rounds de salt
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    let updateData = { ...data };

    // Se a senha foi fornecida no update, gera um novo hash
    if (typeof updateData.password === 'string') {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}