import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { api } from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { usuario } = useAuth();
  const [carrito, setCarrito] = useState({
    items: [],
    cantidad: 0,
    total: "0.00",
  });
  const [cargando, setCargando] = useState(false);

  const refrescar = useCallback(async () => {
    if (!usuario) {
      setCarrito({ items: [], cantidad: 0, total: "0.00" });
      return;
    }
    setCargando(true);
    try {
      const data = await api.obtenerCarrito();
      setCarrito(data.carrito);
    } finally {
      setCargando(false);
    }
  }, [usuario]);

  useEffect(() => {
    refrescar();
  }, [refrescar]);

  async function agregar(producto_id, cantidad = 1) {
    await api.agregarAlCarrito({ producto_id, cantidad });
    await refrescar();
  }

  async function actualizarCantidad(itemId, cantidad) {
    await api.actualizarItemCarrito(itemId, { cantidad });
    await refrescar();
  }

  async function eliminarItem(itemId) {
    await api.eliminarItemCarrito(itemId);
    await refrescar();
  }

  async function vaciar() {
    await api.vaciarCarrito();
    await refrescar();
  }

  return (
    <CartContext.Provider
      value={{
        carrito,
        cargando,
        refrescar,
        agregar,
        actualizarCantidad,
        eliminarItem,
        vaciar,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
