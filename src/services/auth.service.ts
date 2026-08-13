import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/client';
import { LoginInput } from '../schemas/auth.schema';

export class AuthService {
  async login({ email, password }: LoginInput) {
    // 1. Busca o usuário pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    // 2. Compara a senha informada com o hash salvo no banco
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // 3. Lê o segredo e o tempo de expiração do .env
    const secret = process.env.JWT_SECRET || 'default_fallback_secret';
    const expiresIn = (process.env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn'];

    // 4. Assina e gera o Token JWT contendo o ID e E-mail do usuário no payload
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      secret,
      { expiresIn }
    );

    // 5. Remove a senha antes de retornar os dados
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}