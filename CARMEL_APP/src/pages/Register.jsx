import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ErrorAviso } from "../components/Estado";

const initialForm = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  password: "",
};

export default function Register() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  function set(campo) {
    return (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setEnviando(true);
    try {
      await registrar(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-forest-900 px-6 py-6 text-cream">
        <div className="mx-auto flex max-w-sm items-center gap-3">
          <Link
            to="/login"
            aria-label="Volver"
            className="rounded-full p-1 hover:bg-forest-800"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M15 6l-6 6 6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <div>
            <h1 className="font-display text-xl font-semibold">Crear cuenta</h1>
            <p className="text-xs text-cream/70">
              Completá tus datos para registrarte
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="mx-auto flex max-w-sm flex-col gap-4 px-6 py-8"
      >
        {error && <ErrorAviso mensaje={error} />}

        <p className="text-xs font-semibold uppercase tracking-wide text-forest-800/70">
          Datos personales
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              required
              placeholder="Juan"
              className="input-field"
              value={form.nombre}
              onChange={set("nombre")}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="apellido">
              Apellido
            </label>
            <input
              id="apellido"
              required
              placeholder="Rodríguez"
              className="input-field"
              value={form.apellido}
              onChange={set("apellido")}
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="tucorreo@email.com"
            className="input-field"
            value={form.email}
            onChange={set("email")}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="telefono">
            Teléfono
          </label>
          <input
            id="telefono"
            type="tel"
            placeholder="+54 9 351 000-0000"
            className="input-field"
            value={form.telefono}
            onChange={set("telefono")}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            className="input-field"
            value={form.password}
            onChange={set("password")}
          />
          <p className="mt-1 text-xs text-ink/45">Mínimo 6 caracteres</p>
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="btn-primary mt-2 w-full"
        >
          {enviando ? "Creando cuenta..." : "Registrarme"}
        </button>

        <p className="text-center text-sm text-ink/60">
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/login"
            className="font-semibold text-forest-800 underline underline-offset-4"
          >
            Iniciá sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
