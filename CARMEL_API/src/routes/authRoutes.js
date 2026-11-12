import { Router } from "express";
const router = Router();
import * as controller from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", auth, controller.me);

//*********** PUNTO 2 *****************
router.post("/olvide-password", controller.olvidePassword);
router.post("/restablecer-password", controller.restablecerPassword);

export default router;
