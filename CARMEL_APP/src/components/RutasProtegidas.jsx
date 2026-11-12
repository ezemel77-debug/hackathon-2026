import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Cargando } from "./Estado";

export function RutaPrivada({ children }) {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  if (cargando) return <Cargando mensaje="Verificando sesión..." />;
  if (!usuario)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export function RutaAdmin({ children }) {
  const { usuario, cargando, esAdmin } = useAuth();
  const location = useLocation();

  if (cargando) return <Cargando mensaje="Verificando sesión..." />;
  if (!usuario)
    return <Navigate to="/login" state={{ from: location }} replace />;
  if (!esAdmin) return <Navigate to="/" replace />;
  return children;
}
