import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Usuario = sequelize.define(
  "Usuario",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rol_id: { type: DataTypes.INTEGER, allowNull: false },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellido: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    telefono: { type: DataTypes.STRING(20), allowNull: true },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    reset_token: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    reset_expira: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: "usuarios" },
);

export default Usuario;
