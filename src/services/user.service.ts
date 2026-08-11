import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

type UserData = Omit<User, "password">;

const sanitizeUser = (user: User): UserData => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const createUser = async (input: CreateUserInput): Promise<UserData> => {
  const parsed = createUserSchema.parse(input);
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

  return sanitizeUser(user);
};

export const getUsers = async (): Promise<UserData[]> => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return users.map(sanitizeUser);
};

export const getUserById = async (id: string): Promise<UserData | null> => {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? sanitizeUser(user) : null;
};

export const updateUser = async (
  id: string,
  input: UpdateUserInput
): Promise<UserData> => {
  const parsed = updateUserSchema.parse(input);
  const data: any = { ...parsed };

  if (parsed.password) {
    data.password = await bcrypt.hash(parsed.password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
  });

  return sanitizeUser(user);
};

export const deleteUser = async (id: string): Promise<void> => {
  await prisma.user.delete({ where: { id } });
};
