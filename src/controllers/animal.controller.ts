import { Request, Response } from "express";
import { AnimalService } from "../services/animal.service";
import { createAnimalSchema, updateAnimalSchema } from "../schemas/animal.schema";

const service = new AnimalService();
export class AnimalController {
 async create(req: Request, res: Response) {
    const parsed = createAnimalSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    try {
      const animal = await service.create(parsed.data);
      return res.status(201).json(animal);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar animal" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const animals = await service.getAll();
      return res.json(animals);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar animais" });
    }
  }

  async getById(req: Request <{id: string}>, res: Response) {
    try {
      const { id } = req.params;
      const animal = await service.getById(id);

      // O Prisma retorna null se não encontrar, então validamos aqui:
      if (!animal) {
        return res.status(404).json({ message: "Animal não encontrado" });
      }

      return res.json(animal);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar animal" });
    }
  }

async update(req: Request <{id: string}>, res: Response) {
    const parsed = updateAnimalSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Dados inválidos para atualização",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    try {
      const { id } = req.params;
      const animal = await service.update(id, parsed.data);
      return res.json(animal);
    } catch (error) {
      return res.status(404).json({ message: "Animal não encontrado para atualização" });
    }
  }

  async delete(req: Request <{id: string}>, res: Response) {
    try {
      const { id } = req.params;

      // O Prisma LANÇA erro se tentar dar delete num ID que não existe
      await service.delete(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ message: "Animal não encontrado para deleção" });
    }
  }
}

// Exportamos também uma instância pronta para facilitar o uso nas rotas
export const animalController = new AnimalController();