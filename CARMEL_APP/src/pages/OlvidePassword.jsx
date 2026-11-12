import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export default function OlvidePassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setMensaje("");
    setEnviando(true);

    try {
      const data = await api.olvidePassword(email);
      setMensaje(data.message);
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="mb-4 text-2xl font-semibold">Recuperar contraseña</h1>

      <form onSubmit={enviar} className="flex flex-col gap-4">
        <input
          type="email"
          required
          placeholder="Tu correo electrónico"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="btn-primary" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>

      {mensaje && <p className="mt-4">{mensaje}</p>}

      <Link to="/login" className="mt-6 inline-block underline">
        Volver al inicio de sesión
      </Link>
    </div>
  );
}
