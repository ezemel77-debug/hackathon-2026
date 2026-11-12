import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const TOKEN_KEY = "carmel_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// Instancia de axios con la URL base de la API
const http = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de peticiones: agrega el token JWT si existe
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de respuestas: devuelve solo el cuerpo (response.data)
// y convierte los errores en un Error con un mensaje legible
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response
      ? error.response.data?.message || "Ocurrió un error inesperado"
      : "No se pudo conectar con el servidor. Verificá que la API esté corriendo.";
    return Promise.reject(new Error(message));
  },
);

export const api = {
  // Auth
  register: (payload) => http.post("/auth/register", payload),
  login: (payload) => http.post("/auth/login", payload),
  me: () => http.get("/auth/me"),

  //********************** PUNTO 2 */
  olvidePassword: (email) =>
  http.post("/auth/olvide-password", { email }),
  restablecerPassword: (token, password) =>
  http.post("/auth/restablecer-password", { token, password }),
  //*********************************** */

  // Categorías
  listarCategorias: () => http.get("/categorias"),

  // Productos
  listarProductos: (params) => http.get("/productos", { params }),
  obtenerProducto: (id) => http.get(`/productos/${id}`),
  listarProductosAdmin: () => http.get("/productos/admin/todos"),
  crearProducto: (payload) => http.post("/productos", payload),
  actualizarProducto: (id, payload) => http.put(`/productos/${id}`, payload),
  eliminarProducto: (id) => http.delete(`/productos/${id}`),

  // Carrito
  obtenerCarrito: () => http.get("/carrito"),
  agregarAlCarrito: (payload) => http.post("/carrito/items", payload),
  actualizarItemCarrito: (id, payload) =>
    http.put(`/carrito/items/${id}`, payload),
  eliminarItemCarrito: (id) => http.delete(`/carrito/items/${id}`),
  vaciarCarrito: () => http.delete("/carrito"),

  // Órdenes
  crearOrden: (payload) => http.post("/ordenes", payload),
  listarMisOrdenes: () => http.get("/ordenes"),
  obtenerOrden: (id) => http.get(`/ordenes/${id}`),
  listarOrdenesAdmin: (params) => http.get("/ordenes/admin/todas", { params }),
  actualizarEstadoOrden: (id, estado) =>
    http.put(`/ordenes/admin/${id}/estado`, { estado }),

  // Usuarios
  listarUsuarios: () => http.get("/usuarios"),
  obtenerUsuario: (id) => http.get(`/usuarios/${id}`),
  actualizarUsuario: (id, payload) => http.put(`/usuarios/${id}`, payload),
  historialUsuario: (id) => http.get(`/usuarios/${id}/historial`),

  // Status
  status: () => http.get("/status"),
};
