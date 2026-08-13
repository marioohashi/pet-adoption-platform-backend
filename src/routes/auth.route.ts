import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.post('/login', (req, res) => authController.login(req, res));

export default router;