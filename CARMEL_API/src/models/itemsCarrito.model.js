import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ItemCarrito = sequelize.define(
  "ItemCarrito",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    carrito_id: { type: DataTypes.INTEGER, allowNull: false },
    producto_id: { type: DataTypes.INTEGER, allowNull: false },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  { tableName: "items_carrito" },
);

export default ItemCarrito;
