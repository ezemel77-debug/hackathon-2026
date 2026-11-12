import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
      <span className="text-5xl">🍯</span>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Página no encontrada
      </h1>
      <p className="text-sm text-ink/55">
        La página que buscás no existe o fue movida.
      </p>
      <Link to="/" className="btn-primary mt-2">
        Volver al inicio
      </Link>
    </div>
  );
}
