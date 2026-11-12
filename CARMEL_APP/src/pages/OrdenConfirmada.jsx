import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { formatearFecha, formatearPrecio } from "../utils/format";
import { Cargando, ErrorAviso } from "../components/Estado";

export default function OrdenConfirmada() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const [orden, setOrden] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .obtenerOrden(id)
      .then((d) => setOrden(d.orden))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return <Cargando mensaje="Confirmando tu pedido..." />;
  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <ErrorAviso mensaje={error} />
        <Link to="/perfil" className="btn-secondary mt-4 inline-flex">
          Ver mis pedidos
        </Link>
      </div>
    );
  }

  const totalUnidades =
    orden.items?.reduce((sum, i) => sum + i.cantidad, 0) || 0;

  return (
    <div className="mx-auto max-w-md px-4 pb-12 pt-6">
      <h1 className="mb-4 font-display text-xl font-semibold text-ink">
        Orden de compra
      </h1>

      <div className="card p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-800 text-3xl text-cream">
          ✓
        </div>
        <h2 className="mt-4 font-display text-xl font-semibold text-ink">
          ¡Pago exitoso!
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Gracias por tu compra, te esperamos pronto.
        </p>
      </div>

      <dl className="card mt-4 divide-y divide-line p-4 text-sm">
        <Fila
          label="Cliente"
          valor={usuario ? `${usuario.apellido}, ${usuario.nombre}` : "—"}
        />
        <Fila label="Fecha" valor={formatearFecha(orden.created_at)} />
        <Fila label="Método de pago" valor={orden.metodo_pago} />
        <Fila label="Productos" valor={`${totalUnidades} unidades`} />
        <Fila
          label="Total abonado"
          valor={formatearPrecio(orden.total)}
          destacado
        />
      </dl>

      <div className="card mt-4 flex flex-col items-center gap-3 p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
          Código de orden · guardalo para consultas
        </p>
        <div className="flex h-32 w-32 items-center justify-center rounded-xl border-2 border-dashed border-forest-700 bg-forest-50 font-display text-sm font-semibold text-forest-800">
          QR
        </div>
        <p className="font-mono text-sm font-semibold tracking-wide text-ink">
          {orden.codigo}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Link to="/perfil" className="btn-secondary w-full">
          Seguir mi pedido
        </Link>
        <Link to="/" className="btn-primary w-full">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

function Fila({ label, valor, destacado }) {
  return (
    <div className="flex justify-between py-2.5">
      <dt className="text-ink/55">{label}</dt>
      <dd
        className={
          destacado
            ? "font-display text-base font-semibold text-forest-900"
            : "font-medium text-ink"
        }
      >
        {valor}
      </dd>
    </div>
  );
}
