import { Op } from "sequelize";
import { Producto, Categoria } from "../models/index.js";

const includeCategoria = {
  model: Categoria,
  as: "categoria",
  attributes: ["id", "nombre", "descripcion"],
};

async function listar(req, res, next) {
  try {
    const { categoria, search, activo } = req.query;
    const where = {};
    if (activo !== "false") where.activo = true;
    if (categoria) where.categoria_id = Number(categoria);
    if (search) where.nombre = { [Op.like]: `%${search}%` };

    const productos = await Producto.findAll({
      where,
      include: [includeCategoria],
      order: [["id", "DESC"]],
    });
    res.json({ ok: true, productos });
  } catch (e) {
    next(e);
  }
}

async function obtener(req, res, next) {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: [includeCategoria],
    });
    if (!producto || !producto.activo)
      return res
        .status(404)
        .json({ ok: false, message: "Producto no encontrado" });
    res.json({ ok: true, producto });
  } catch (e) {
    next(e);
  }
}

async function listarAdmin(req, res, next) {
  try {
    const productos = await Producto.findAll({
      include: [includeCategoria],
      order: [["id", "DESC"]],
    });
    res.json({ ok: true, productos });
  } catch (e) {
    next(e);
  }
}

async function crear(req, res, next) {
  try {
    const { nombre, categoria_id, precio, stock } = req.body;
    if (
      !nombre ||
      !categoria_id ||
      precio === undefined ||
      stock === undefined
    ) {
      return res
        .status(400)
        .json({
          ok: false,
          message: "Nombre, categoría, precio y stock son obligatorios",
        });
    }
    const producto = await Producto.create(req.body);
    res.status(201).json({ ok: true, producto });
  } catch (e) {
    next(e);
  }
}

async function actualizar(req, res, next) {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto)
      return res
        .status(404)
        .json({ ok: false, message: "Producto no encontrado" });
    await producto.update(req.body);
    res.json({ ok: true, producto });
  } catch (e) {
    next(e);
  }
}

async function eliminar(req, res, next) {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto)
      return res
        .status(404)
        .json({ ok: false, message: "Producto no encontrado" });
    await producto.update({ activo: false });
    res.json({ ok: true, message: "Producto desactivado" });
  } catch (e) {
    next(e);
  }
}

export { listar, obtener, listarAdmin, crear, actualizar, eliminar };
