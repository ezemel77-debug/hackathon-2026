import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ErrorAviso } from "../components/Estado";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [mostrarPass, setMostrarPass] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const destino = location.state?.from?.pathname || "/";

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await login(form.email, form.password);
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-forest-900">
      <div className="flex flex-col items-center gap-3 px-6 pb-10 pt-16 text-center text-cream">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-honey-500 font-display text-2xl font-semibold text-forest-950">
          C
        </span>
        <h1 className="font-display text-2xl font-semibold">Ingreso seguro</h1>
        <p className="text-sm text-cream/70">Productos de mi tierra</p>
      </div>

      <div className="flex-1 rounded-t-[2rem] bg-cream px-6 pb-10 pt-8 shadow-soft">
        <form
          onSubmit={onSubmit}
          className="mx-auto flex max-w-sm flex-col gap-4"
        >
          {error && <ErrorAviso mensaje={error} />}

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
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={mostrarPass ? "text" : "password"}
                required
                placeholder="••••••••"
                className="input-field pr-12"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setMostrarPass((v) => !v)}
                className="absolute inset-y-0 right-3 text-xs font-medium text-forest-800"
              >
                {mostrarPass ? "Ocultar" : "Ver"}
              </button>
            </div>
            <div className="mt-2 text-right">
              <span className="text-xs text-ink/50">
                ¿Olvidaste tu contraseña?
              </span>
              <Link
                to="/olvide-password"
                className="text-xs text-ink/50 underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="btn-primary mt-2 w-full"
          >
            {enviando ? "Ingresando..." : "Iniciar sesión"}
          </button>

          <div className="my-1 flex items-center gap-3 text-xs text-ink/40">
            <span className="h-px flex-1 bg-line" /> o{" "}
            <span className="h-px flex-1 bg-line" />
          </div>

          <Link to="/registro" className="btn-secondary w-full">
            Crear cuenta nueva
          </Link>

          <Link
            to="/catalogo"
            className="mt-2 text-center text-sm text-forest-800 underline underline-offset-4"
          >
            ¿Solo querés ver productos? Ingresar como visitante
          </Link>
        </form>
      </div>
    </div>
  );
}
