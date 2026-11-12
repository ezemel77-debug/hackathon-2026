import { Usuario, Rol, Orden } from "../models/index.js";

async function listar(req, res, next) {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["password_hash"] },
      include: [{ model: Rol, as: "rol", attributes: ["id", "nombre"] }],
      order: [["id", "DESC"]],
    });
    res.json({ ok: true, usuarios });
  } catch (e) {
    next(e);
  }
}

async function obtener(req, res, next) {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ["password_hash"] },
      include: [{ model: Rol, as: "rol", attributes: ["id", "nombre"] }],
    });
    if (!usuario)
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    res.json({ ok: true, usuario });
  } catch (e) {
    next(e);
  }
}

async function actualizar(req, res, next) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario)
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    const permitidos = ["nombre", "apellido", "telefono", "activo", "rol_id"];
    const cambios = {};
    for (const key of permitidos)
      if (req.body[key] !== undefined) cambios[key] = req.body[key];
    await usuario.update(cambios);
    res.json({ ok: true, message: "Usuario actualizado" });
  } catch (e) {
    next(e);
  }
}

async function historial(req, res, next) {
  try {
    const ordenes = await Orden.findAll({
      where: { usuario_id: req.params.id },
      order: [["created_at", "DESC"]],
    });
    res.json({ ok: true, ordenes });
  } catch (e) {
    next(e);
  }
}

export { listar, obtener, actualizar, historial };
