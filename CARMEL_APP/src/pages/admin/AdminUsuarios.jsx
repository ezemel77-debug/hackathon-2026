import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { formatearFecha, formatearPrecio } from "../../utils/format";
import { Cargando, ErrorAviso, Vacio } from "../../components/Estado";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [expandido, setExpandido] = useState(null);
  const [historiales, setHistoriales] = useState({});

  async function cargar() {
    setCargando(true);
    setError("");
    try {
      const data = await api.listarUsuarios();
      setUsuarios(data.usuarios);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function toggleActivo(usuario) {
    setError("");
    try {
      await api.actualizarUsuario(usuario.id, { activo: !usuario.activo });
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  async function verHistorial(usuario) {
    if (expandido === usuario.id) {
      setExpandido(null);
      return;
    }
    setExpandido(usuario.id);
    if (!historiales[usuario.id]) {
      try {
        const data = await api.historialUsuario(usuario.id);
        setHistoriales((h) => ({ ...h, [usuario.id]: data.ordenes }));
      } catch (err) {
        setError(err.message);
      }
    }
  }

  if (cargando) return <Cargando mensaje="Cargando usuarios..." />;

  return (
    <div>
      {error && (
        <div className="mb-4">
          <ErrorAviso mensaje={error} />
        </div>
      )}

      {usuarios.length === 0 ? (
        <Vacio titulo="No hay usuarios registrados" />
      ) : (
        <div className="flex flex-col gap-3">
          {usuarios.map((u) => (
            <div key={u.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {u.nombre} {u.apellido}
                    <span className="ml-2 rounded-full bg-forest-50 px-2 py-0.5 text-xs font-medium capitalize text-forest-800">
                      {u.rol?.nombre}
                    </span>
                  </p>
                  <p className="text-xs text-ink/50">
                    {u.email}
                    {u.telefono ? ` · ${u.telefono}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.activo ? "bg-forest-100 text-forest-800" : "bg-line text-ink/60"}`}
                  >
                    {u.activo ? "Activo" : "Inactivo"}
                  </span>
                  <button
                    onClick={() => toggleActivo(u)}
                    className="btn-ghost !px-3 !py-1.5"
                  >
                    {u.activo ? "Desactivar" : "Activar"}
                  </button>
                  <button
                    onClick={() => verHistorial(u)}
                    className="btn-ghost !px-3 !py-1.5"
                  >
                    {expandido === u.id ? "Ocultar" : "Historial"}
                  </button>
                </div>
              </div>

              {expandido === u.id && (
                <div className="mt-3 border-t border-line pt-3">
                  {!historiales[u.id] ? (
                    <Cargando mensaje="Cargando historial..." />
                  ) : historiales[u.id].length === 0 ? (
                    <p className="text-sm text-ink/50">
                      Este usuario todavía no hizo pedidos.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {historiales[u.id].map((o) => (
                        <div
                          key={o.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="font-mono text-ink/70">
                            {o.codigo}
                          </span>
                          <span className="text-ink/50">
                            {formatearFecha(o.created_at)}
                          </span>
                          <span className="capitalize text-ink/60">
                            {o.estado}
                          </span>
                          <span className="font-semibold text-forest-900">
                            {formatearPrecio(o.total)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
