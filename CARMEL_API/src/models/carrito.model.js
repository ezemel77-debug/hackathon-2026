import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Carrito = sequelize.define(
  "Carrito",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: "carrito" },
);

export default Carrito;
