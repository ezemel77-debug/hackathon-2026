import { Rol } from "../models/index.js";

async function listar(req, res, next) {
  try {
    res.json({ ok: true, roles: await Rol.findAll() });
  } catch (e) {
    next(e);
  }
}

export { listar };
