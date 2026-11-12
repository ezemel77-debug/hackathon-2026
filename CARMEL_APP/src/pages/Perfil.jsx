import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { formatearFecha, formatearPrecio } from "../utils/format";
import { Cargando, ErrorAviso, Vacio } from "../components/Estado";

const estadoEstilos = {
  pendiente: "bg-honey-100 text-caramel-700",
  confirmado: "bg-forest-100 text-forest-800",
  entregado: "bg-forest-800 text-cream",
};

export default function Perfil() {
  const { usuario, logout, esAdmin } = useAuth();
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listarMisOrdenes()
      .then((d) => setOrdenes(d.ordenes))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-12 pt-6">
      <div className="card flex items-center gap-4 p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-800 font-display text-xl font-semibold text-cream">
          {usuario.nombre?.[0]}
          {usuario.apellido?.[0]}
        </div>
        <div>
          <h1 className="font-display text-lg font-semibold text-ink">
            {usuario.nombre} {usuario.apellido}
          </h1>
          <p className="text-sm text-ink/55">{usuario.email}</p>
          {usuario.telefono && (
            <p className="text-sm text-ink/55">{usuario.telefono}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {esAdmin && (
          <button
            onClick={() => navigate("/admin/productos")}
            className="btn-secondary"
          >
            Panel de administración
          </button>
        )}
        <button onClick={handleLogout} className="btn-ghost">
          Cerrar sesión
        </button>
      </div>

      <h2 className="mb-3 mt-8 font-display text-lg font-semibold text-ink">
        Historial de compras
      </h2>

      {cargando ? (
        <Cargando mensaje="Cargando historial..." />
      ) : error ? (
        <ErrorAviso mensaje={error} />
      ) : ordenes.length === 0 ? (
        <Vacio
          titulo="Todavía no hiciste pedidos"
          descripcion="Cuando confirmes una compra, la vas a ver acá."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {ordenes.map((orden) => (
            <div key={orden.id} className="card p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-ink">
                  {orden.codigo}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${estadoEstilos[orden.estado] || "bg-line text-ink"}`}
                >
                  {orden.estado}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink/50">
                {formatearFecha(orden.created_at)} · {orden.metodo_pago}
              </p>
              <p className="mt-1 truncate text-sm text-ink/70">
                {orden.items?.map((i) => i.producto?.nombre).join(", ")}
              </p>
              <div className="mt-2 flex justify-between border-t border-line pt-2">
                <span className="text-sm text-ink/55">
                  {orden.items?.reduce((s, i) => s + i.cantidad, 0)} unidades
                </span>
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
