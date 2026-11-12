import "dotenv/config";
import app from "./src/app.js";
import { sequelize } from "./src/models/index.js";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✓ Conexión a base de datos establecida");
    app.listen(PORT, () => {
      console.log(`✓ CARMEL API ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("✗ No se pudo conectar a la base de datos:", error.message);
    process.exit(1);
  }
}

start();
