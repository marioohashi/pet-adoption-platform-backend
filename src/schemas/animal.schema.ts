import { z } from 'zod';

// Schema para CRIAÇÃO de um Animal
export const createAnimalSchema = z.object({
  name: z
    .string({ message: 'O nome é obrigatório' })
    .min(2, 'O nome deve ter no mínimo 2 caracteres'),

  species: z
    .string({ message: 'A espécie é obrigatória' })
    .min(1, 'A espécie não pode estar vazia'),

  breed: z.string().optional(),

  age: z
    .number()
    .int('A idade deve ser um número inteiro')
    .nonnegative('A idade não pode ser negativa')
    .optional(),

  size: z.string().optional(), // Ex: 'Pequeno', 'Médio', 'Grande'

  sex: z.string().optional(), // Ex: 'Macho', 'Fêmea'

  description: z.string().optional(),

  status: z
    .string()
    .default('available'),

  photo: z.string().url('URL da foto inválida').optional().or(z.literal('')),

  userId: z
    .string({ message: 'O ID do usuário é obrigatório' })
    .uuid('O ID do usuário deve ser um UUID válido'),
});

// Schema para ATUALIZAÇÃO (todos os campos se tornam opcionais)
export const updateAnimalSchema = createAnimalSchema.partial();

// Tipos TypeScript inferidos automaticamente dos schemas
export type CreateAnimalInput = z.infer<typeof createAnimalSchema>;
export type UpdateAnimalInput = z.infer<typeof updateAnimalSchema>;