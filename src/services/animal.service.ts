import { Animal } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export const createAnimalSchema = z.object({
  name: z.string().min(1),
  species: z.string().min(1),
  breed: z.string().optional(),
  age: z.number().int().nonnegative().optional(),
  size: z.string().optional(),
  sex: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  photo: z.string().optional(),
  userId: z.string().uuid(),
});

export const updateAnimalSchema = z
  .object({
    name: z.string().min(1).optional(),
    species: z.string().min(1).optional(),
    breed: z.string().optional(),
    age: z.number().int().nonnegative().optional(),
    size: z.string().optional(),
    sex: z.string().optional(),
    description: z.string().optional(),
    status: z.string().optional(),
    photo: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });

export type CreateAnimalInput = z.infer<typeof createAnimalSchema>;
export type UpdateAnimalInput = z.infer<typeof updateAnimalSchema>;

export const createAnimal = async (input: CreateAnimalInput): Promise<Animal> => {
  const parsed = createAnimalSchema.parse(input);

  const user = await prisma.user.findUnique({
    where: { id: parsed.userId },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return prisma.animal.create({
    data: {
      name: parsed.name,
      species: parsed.species,
      breed: parsed.breed ?? null,
      age: parsed.age ?? null,
      size: parsed.size ?? null,
      sex: parsed.sex ?? null,
      description: parsed.description ?? null,
      status: parsed.status ?? "available",
      photo: parsed.photo ?? null,
      userId: parsed.userId,
    },
  });
};

export const getAnimals = async (): Promise<Animal[]> => {
  return prisma.animal.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getAnimalById = async (id: string): Promise<Animal | null> => {
  return prisma.animal.findUnique({
    where: { id },
  });
};

export const updateAnimal = async (
  id: string,
  input: UpdateAnimalInput
): Promise<Animal> => {
  const parsed = updateAnimalSchema.parse(input);

  return prisma.animal.update({
    where: { id },
    data: {
      ...(parsed.name !== undefined && { name: parsed.name }),
      ...(parsed.species !== undefined && { species: parsed.species }),
      ...(parsed.breed !== undefined && { breed: parsed.breed }),
      ...(parsed.age !== undefined && { age: parsed.age }),
      ...(parsed.size !== undefined && { size: parsed.size }),
      ...(parsed.sex !== undefined && { sex: parsed.sex }),
      ...(parsed.description !== undefined && { description: parsed.description }),
      ...(parsed.status !== undefined && { status: parsed.status }),
      ...(parsed.photo !== undefined && { photo: parsed.photo }),
    },
  });
};

export const deleteAnimal = async (id: string): Promise<Animal> => {
  return prisma.animal.delete({
    where: { id },
  });
};
