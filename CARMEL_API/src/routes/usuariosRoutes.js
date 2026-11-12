import { Router } from "express";
const router = Router();
import * as c from "../controllers/usuariosController.js";
import { auth, requireRole } from "../middleware/auth.js";

router.use(auth, requireRole("administrador", "admin", "distribuidor"));
router.get("/", c.listar);
router.get("/:id", c.obtener);
router.put("/:id", c.actualizar);
router.get("/:id/historial", c.historial);

export default router;
