import { Request, Response } from 'express';
import { animalService } from '../services/animal.serivce';
import { z } from 'zod';

const paramsSchema = z.object({
    id: z.string().uuid()
});

export async function createAnimal(req: Request, res: Response) {
    try {
        const animal = await animalService.create(req.body);
        res.status(201).json({ data: animal });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export async function getAnimals(req: Request, res: Response) {
    try {
        const animals = await animalService.getAnimals();
        res.status(200).json({ data: animals });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export async function getAnimalById(req: Request, res: Response) {
    try {
        const { id } = paramsSchema.parse(req.params);
        const animal = await animalService.getAnimalById(id);
        if (!animal) {
            return res.status(404).json({ error: 'Animal not found' });
        }
        res.status(200).json({ data: animal });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export async function updateAnimal(req: Request, res: Response) {
    try {
        const { id } = paramsSchema.parse(req.params);
        const animal = await animalService.updateAnimal(id, req.body);
        if (!animal) {
            return res.status(404).json({ error: 'Animal not found' });
        }
        res.status(200).json({ data: animal });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export async function deleteAnimal(req: Request, res: Response) {
    try {
        const { id } = paramsSchema.parse(req.params);
        const animal = await animalService.deleteAnimal(id);
        if (!animal) {
            return res.status(404).json({ error: 'Animal not found' });
        }
        res.status(200).json({ message: 'Animal deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}