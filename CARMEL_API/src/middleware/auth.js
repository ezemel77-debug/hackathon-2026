import jwt from "jsonwebtoken";
import { Usuario, Rol } from "../models/index.js";

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ ok: false, message: "Token requerido" });
    }

    const token = header.substring(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findByPk(payload.id, {
      include: [{ model: Rol, as: "rol", attributes: ["id", "nombre"] }],
    });

    if (!usuario || !usuario.activo) {
      return res
        .status(401)
        .json({ ok: false, message: "Usuario no autorizado" });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ ok: false, message: "Token inválido o vencido" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    const nombreRol = req.usuario?.rol?.nombre;
    if (!roles.includes(nombreRol)) {
      return res
        .status(403)
        .json({
          ok: false,
          message: "No tiene permisos para realizar esta operación",
        });
    }
    next();
  };
}

export { auth, requireRole };
