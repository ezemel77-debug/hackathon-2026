import { Router } from "express";
const router = Router();
import { sequelize } from "../models/index.js";

router.get("/", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ ok: true, api: "CARMEL", database: "connected" });
  } catch {
    res
      .status(503)
      .json({ ok: false, api: "CARMEL", database: "disconnected" });
  }
});

export default router;
