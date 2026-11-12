import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { api } from "../api/client";
import { formatearPrecio } from "../utils/format";
import ProductoImagen from "../components/ProductoImagen";
import { Cargando, ErrorAviso, Vacio } from "../components/Estado";

const metodosPago = [
  { valor: "efectivo", label: "Efectivo" },
  { valor: "débito", label: "Tarjeta de débito" },
  { valor: "crédito", label: "Tarjeta de crédito" },
  { valor: "Mercado Pago", label: "Mercado Pago" },
];

export default function Carrito() {
  const { carrito, cargando, actualizarCantidad, eliminarItem, refrescar } =
    useCart();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [metodoPago, setMetodoPago] = useState("Mercado Pago");
  const [confirmando, setConfirmando] = useState(false);
  const [mostrarPago, setMostrarPago] = useState(false);

  async function cambiarCantidad(item, delta) {
    const nueva = item.cantidad + delta;
    if (nueva < 1) return;
    setError("");
    try {
      await actualizarCantidad(item.id, nueva);
    } catch (err) {
      setError(err.message);
    }
  }

  async function quitarItem(itemId) {
    setError("");
    try {
      await eliminarItem(itemId);
    } catch (err) {
      setError(err.message);
    }
  }

  async function confirmarCompra() {
    setConfirmando(true);
    setError("");
    try {
      const data = await api.crearOrden({ metodo_pago: metodoPago });
      await refrescar();
      navigate(`/orden/${data.orden.id}`, { state: { orden: data.orden } });
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirmando(false);
    }
  }

  if (cargando) return <Cargando mensaje="Cargando carrito..." />;

  if (carrito.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Vacio
          titulo="Tu carrito está vacío"
          descripcion="Agregá productos desde el catálogo para armar tu pedido."
          accion={
            <Link to="/catalogo" className="btn-primary mt-2">
              Ver catálogo
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-32 pt-6 md:pb-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Carrito</h1>

      {error && (
        <div className="mt-4">
          <ErrorAviso mensaje={error} />
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3">
        {carrito.items.map((item) => (
          <div key={item.id} className="card flex gap-3 p-3">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-forest-50">
              <ProductoImagen producto={item.producto} />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-ink">
                    {item.producto?.nombre}
                  </h3>
                  <p className="text-xs text-ink/45">
                    {formatearPrecio(item.precio_unitario)} c/u
                  </p>
                </div>
                <button
                  onClick={() => quitarItem(item.id)}
                  aria-label="Quitar del carrito"
                  className="rounded-full p-1.5 text-ink/40 hover:bg-honey-100 hover:text-caramel-600"
                >
                  <TrashIcon />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-full border border-line">
                  <button
                    onClick={() => cambiarCantidad(item, -1)}
                    className="px-2.5 py-1 text-sm font-semibold text-forest-800"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm font-semibold">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => cambiarCantidad(item, 1)}
                    className="px-2.5 py-1 text-sm font-semibold text-forest-800"
                  >
                    +
                  </button>
                </div>
                <span className="font-display text-sm font-semibold text-forest-900">
                  {formatearPrecio(item.precio_unitario * item.cantidad)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-6 p-4">
        <div className="flex justify-between text-sm text-ink/60">
          <span>Subtotal ({carrito.cantidad} productos)</span>
          <span>{formatearPrecio(carrito.total)}</span>
        </div>
        <div className="flex justify-between text-sm text-ink/60">
          <span>Envío</span>
          <span>A calcular</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-line pt-2 font-display text-lg font-semibold text-ink">
          <span>Total</span>
          <span>{formatearPrecio(carrito.total)}</span>
        </div>

        {mostrarPago && (
          <div className="mt-4 flex flex-col gap-2">
            <p className="field-label">Método de pago</p>
            {metodosPago.map((m) => (
              <label
                key={m.valor}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${metodoPago === m.valor ? "border-forest-800 bg-forest-50" : "border-line"}`}
              >
                <input
                  type="radio"
                  name="metodo_pago"
                  value={m.valor}
                  checked={metodoPago === m.valor}
                  onChange={() => setMetodoPago(m.valor)}
                  className="accent-forest-800"
                />
                {m.label}
              </label>
            ))}
          </div>
        )}

        {mostrarPago ? (
          <button
            onClick={confirmarCompra}
            disabled={confirmando}
            className="btn-primary mt-4 w-full"
          >
            {confirmando ? "Procesando pago..." : "Confirmar compra"}
          </button>
        ) : (
          <button
            onClick={() => setMostrarPago(true)}
            className="btn-primary mt-4 w-full"
          >
            Confirmar compra
          </button>
        )}
        <p className="mt-3 text-center text-xs text-ink/40">
          🔒 Pago seguro · Mercado Pago
        </p>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
