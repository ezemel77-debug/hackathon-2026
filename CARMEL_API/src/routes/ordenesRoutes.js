import { Router } from "express";
const router = Router();
import * as c from "../controllers/ordenesController.js";
import { auth, requireRole } from "../middleware/auth.js";

router.use(auth);
router.post("/", c.crear);
router.get("/", c.listarMisOrdenes);
router.get("/:id", c.obtener);

router.get(
  "/admin/todas",
  requireRole("administrador", "admin", "distribuidor"),
  c.listarAdmin,
);
router.put(
  "/admin/:id/estado",
  requireRole("administrador", "admin", "distribuidor"),
  c.actualizarEstado,
);

export default router;
