import crypto from "crypto";
import {
  sequelize,
  Carrito,
  ItemCarrito,
  Producto,
  Orden,
  ItemOrden,
  Usuario,
} from "../models/index.js";

function codigoOrden() {
  return `T-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
}

async function crear(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { metodo_pago } = req.body;
    const metodos = [
      "efectivo",
      "débito",
      "debito",
      "crédito",
      "credito",
      "Mercado Pago",
      "mercado_pago",
    ];
    if (!metodo_pago || !metodos.includes(metodo_pago)) {
      await t.rollback();
      return res
        .status(400)
        .json({ ok: false, message: "Método de pago inválido" });
    }

    const carrito = await Carrito.findOne({
      where: { usuario_id: req.usuario.id },
      transaction: t,
    });
    if (!carrito) {
      await t.rollback();
      return res
        .status(400)
        .json({ ok: false, message: "El usuario no tiene carrito" });
    }

    const items = await ItemCarrito.findAll({
      where: { carrito_id: carrito.id },
      include: [{ model: Producto, as: "producto", lock: t.LOCK.UPDATE }],
      transaction: t,
    });
    if (!items.length) {
      await t.rollback();
      return res
        .status(400)
        .json({ ok: false, message: "El carrito está vacío" });
    }

    let total = 0;
    for (const item of items) {
      if (!item.producto.activo || item.cantidad > item.producto.stock) {
        await t.rollback();
        return res
          .status(400)
          .json({
            ok: false,
            message: `Stock insuficiente para ${item.producto.nombre}`,
          });
      }
      total += item.cantidad * Number(item.precio_unitario);
    }

    const orden = await Orden.create(
      {
        usuario_id: req.usuario.id,
        codigo: codigoOrden(),
        estado: "confirmado",
        total: total.toFixed(2),
        metodo_pago,
      },
      { transaction: t },
    );

    for (const item of items) {
      await ItemOrden.create(
        {
          orden_id: orden.id,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: (item.cantidad * Number(item.precio_unitario)).toFixed(2),
        },
        { transaction: t },
      );

      await Producto.decrement("stock", {
        by: item.cantidad,
        where: { id: item.producto_id },
        transaction: t,
      });
    }

    await ItemCarrito.destroy({
      where: { carrito_id: carrito.id },
      transaction: t,
    });
    await t.commit();

    res.status(201).json({
      ok: true,
      message: "Compra confirmada",
      orden: {
        id: orden.id,
        codigo: orden.codigo,
        estado: orden.estado,
        total: orden.total,
        metodo_pago: orden.metodo_pago,
        created_at: orden.created_at,
      },
    });
  } catch (e) {
    await t.rollback();
    next(e);
  }
}

async function listarMisOrdenes(req, res, next) {
  try {
    const ordenes = await Orden.findAll({
      where: { usuario_id: req.usuario.id },
      include: [
        {
          model: ItemOrden,
          as: "items",
          include: [
            {
              model: Producto,
              as: "producto",
              attributes: ["id", "nombre", "imagen_url"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json({ ok: true, ordenes });
  } catch (e) {
    next(e);
  }
}

async function obtener(req, res, next) {
  try {
    const orden = await Orden.findOne({
      where: { id: req.params.id, usuario_id: req.usuario.id },
      include: [
        {
          model: ItemOrden,
          as: "items",
          include: [{ model: Producto, as: "producto" }],
        },
      ],
    });
    if (!orden)
      return res
        .status(404)
        .json({ ok: false, message: "Orden no encontrada" });
    res.json({ ok: true, orden });
  } catch (e) {
    next(e);
  }
}

async function listarAdmin(req, res, next) {
  try {
    const where = {};
    if (req.query.usuario_id) where.usuario_id = Number(req.query.usuario_id);
    if (req.query.estado) where.estado = req.query.estado;

    const ordenes = await Orden.findAll({
      where,
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombre", "apellido", "email", "telefono"],
        },
        {
          model: ItemOrden,
          as: "items",
          include: [
            {
              model: Producto,
              as: "producto",
              attributes: ["id", "nombre", "imagen_url"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json({ ok: true, ordenes });
  } catch (e) {
    next(e);
  }
}

async function actualizarEstado(req, res, next) {
  try {
    const estados = ["pendiente", "confirmado", "entregado"];
    if (!estados.includes(req.body.estado))
      return res.status(400).json({ ok: false, message: "Estado inválido" });
    const orden = await Orden.findByPk(req.params.id);
    if (!orden)
      return res
        .status(404)
        .json({ ok: false, message: "Orden no encontrada" });
    await orden.update({ estado: req.body.estado });
    res.json({ ok: true, orden });
  } catch (e) {
    next(e);
  }
}

export { crear, listarMisOrdenes, obtener, listarAdmin, actualizarEstado };
