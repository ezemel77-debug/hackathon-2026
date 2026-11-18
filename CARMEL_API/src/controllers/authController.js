import { Usuario, Rol, Carrito } from "../models/index.js";
import { hashPassword, comparePassword, signToken } from "../utils/auth.js";

import enviaMailReg from "../utils/enviaMailRegistro.js"; // ENVIO DE MAIL BIENVENIDA USUARIO REGISTRADO

import crypto from "node:crypto"; // PUNTO 2
import { Op } from "sequelize";
import enviarMail from "../utils/enviarMail.js";

// async function register(req, res, next) {
//   try {
//     const { nombre, apellido, email, telefono, password } = req.body;

//     if (!nombre || !apellido || !email || !password) {
//       return res.status(400).json({
//         ok: false,
//         message: "Nombre, apellido, email y contraseña son obligatorios",
//       });
//     }
//     if (password.length < 6) {
//       return res.status(400).json({
//         ok: false,
//         message: "La contraseña debe tener al menos 6 caracteres",
//       });
//     }

//     const emailNormalizado = email.trim().toLowerCase();
//     const existe = await Usuario.findOne({
//       where: { email: emailNormalizado },
//     });
//     if (existe) {
//       return res
//         .status(409)
//         .json({ ok: false, message: "El email ya está registrado" });
//     }

//     const rol = await Rol.findOne({ where: { nombre: "cliente" } });
//     if (!rol)
//       return res
//         .status(500)
//         .json({ ok: false, message: "No existe el rol cliente" });

//     const usuario = await Usuario.create({
//       rol_id: rol.id,
//       nombre: nombre.trim(),
//       apellido: apellido.trim(),
//       email: emailNormalizado,
//       password_hash: await hashPassword(password),
//       telefono: telefono || null,
//       activo: true,
//     });

//     await Carrito.create({ usuario_id: usuario.id });
//     //****************** ENVIO MAIL US REG *********************
//     try {
//       await enviaMailReg(usuario.nombre, usuario.email);
//       console.log("Correo de bienvenida enviado");
//     } catch (error) {
//       console.error("Error al enviar correo:", error.message);
//     }
//     //****************** ENVIO MAIL US REG *********************
//     const token = signToken(usuario);

//     res.status(201).json({
//       ok: true,
//       message: "Usuario registrado correctamente",
//       token,
//       usuario: {
//         id: usuario.id,
//         nombre: usuario.nombre,
//         apellido: usuario.apellido,
//         email: usuario.email,
//         telefono: usuario.telefono,
//         rol: rol.nombre,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// }

async function register(req, res, next) {
  try {
    const { nombre, apellido, email, telefono, password } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Nombre, apellido, email y contraseña son obligatorios",
      });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        ok: false,
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const existe = await Usuario.findOne({
      where: { email: emailNormalizado },
    });

    if (existe) {
      return res.status(409).json({
        ok: false,
        message: "El email ya está registrado",
      });
    }

    const rol = await Rol.findOne({
      where: { nombre: "cliente" },
    });

    if (!rol) {
      return res.status(500).json({
        ok: false,
        message: "No existe el rol cliente",
      });
    }

    // Generar token seguro de verificación
    const token = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Vencimiento de 24 horas
    const vencimiento = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Crear usuario SIN activar
    const usuario = await Usuario.create({
      rol_id: rol.id,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: emailNormalizado,
      password_hash: await hashPassword(password),
      telefono: telefono || null,
      activo: false,
      verificacion_token: tokenHash,
      verificacion_expira: vencimiento,
    });

    await Carrito.create({
      usuario_id: usuario.id,
    });

    // Enlace de confirmación
    const enlace = `${process.env.FRONTEND_URL}/confirmar-registro/${token}`;

    const mensaje = `Hola ${usuario.nombre}:

Gracias por registrarte en CARMEL.

Para activar tu cuenta, ingresá al siguiente enlace:

${enlace}

Este enlace tiene una validez de 24 horas.

Si no solicitaste este registro, ignorá este correo.

CARMEL - Productos de mi tierra`;

    try {
      await enviarMail(
        usuario.email,
        "Confirmá tu registro en CARMEL",
        mensaje,
      );

      console.log("Correo de verificación enviado");
    } catch (error) {
      console.error("Error enviando correo de verificación:", error.message);
    }

    // No generar JWT ni iniciar sesión todavía
    res.status(201).json({
      ok: true,
      message: "Cuenta creada. Revisá tu correo para confirmar el registro.",
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ ok: false, message: "Email y contraseña son obligatorios" });
    }

    const usuario = await Usuario.findOne({
      where: { email: email.trim().toLowerCase() },
      include: [{ model: Rol, as: "rol" }],
    });

    if (
      !usuario ||
      !usuario.activo ||
      !(await comparePassword(password, usuario.password_hash))
    ) {
      return res
        .status(401)
        .json({ ok: false, message: "Credenciales incorrectas" });
    }

    const token = signToken(usuario);
    res.json({
      ok: true,
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol.nombre,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  const u = req.usuario;
  res.json({
    ok: true,
    usuario: {
      id: u.id,
      nombre: u.nombre,
      apellido: u.apellido,
      email: u.email,
      telefono: u.telefono,
      activo: u.activo,
      rol: u.rol?.nombre,
    },
  });
}

//*************/  Función 1: solicitar recuperación **************
async function olvidePassword(req, res, next) {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        ok: false,
        message: "Ingresá tu correo electrónico",
      });
    }

    const mensaje =
      "Si el correo está registrado, recibirás un enlace de recuperación.";

    const usuario = await Usuario.findOne({ where: { email } });

    if (usuario && usuario.activo) {
      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

      await usuario.update({
        reset_token: tokenHash,
        reset_expira: new Date(Date.now() + 15 * 60 * 1000),
      });

      const enlace = `${process.env.FRONTEND_URL}/restablecer/${token}`;

      const texto = `Hola ${usuario.nombre}:

      Recibimos una solicitud para recuperar tu contraseña de CARMEL.

      Ingresá al siguiente enlace:

      ${enlace}

      Este enlace vence en 15 minutos.

      Si no solicitaste este cambio, ignorá este correo.`;

      try {
        await enviarMail(usuario.email, "Recuperar contraseña - CARMEL", texto);
      } catch (error) {
        console.error("Error enviando recuperación:", error.message);
      }
    }

    res.json({ ok: true, message: mensaje });
  } catch (error) {
    next(error);
  }
}

