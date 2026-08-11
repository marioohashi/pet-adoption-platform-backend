import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "../utils/prisma";

type UserParams = { id: string };

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

const sanitizeUser = (user: any) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const parsed = createUserSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        password: hashedPassword,
        phone: parsed.phone ?? null,
        bio: parsed.bio ?? null,
        avatar: parsed.avatar ?? null,
        city: parsed.city ?? null,
        state: parsed.state ?? null,
      },
    });

    return res.status(201).json(sanitizeUser(user));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error });
    }

    if (error instanceof Error && error.message.includes("Unique constraint failed")) {
      return res.status(409).json({ message: "Email já está em uso." });
    }

    console.error("createUser error", error);
    return res.status(500).json({ message: "Erro interno ao criar usuário." });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (users.length === 0) {
      return res.status(200).json({ message: "Nenhum usuário cadastrado." });
    }

    return res.json(users.map(sanitizeUser));
  } catch (error) {
    console.error("getUsers error", error);
    return res.status(500).json({ message: "Erro interno ao buscar usuários." });
  }
};

export const getUserById = async (req: Request<UserParams>, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.json(sanitizeUser(user));
  } catch (error) {
    console.error("getUserById error", error);
    return res.status(500).json({ message: "Erro interno ao buscar usuário." });
  }
};

export const updateUser = async (req: Request<UserParams>, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = updateUserSchema.parse(req.body);

    const data: any = { ...parsed };
    if (parsed.password) {
      data.password = await bcrypt.hash(parsed.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return res.json(sanitizeUser(user));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({ message: "Email já está em uso por outro usuário." });
    }

    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    console.error("updateUser error", error);
    return res.status(500).json({ message: "Erro interno ao atualizar usuário." });
  }
};

export const deleteUser = async (req: Request<UserParams>, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await prisma.user.delete({ where: { id } });
    return res.json({
      message: "Usuário deletado com sucesso.",
      user: sanitizeUser(deletedUser),
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Record to delete not found")) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    console.error("deleteUser error", error);
    return res.status(500).json({ message: "Erro interno ao deletar usuário." });
  }
};