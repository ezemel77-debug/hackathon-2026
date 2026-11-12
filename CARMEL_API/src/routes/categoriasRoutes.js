import { Router } from "express";
const router = Router();
import * as c from "../controllers/categoriasController.js";
import { auth, requireRole } from "../middleware/auth.js";

router.get("/", c.listar);
router.get("/:id", c.obtener);
router.post(
  "/",
  auth,
  requireRole("administrador", "admin", "distribuidor"),
  c.crear,
);
router.put(
  "/:id",
  auth,
  requireRole("administrador", "admin", "distribuidor"),
  c.actualizar,
);
router.delete(
  "/:id",
  auth,
  requireRole("administrador", "admin", "distribuidor"),
  c.eliminar,
);

export default router;
