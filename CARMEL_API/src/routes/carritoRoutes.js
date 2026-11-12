import { Router } from "express";
const router = Router();
import * as c from "../controllers/carritoController.js";
import { auth } from "../middleware/auth.js";

router.use(auth);
router.get("/", c.obtener);
router.post("/items", c.agregar);
router.put("/items/:id", c.actualizar);
router.delete("/items/:id", c.eliminar);
router.delete("/", c.vaciar);

export default router;
