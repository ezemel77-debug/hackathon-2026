import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Orden = sequelize.define(
  "Orden",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    codigo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "pendiente",
    },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    metodo_pago: { type: DataTypes.STRING(50), allowNull: false },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: "ordenes" },
);

export default Orden;
