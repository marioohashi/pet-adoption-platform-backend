import { Router } from 'express';
import { animalController } from '../controllers/animal.controller';

const router = Router();

router.get('/', (req, res) => animalController.getAll(req, res));
router.get('/:id', (req, res) => animalController.getById(req, res));
router.post('/', (req, res) => animalController.create(req, res));
router.put('/:id', (req, res) => animalController.update(req, res));
router.delete('/:id', (req, res) => animalController.delete(req, res));

export default router;