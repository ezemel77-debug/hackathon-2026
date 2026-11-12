import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";

export default function RestablecerPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [repetir, setRepetir] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [completado, setCompletado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function guardar(e) {
    e.preventDefault();
    setMensaje("");

    if (password !== repetir) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    setEnviando(true);

    try {
      const data = await api.restablecerPassword(token, password);
      setMensaje(data.message);
      setCompletado(true);
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="mb-4 text-2xl font-semibold">Nueva contraseña</h1>

      {!completado && (
        <form onSubmit={guardar} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            className="input-field"
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Repetir contraseña"
            className="input-field"
            minLength={6}
            required
            value={repetir}
            onChange={(e) => setRepetir(e.target.value)}
          />

          <button className="btn-primary" disabled={enviando}>
            {enviando ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </form>
      )}

      {mensaje && <p className="mt-4">{mensaje}</p>}

      <Link to="/login" className="mt-6 inline-block underline">
        Ir a iniciar sesión
      </Link>
    </div>
  );
}
