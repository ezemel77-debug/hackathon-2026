import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { api, getToken, setToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarUsuario = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUsuario(null);
      setCargando(false);
      return;
    }
    try {
      const data = await api.me();
      setUsuario(data.usuario);
    } catch {
      setToken(null);
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarUsuario();
  }, [cargarUsuario]);

  async function login(email, password) {
    const data = await api.login({ email, password });
    setToken(data.token);
    setUsuario(data.usuario);
    return data.usuario;
  }

  async function registrar(payload) {
    const data = await api.register(payload);
    setToken(data.token);
    setUsuario(data.usuario);
    return data.usuario;
  }

  function logout() {
    setToken(null);
    setUsuario(null);
  }

  const esAdmin = ["administrador", "admin", "distribuidor"].includes(
    usuario?.rol,
  );

  return (
    <AuthContext.Provider
      value={{ usuario, cargando, login, registrar, logout, esAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
