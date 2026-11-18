import { Link, useLocation } from "react-router-dom";

export default function RegistroPendiente() {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div className="min-h-screen bg-cream px-6 py-12">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-soft">
        <div className="mb-4 text-5xl">✉️</div>

        <h1 className="font-display text-2xl font-semibold text-forest-900">
          Revisá tu correo electrónico
        </h1>

        <p className="mt-4 text-sm text-ink/70">
          Tu cuenta fue creada, pero todavía no está confirmada.
        </p>

        {email && <p className="mt-3 font-semibold text-forest-800">{email}</p>}

        <p className="mt-4 text-sm text-ink/70">
          Te enviamos un correo con un enlace para verificar tu dirección de
          email y activar tu cuenta.
        </p>

        <p className="mt-4 text-sm text-ink/70">
          Abrí el mensaje y hacé clic en el enlace de confirmación.
        </p>

        <p className="mt-3 text-xs text-ink/50">
          El enlace tiene una validez de 24 horas. Si no encontrás el correo,
          revisá la carpeta Spam.
        </p>

        <Link to="/login" className="btn-secondary mt-6 inline-flex">
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
