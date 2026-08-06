import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export async function register(req: Request, res: Response) {
    try {
        const result = await authService.register(req.body);
        return res.status(201).json(result);
    }
    catch (error:any) {
        return res.status(400).json({ message: error.message });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const result = await authService.login(req.body);
        return res.status(200).json(result);
    }
    catch (error:any) {
        return res.status(400).json({ message: error.message });
    }
}