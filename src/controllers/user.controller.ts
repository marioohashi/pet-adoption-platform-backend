import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";

const service = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    const parsed = createUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    try {
      // Verifica duplicação de e-mail
      const existingUser = await service.getByEmail(parsed.data.email);
      if (existingUser) {
        return res.status(409).json({ message: "E-mail já cadastrado" });
      }

      const user = await service.create(parsed.data);
      return res.status(201).json(user);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return res.status(500).json({ message: "Erro ao criar usuário" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await service.getAll();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  }

  async getById(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const user = await service.getById(id);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar usuário" });
    }
  }

  async update(req: Request<{ id: string }>, res: Response) {
    const parsed = updateUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Dados inválidos para atualização",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    try {
      const { id } = req.params;
      const user = await service.update(id, parsed.data);
      return res.json(user);
    } catch (error) {
      return res.status(404).json({ message: "Usuário não encontrado para atualização" });
    }
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      await service.delete(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ message: "Usuário não encontrado para deleção" });
    }
  }
}

export const userController = new UserController();