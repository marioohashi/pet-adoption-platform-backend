import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import * as animalService from "../services/animal.service";

type AnimalParams = { id: string };

export const createAnimal = async (req: Request, res: Response) => {
  try {
    const animal = await animalService.createAnimal(req.body);
    return res.status(201).json(animal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error });
    }

    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Usuário responsável não encontrado." });
    }

    console.error("createAnimal error", error);
    return res.status(500).json({ message: "Erro interno ao criar animal." });
  }
};

export const getAnimals = async (_req: Request, res: Response) => {
  try {
    const animals = await animalService.getAnimals();

    if (animals.length === 0) {
      return res.status(200).json({ message: "Nenhum animal cadastrado." });
    }

    return res.json(animals);
  } catch (error) {
    console.error("getAnimals error", error);
    return res.status(500).json({ message: "Erro interno ao buscar animais." });
  }
};

export const getAnimalById = async (req: Request<AnimalParams>, res: Response) => {
  try {
    const { id } = req.params;
    const animal = await animalService.getAnimalById(id);

    if (!animal) {
      return res.status(404).json({ message: "Animal não encontrado." });
    }

    return res.json(animal);
  } catch (error) {
    console.error("getAnimalById error", error);
    return res.status(500).json({ message: "Erro interno ao buscar animal." });
  }
};

export const updateAnimal = async (req: Request<AnimalParams>, res: Response) => {
  try {
    const { id } = req.params;
    const animal = await animalService.updateAnimal(id, req.body);

    return res.json(animal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error });
    }

    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return res.status(404).json({ message: "Animal não encontrado." });
    }

    console.error("updateAnimal error", error);
    return res.status(500).json({ message: "Erro interno ao atualizar animal." });
  }
};

export const deleteAnimal = async (req: Request<AnimalParams>, res: Response) => {
  try {
    const { id } = req.params;
    const deletedAnimal = await animalService.deleteAnimal(id);

    return res.json({
      message: "Animal deletado com sucesso.",
      animal: deletedAnimal,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Record to delete not found")) {
      return res.status(404).json({ message: "Animal não encontrado." });
    }

    console.error("deleteAnimal error", error);
    return res.status(500).json({ message: "Erro interno ao deletar animal." });
  }
};
