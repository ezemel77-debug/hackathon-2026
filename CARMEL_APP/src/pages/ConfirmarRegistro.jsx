import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";

export default function ConfirmarRegistro() {
  const { token } = useParams();

  const [estado, setEstado] = useState("verificando");
  const [mensaje, setMensaje] = useState("");

  const [mailEnviado, setMailEnviado] = useState(false);

  const iniciado = useRef(false);

  useEffect(() => {
    if (iniciado.current) return;
    iniciado.current = true;

    async function verificar() {
      try {
        const data = await api.confirmarRegistro(token);

        setMensaje(data.message);
        setMailEnviado(data.mailEnviado);
        setEstado("correcto");
      } catch (error) {
        setMensaje(error.message);
        setEstado("error");
      }
    }

    verificar();
  }, [token]);

  return (
    <div className="min-h-screen bg-cream px-6 py-12">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-soft">
        {estado === "verificando" && (
          <>
            <div className="mb-4 text-5xl">⌛</div>

            <h1 className="font-display text-2xl font-semibold">
              Verificando tu cuenta...
            </h1>

            <p className="mt-4 text-ink/70">
              Estamos confirmando tu correo electrónico.
            </p>
          </>
        )}

        {estado === "correcto" && (
          <>
            <div className="mb-4 text-5xl">✅</div>

            <h1 className="font-display text-2xl font-semibold text-forest-900">
              ¡Registro confirmado!
            </h1>

            <p className="mt-4 text-ink/70">{mensaje}</p>

            <p className="mt-4 text-ink/70">
              {mailEnviado
                ? "Tu cuenta ya está activa. También te enviamos un correo de bienvenida."
                : "Tu cuenta está activa, aunque no pudimos enviar el correo de bienvenida."}
            </p>

            <Link to="/login" className="btn-primary mt-6 inline-flex">
              Iniciar sesión
            </Link>
          </>
        )}

        {estado === "error" && (
          <>
            <div className="mb-4 text-5xl">⚠️</div>

            <h1 className="font-display text-2xl font-semibold">
              No se pudo confirmar el registro
            </h1>

            <p className="mt-4 text-red-600">{mensaje}</p>

            <Link to="/login" className="btn-secondary mt-6 inline-flex">
              Volver al inicio
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
