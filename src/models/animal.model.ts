import { z } from "zod";

export const AnimalSchema = z.object({
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

export type AnimalDTO = z.infer<typeof AnimalSchema>;

