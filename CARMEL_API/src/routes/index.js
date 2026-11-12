import { Router } from "express";
import authRoutes from "./authRoutes.js";
import categoriasRoutes from "./categoriasRoutes.js";
import productosRoutes from "./productosRoutes.js";
import carritoRoutes from "./carritoRoutes.js";
import ordenesRoutes from "./ordenesRoutes.js";
import usuariosRoutes from "./usuariosRoutes.js";
import rolesRoutes from "./rolesRoutes.js";
import statusRoutes from "./statusRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categorias", categoriasRoutes);
router.use("/productos", productosRoutes);
router.use("/carrito", carritoRoutes);
router.use("/ordenes", ordenesRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/roles", rolesRoutes);
router.use("/status", statusRoutes);

export default router;