//*********** Función 2: establecer contraseña nueva  ***************
async function restablecerPassword(req, res, next) {
  try {
    const { token, password } = req.body;

    if (
      typeof token !== "string" ||
      !/^[a-f0-9]{64}$/.test(token) ||
      typeof password !== "string" ||
      password.length < 6
    ) {
      return res.status(400).json({
        ok: false,
        message: "Enlace inválido o contraseña demasiado corta",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const nuevaPasswordHash = await hashPassword(password);

    const [actualizados] = await Usuario.update(
      {
        password_hash: nuevaPasswordHash,
        reset_token: null,
        reset_expira: null,
      },
      {
        where: {
          reset_token: tokenHash,
          reset_expira: { [Op.gt]: new Date() },
          activo: true,
        },
      },
    );

    if (actualizados === 0) {
      return res.status(400).json({
        ok: false,
        message: "El enlace es inválido, ya fue utilizado o venció",
      });
    }

    res.json({
      ok: true,
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    next(error);
  }
}

async function confirmarRegistro(req, res, next) {
  try {
    const { token } = req.body;

    if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) {
      return res.status(400).json({
        ok: false,
        message: "Enlace de verificación inválido",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Buscar usuario pendiente
    const usuario = await Usuario.findOne({
      where: {
        verificacion_token: tokenHash,
        verificacion_expira: {
          [Op.gt]: new Date(),
        },
        activo: false,
      },
    });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        message: "El enlace es inválido, ya fue utilizado o venció",
      });
    }

    // Activar la cuenta una sola vez
    const [actualizados] = await Usuario.update(
      {
        activo: true,
        verificacion_token: null,
        verificacion_expira: null,
      },
      {
        where: {
          id: usuario.id,
          activo: false,
          verificacion_token: tokenHash,
          verificacion_expira: {
            [Op.gt]: new Date(),
          },
        },
      },
    );

    if (actualizados === 0) {
      return res.status(400).json({
        ok: false,
        message: "Este enlace ya fue utilizado o venció",
      });
    }

    console.log("Cuenta confirmada:", usuario.email);

    // Segundo correo: bienvenida definitiva

    // try {
    //   await enviaMailReg(usuario.nombre, usuario.email);
    //   console.log("Correo de bienvenida enviado");
    // } catch (error) {
    //   console.error("Error enviando bienvenida:", error.message);
    // }

    // res.json({
    //   ok: true,
    //   message: "Tu registro en CARMEL fue confirmado correctamente.",
    // });

    let mailEnviado = false;

    try {
      await enviaMailReg(usuario.nombre, usuario.email);
      mailEnviado = true;
      console.log("Correo de bienvenida enviado");
    } catch (error) {
      console.error("Error enviando bienvenida:", error.message);
    }

    res.json({
      ok: true,
      message: "Tu registro en CARMEL fue confirmado correctamente.",
      mailEnviado,
    });
    
  } catch (error) {
    next(error);
  }
}

//export { register, login, me };

// export { register, login, me, olvidePassword, restablecerPassword };

export {
  register,
  login,
  me,
  olvidePassword,
  restablecerPassword,
  confirmarRegistro,
};
