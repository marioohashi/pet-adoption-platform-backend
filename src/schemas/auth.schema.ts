import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ message: 'O e-mail é obrigatório' })
    .email('E-mail em formato inválido'),

  password: z
    .string({ message: 'A senha é obrigatória' })
    .min(1, 'A senha é obrigatória'),
});

export type LoginInput = z.infer<typeof loginSchema>;