import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatearPrecio } from "../utils/format";
import ProductoImagen from "../components/ProductoImagen";
import { Cargando, ErrorAviso } from "../components/Estado";

const etiquetasFijas = [
  "Sin TACC",
  "Habilitación SENASA",
  "Calidad exportación",
];

export default function ProductoDetalle() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const { agregar } = useCart();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [agregando, setAgregando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    setCargando(true);
    setError("");
    setCantidad(1);
    api
      .obtenerProducto(id)
      .then((d) => setProducto(d.producto))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [id]);

  async function handleAgregar() {
    if (!usuario) {
      navigate("/login");
      return;
    }
    setAgregando(true);
    setMensaje("");
    try {
      await agregar(producto.id, cantidad);
      setMensaje("Producto agregado al carrito");
    } catch (err) {
      setError(err.message);
    } finally {
      setAgregando(false);
    }
  }

  if (cargando) return <Cargando mensaje="Cargando producto..." />;
  if (error && !producto) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <ErrorAviso mensaje={error} />
        <Link to="/catalogo" className="btn-secondary mt-4 inline-flex">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const sinStock = producto.stock <= 0;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-10 pt-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-forest-800"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M15 6l-6 6 6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Volver
      </button>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl2 bg-forest-50">
          <ProductoImagen producto={producto} />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-caramel-600">
            {producto.categoria?.nombre}
          </span>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
            {producto.nombre}
          </h1>
          <p className="mt-2 font-display text-3xl font-semibold text-forest-900">
            {formatearPrecio(producto.precio)}
          </p>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-line">
              <button
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                className="px-3 py-2 text-lg font-semibold text-forest-800"
                aria-label="Restar cantidad"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold">
                {cantidad}
              </span>
              <button
                onClick={() =>
                  setCantidad((c) => Math.min(producto.stock, c + 1))
                }
                className="px-3 py-2 text-lg font-semibold text-forest-800"
                aria-label="Sumar cantidad"
              >
                +
              </button>
            </div>
            <span className="text-sm text-ink/50">
              {sinStock
                ? "Sin stock disponible"
                : `Stock: ${producto.stock} u.`}
            </span>
          </div>

          {producto.descripcion && (
            <p className="mt-5 text-sm leading-relaxed text-ink/70">
              {producto.descripcion}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {etiquetasFijas.map((etiqueta) => (
              <span
                key={etiqueta}
                className="chip border-forest-100 bg-forest-50 text-forest-800"
              >
                {etiqueta}
              </span>
            ))}
          </div>

          {mensaje && (
            <p className="mt-4 rounded-xl bg-forest-100 px-4 py-2.5 text-sm font-medium text-forest-800">
              {mensaje}
            </p>
          )}
          {error && producto && (
            <div className="mt-4">
              <ErrorAviso mensaje={error} />
            </div>
          )}

          <button
            onClick={handleAgregar}
            disabled={sinStock || agregando}
            className="btn-primary mt-6 w-full"
          >
            {sinStock
              ? "Sin stock"
              : agregando
                ? "Agregando..."
                : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}
