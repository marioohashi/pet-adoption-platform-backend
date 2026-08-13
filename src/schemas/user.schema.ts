import { z } from 'zod';

export const createUserSchema = z.object({
  name: z
    .string({ message: 'O nome é obrigatório' })
    .min(2, 'O nome deve ter no mínimo 2 caracteres'),

  email: z
    .string({ message: 'O e-mail é obrigatório' })
    .email('E-mail em formato inválido'),

  password: z
    .string({ message: 'A senha é obrigatória' })
    .min(6, 'A senha deve ter no mínimo 6 caracteres'),

  phone: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  avatar: z.string().url('URL do avatar inválida').or(z.literal('')).nullish(),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;