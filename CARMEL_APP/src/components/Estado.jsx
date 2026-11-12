export function Cargando({ mensaje = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink/50">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-forest-200 border-t-forest-800" />
      <p className="text-sm">{mensaje}</p>
    </div>
  );
}

export function ErrorAviso({ mensaje }) {
  return (
    <div className="rounded-xl border border-honey-500/40 bg-honey-100 px-4 py-3 text-sm text-caramel-700">
      {mensaje}
    </div>
  );
}

export function Vacio({ titulo, descripcion, accion }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl2 border border-dashed border-line px-6 py-16 text-center">
      <h3 className="font-display text-lg font-semibold text-ink">{titulo}</h3>
      {descripcion && (
        <p className="max-w-xs text-sm text-ink/60">{descripcion}</p>
      )}
      {accion}
    </div>
  );
}
