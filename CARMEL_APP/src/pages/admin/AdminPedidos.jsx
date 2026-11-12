import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { formatearFecha, formatearPrecio } from "../../utils/format";
import { Cargando, ErrorAviso, Vacio } from "../../components/Estado";

const estados = ["pendiente", "confirmado", "entregado"];
const estadoEstilos = {
  pendiente: "bg-honey-100 text-caramel-700",
  confirmado: "bg-forest-100 text-forest-800",
  entregado: "bg-forest-800 text-cream",
};

export default function AdminPedidos() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  async function cargar(estado) {
    setCargando(true);
    setError("");
    try {
      const params = estado ? { estado } : {};
      const data = await api.listarOrdenesAdmin(params);
      setOrdenes(data.ordenes);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar(filtroEstado);
  }, [filtroEstado]);

  async function cambiarEstado(orden, nuevoEstado) {
    setError("");
    try {
      await api.actualizarEstadoOrden(orden.id, nuevoEstado);
      await cargar(filtroEstado);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFiltroEstado("")}
          className={`chip ${!filtroEstado ? "chip-active" : ""}`}
        >
          Todos
        </button>
        {estados.map((e) => (
          <button
            key={e}
            onClick={() => setFiltroEstado(e)}
            className={`chip capitalize ${filtroEstado === e ? "chip-active" : ""}`}
          >
            {e}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4">
          <ErrorAviso mensaje={error} />
        </div>
      )}

      {cargando ? (
        <Cargando mensaje="Cargando pedidos..." />
      ) : ordenes.length === 0 ? (
        <Vacio
          titulo="No hay pedidos"
          descripcion="Todavía no se registraron pedidos con este filtro."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {ordenes.map((orden) => (
            <div key={orden.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-sm font-semibold text-ink">
                    {orden.codigo}
                  </span>
                  <span className="ml-2 text-xs text-ink/50">
                    {formatearFecha(orden.created_at)}
                  </span>
                </div>
                <select
                  value={orden.estado}
                  onChange={(e) => cambiarEstado(orden, e.target.value)}
                  className={`rounded-full border-0 px-3 py-1 text-xs font-semibold capitalize ${estadoEstilos[orden.estado]}`}
                >
                  {estados.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-2 grid gap-1 text-sm text-ink/70 md:grid-cols-2">
                <p>
                  <span className="text-ink/50">Cliente:</span>{" "}
                  {orden.usuario?.nombre} {orden.usuario?.apellido}
                </p>
                <p>
                  <span className="text-ink/50">Contacto:</span>{" "}
                  {orden.usuario?.email}
                  {orden.usuario?.telefono
                    ? ` · ${orden.usuario.telefono}`
                    : ""}
                </p>
              </div>

              <p className="mt-2 truncate text-sm text-ink/60">
                {orden.items
                  ?.map((i) => `${i.cantidad}x ${i.producto?.nombre}`)
                  .join(", ")}
              </p>

              <div className="mt-2 flex justify-between border-t border-line pt-2">
                <span className="text-sm text-ink/55">{orden.metodo_pago}</span>
                <span className="font-display text-sm font-semibold text-forest-900">
                  {formatearPrecio(orden.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
