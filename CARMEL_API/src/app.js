import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "API CARMEL - Productos de mi tierra",
  });
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    ok: false,
    message: err.message || "Error interno del servidor",
  });
});

export default app;
