import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ItemOrden = sequelize.define(
  "ItemOrden",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orden_id: { type: DataTypes.INTEGER, allowNull: false },
    producto_id: { type: DataTypes.INTEGER, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  { tableName: "items_orden" },
);

export default ItemOrden;
