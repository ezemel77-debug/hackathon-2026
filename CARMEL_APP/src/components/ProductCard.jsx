import { Link } from "react-router-dom";
import { useState } from "react";
import { formatearPrecio } from "../utils/format";
import ProductoImagen from "./ProductoImagen";

export default function ProductCard({ producto, onAgregar }) {
  const [agregando, setAgregando] = useState(false);
  const sinStock = producto.stock <= 0;

  async function handleAgregar(e) {
    e.preventDefault();
    if (sinStock || agregando) return;
    setAgregando(true);
    try {
      await onAgregar(producto.id);
    } finally {
      setAgregando(false);
    }
  }

  return (
    <Link
      to={`/producto/${producto.id}`}
      className="card group flex flex-col overflow-hidden transition hover:shadow-soft"
    >
      <div className="aspect-square w-full overflow-hidden bg-forest-50">
        <ProductoImagen
          producto={producto}
          className="transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-caramel-600">
          {producto.categoria?.nombre}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold text-ink">
          {producto.nombre}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg font-semibold text-forest-900">
            {formatearPrecio(producto.precio)}
          </span>
          <button
            onClick={handleAgregar}
            disabled={sinStock || agregando}
            className="rounded-full bg-forest-800 px-3.5 py-1.5 text-xs font-semibold text-cream transition hover:bg-forest-700 disabled:cursor-not-allowed disabled:bg-ink/20"
          >
            {sinStock ? "Sin stock" : agregando ? "..." : "+ Agregar"}
          </button>
        </div>
      </div>
    </Link>
  );
}
