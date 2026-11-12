import "dotenv/config";
import {
  sequelize,
  Rol,
  Usuario,
  Categoria,
  Producto,
  Carrito,
} from "../src/models/index.js";
import { hashPassword } from "../src/utils/auth.js";

async function seed() {
  try {
    await sequelize.authenticate();

    const [cliente] = await Rol.findOrCreate({
      where: { nombre: "cliente" },
      defaults: { nombre: "cliente" },
    });
    const [admin] = await Rol.findOrCreate({
      where: { nombre: "administrador" },
      defaults: { nombre: "administrador" },
    });

    const [miel] = await Categoria.findOrCreate({
      where: { nombre: "Miel" },
      defaults: { descripcion: "Miel y productos apícolas" },
    });
    const [dulce] = await Categoria.findOrCreate({
      where: { nombre: "Dulce de leche" },
      defaults: { descripcion: "Dulce de leche artesanal" },
    });

    const productos = [
      {
        categoria_id: miel.id,
        nombre: "Miel pura artesanal 1 kg",
        descripcion: "Miel pura artesanal.",
        precio: 8500,
        stock: 20,
        imagen_url: "https://via.placeholder.com/500x400?text=Miel+1kg",
        activo: true,
      },
      {
        categoria_id: miel.id,
        nombre: "Miel pura artesanal 500 g",
        descripcion: "Miel pura artesanal.",
        precio: 4800,
        stock: 30,
        imagen_url: "https://via.placeholder.com/500x400?text=Miel+500g",
        activo: true,
      },
      {
        categoria_id: dulce.id,
        nombre: "Dulce de leche artesanal 1 kg",
        descripcion: "Dulce de leche artesanal.",
        precio: 6500,
        stock: 15,
        imagen_url: "https://via.placeholder.com/500x400?text=Dulce+de+Leche",
        activo: true,
      },
    ];

    for (const p of productos) {
      await Producto.findOrCreate({ where: { nombre: p.nombre }, defaults: p });
    }

    const [usuarioAdmin] = await Usuario.findOrCreate({
      where: { email: "admin@carmel.com" },
      defaults: {
        rol_id: admin.id,
        nombre: "Administrador",
        apellido: "CARMEL",
        email: "admin@carmel.com",
        password_hash: await hashPassword("admin123"),
        telefono: "3510000000",
        activo: true,
      },
    });

    const [usuarioCliente] = await Usuario.findOrCreate({
      where: { email: "cliente@carmel.com" },
      defaults: {
        rol_id: cliente.id,
        nombre: "Cliente",
        apellido: "CARMEL",
        email: "cliente@carmel.com",
        password_hash: await hashPassword("cliente123"),
        telefono: "3511111111",
        activo: true,
      },
    });

    await Carrito.findOrCreate({ where: { usuario_id: usuarioAdmin.id } });
    await Carrito.findOrCreate({ where: { usuario_id: usuarioCliente.id } });

    console.log("✓ Seed completado");
    console.log("Admin: admin@carmel.com / admin123");
    console.log("Cliente: cliente@carmel.com / cliente123");
  } catch (error) {
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

seed();
