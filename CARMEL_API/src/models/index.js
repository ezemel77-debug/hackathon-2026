import sequelize from "../config/database.js";
import Rol from "./roles.model.js";
import Usuario from "./usuarios.model.js";
import Categoria from "./categorias.model.js";
import Producto from "./productos.model.js";
import Carrito from "./carrito.model.js";
import ItemCarrito from "./itemsCarrito.model.js";
import Orden from "./ordenes.model.js";
import ItemOrden from "./itemsOrden.model.js";

Rol.hasMany(Usuario, { foreignKey: "rol_id", as: "usuarios" });
Usuario.belongsTo(Rol, { foreignKey: "rol_id", as: "rol" });

Categoria.hasMany(Producto, { foreignKey: "categoria_id", as: "productos" });
Producto.belongsTo(Categoria, { foreignKey: "categoria_id", as: "categoria" });

Usuario.hasOne(Carrito, { foreignKey: "usuario_id", as: "carrito" });
Carrito.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

Carrito.hasMany(ItemCarrito, {
  foreignKey: "carrito_id",
  as: "items",
  onDelete: "CASCADE",
});
ItemCarrito.belongsTo(Carrito, { foreignKey: "carrito_id", as: "carrito" });

Producto.hasMany(ItemCarrito, {
  foreignKey: "producto_id",
  as: "itemsCarrito",
});
ItemCarrito.belongsTo(Producto, { foreignKey: "producto_id", as: "producto" });

Usuario.hasMany(Orden, { foreignKey: "usuario_id", as: "ordenes" });
Orden.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

Orden.hasMany(ItemOrden, {
  foreignKey: "orden_id",
  as: "items",
  onDelete: "CASCADE",
});
ItemOrden.belongsTo(Orden, { foreignKey: "orden_id", as: "orden" });

Producto.hasMany(ItemOrden, { foreignKey: "producto_id", as: "itemsOrden" });
ItemOrden.belongsTo(Producto, { foreignKey: "producto_id", as: "producto" });

export {
  sequelize,
  Rol,
  Usuario,
  Categoria,
  Producto,
  Carrito,
  ItemCarrito,
  Orden,
  ItemOrden,
};
