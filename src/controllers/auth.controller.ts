import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { loginSchema } from '../schemas/auth.schema';

const service = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Dados inválidos',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    try {
      const result = await service.login(parsed.data);

      if (!result) {
        return res.status(401).json({ message: 'E-mail ou senha inválidos' });
      }

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao realizar login' });
    }
  }
}

export const authController = new AuthController();