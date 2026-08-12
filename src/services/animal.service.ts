import { AnimalRepository } from "../repositories/animal.repository";
import { AnimalDTO } from "../models/animal.model";

const repo = new AnimalRepository();
export class AnimalService {
  async create(data: AnimalDTO) {
    return repo.create(data);
  }

  async getAll() {
    return repo.findAll();
  }

  async getById(id: string) {
    const animal = await repo.findById(id);
    if (!animal) throw new Error("Animal not found");
    return animal;
  }

  async update(id: string, data: Partial<AnimalDTO>) {
    await this.getById(id);
    return repo.update(id, data);
  }

  async delete(id: string) {
    await this.getById(id);
    return repo.delete(id);
  }
}
