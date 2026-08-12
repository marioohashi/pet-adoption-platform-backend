import { Request, Response } from "express";
import { AnimalService } from "../services/animal.service";
import { AnimalSchema } from "../models/animal.model";

const service = new AnimalService();

export class AnimalController {
  async create(req: Request, res: Response) {
    const parsed = AnimalSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const animal = await service.create(parsed.data);
    return res.status(201).json(animal);
  }

  async getAll(req: Request, res: Response) {
    const animals = await service.getAll();
    return res.json(animals);
  }

  async getById(req: Request, res: Response) {
    try {
      const animal = await service.getById(req.params.id);
      return res.json(animal);
    } catch {
      return res.status(404).json({ message: "Animal not found" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const animal = await service.update(req.params.id, req.body);
      return res.json(animal);
    } catch {
      return res.status(404).json({ message: "Animal not found" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.delete(req.params.id);
      return res.status(204).send();
    } catch {
      return res.status(404).json({ message: "Animal not found" });
    }
  }
}
