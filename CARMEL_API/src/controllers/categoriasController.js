import { Categoria } from "../models/index.js";

async function listar(req, res, next) {
  try {
    res.json({
      ok: true,
      categorias: await Categoria.findAll({ order: [["nombre", "ASC"]] }),
    });
  } catch (e) {
    next(e);
  }
}
async function obtener(req, res, next) {
  try {
    const item = await Categoria.findByPk(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ ok: false, message: "Categoría no encontrada" });
    res.json({ ok: true, categoria: item });
  } catch (e) {
    next(e);
  }
}
async function crear(req, res, next) {
  try {
    const item = await Categoria.create(req.body);
    res.status(201).json({ ok: true, categoria: item });
  } catch (e) {
    next(e);
  }
}
async function actualizar(req, res, next) {
  try {
    const item = await Categoria.findByPk(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ ok: false, message: "Categoría no encontrada" });
    await item.update(req.body);
    res.json({ ok: true, categoria: item });
  } catch (e) {
    next(e);
  }
}
async function eliminar(req, res, next) {
  try {
    const item = await Categoria.findByPk(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ ok: false, message: "Categoría no encontrada" });
    await item.destroy();
    res.json({ ok: true, message: "Categoría eliminada" });
  } catch (e) {
    next(e);
  }
}
export { listar, obtener, crear, actualizar, eliminar };
