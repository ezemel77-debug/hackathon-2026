import { Router } from "express";
const router = Router();
import * as c from "../controllers/rolesController.js";
import { auth, requireRole } from "../middleware/auth.js";

router.get(
  "/",
  auth,
  requireRole("administrador", "admin", "distribuidor"),
  c.listar,
);

export default router;
