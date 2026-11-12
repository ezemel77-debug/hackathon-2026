import { Carrito, ItemCarrito, Producto } from "../models/index.js";

async function getOrCreateCart(usuario_id) {
  let carrito = await Carrito.findOne({ where: { usuario_id } });
  if (!carrito) carrito = await Carrito.create({ usuario_id });
  return carrito;
}

async function obtener(req, res, next) {
  try {
    const carrito = await getOrCreateCart(req.usuario.id);
    const items = await ItemCarrito.findAll({
      where: { carrito_id: carrito.id },
      include: [
        {
          model: Producto,
          as: "producto",
          attributes: [
            "id",
            "nombre",
            "precio",
            "stock",
            "imagen_url",
            "activo",
          ],
        },
      ],
      order: [["id", "ASC"]],
    });

    const total = items.reduce(
      (sum, i) => sum + Number(i.precio_unitario) * i.cantidad,
      0,
    );
    const cantidad = items.reduce((sum, i) => sum + i.cantidad, 0);

    res.json({
      ok: true,
      carrito: { id: carrito.id, items, cantidad, total: total.toFixed(2) },
    });
  } catch (e) {
    next(e);
  }
}

async function agregar(req, res, next) {
  try {
    const { producto_id, cantidad = 1 } = req.body;
    const qty = Number(cantidad);
    if (!producto_id || !Number.isInteger(qty) || qty < 1) {
      return res
        .status(400)
        .json({
          ok: false,
          message: "producto_id y cantidad válida son obligatorios",
        });
    }

    const producto = await Producto.findByPk(producto_id);
    if (!producto || !producto.activo)
      return res
        .status(404)
        .json({ ok: false, message: "Producto no encontrado" });
    const carrito = await getOrCreateCart(req.usuario.id);
    const existente = await ItemCarrito.findOne({
      where: { carrito_id: carrito.id, producto_id },
    });
    const nuevaCantidad = (existente ? existente.cantidad : 0) + qty;

    if (nuevaCantidad > producto.stock) {
      return res
        .status(400)
        .json({
          ok: false,
          message: `Stock insuficiente. Disponible: ${producto.stock}`,
        });
    }

    if (existente) {
      await existente.update({ cantidad: nuevaCantidad });
    } else {
      await ItemCarrito.create({
        carrito_id: carrito.id,
        producto_id,
        cantidad: qty,
        precio_unitario: producto.precio,
      });
    }
    res.status(201).json({ ok: true, message: "Producto agregado al carrito" });
  } catch (e) {
    next(e);
  }
}

async function actualizar(req, res, next) {
  try {
    const qty = Number(req.body.cantidad);
    if (!Number.isInteger(qty) || qty < 1)
      return res.status(400).json({ ok: false, message: "Cantidad inválida" });

    const item = await ItemCarrito.findOne({
      where: { id: req.params.id },
      include: [{ model: Carrito, as: "carrito" }],
    });
    if (!item || item.carrito.usuario_id !== req.usuario.id)
      return res.status(404).json({ ok: false, message: "Ítem no encontrado" });

    const producto = await Producto.findByPk(item.producto_id);
    if (qty > producto.stock)
      return res
        .status(400)
        .json({
          ok: false,
          message: `Stock insuficiente. Disponible: ${producto.stock}`,
        });

    await item.update({ cantidad: qty });
    res.json({ ok: true, message: "Cantidad actualizada" });
  } catch (e) {
    next(e);
  }
}

async function eliminar(req, res, next) {
  try {
    const item = await ItemCarrito.findOne({
      where: { id: req.params.id },
      include: [{ model: Carrito, as: "carrito" }],
    });
    if (!item || item.carrito.usuario_id !== req.usuario.id)
      return res.status(404).json({ ok: false, message: "Ítem no encontrado" });
    await item.destroy();
    res.json({ ok: true, message: "Producto eliminado del carrito" });
  } catch (e) {
    next(e);
  }
}

async function vaciar(req, res, next) {
  try {
    const carrito = await getOrCreateCart(req.usuario.id);
    await ItemCarrito.destroy({ where: { carrito_id: carrito.id } });
    res.json({ ok: true, message: "Carrito vacío" });
  } catch (e) {
    next(e);
  }
}

export { obtener, agregar, actualizar, eliminar, vaciar };
