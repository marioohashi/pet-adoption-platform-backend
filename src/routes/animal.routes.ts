import { Router } from "express";
import { AnimalController } from "../controllers/animal.controller";

const router = Router();
const controller = new AnimalController();

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
