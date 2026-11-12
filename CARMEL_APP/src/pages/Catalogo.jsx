import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CategoryChips from "../components/CategoryChips";
import ProductCard from "../components/ProductCard";
import { Cargando, ErrorAviso, Vacio } from "../components/Estado";

export default function Catalogo() {
  const { usuario } = useAuth();
  const { agregar } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoriaId = searchParams.get("categoria")
    ? Number(searchParams.get("categoria"))
    : null;
  const busquedaUrl = searchParams.get("buscar") || "";

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState(busquedaUrl);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listarCategorias()
      .then((d) => setCategorias(d.categorias))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setBusqueda(busquedaUrl);
  }, [busquedaUrl]);

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      setError("");
      try {
        const params = {};
        if (categoriaId) params.categoria = categoriaId;
        if (busquedaUrl) params.search = busquedaUrl;
        const data = await api.listarProductos(params);
        setProductos(data.productos);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [categoriaId, busquedaUrl]);

  function actualizarParams(nuevos) {
    const params = new URLSearchParams(searchParams);
    Object.entries(nuevos).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    setSearchParams(params);
  }

  function onSubmitBusqueda(e) {
    e.preventDefault();
    actualizarParams({ buscar: busqueda.trim() || null });
  }

  async function handleAgregar(productoId) {
    if (!usuario) {
      navigate("/login");
      return;
    }
    await agregar(productoId);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Catálogo</h1>

      <form onSubmit={onSubmitBusqueda} className="mt-4 flex gap-2 md:hidden">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          type="search"
          placeholder="Buscar productos..."
          className="input-field"
        />
        <button type="submit" className="btn-secondary shrink-0 px-4">
          Buscar
        </button>
      </form>

      <div className="mt-4">
        <CategoryChips
          categorias={categorias}
          categoriaActiva={categoriaId}
          onSeleccionar={(id) => actualizarParams({ categoria: id })}
        />
      </div>

      {busquedaUrl && (
        <p className="mt-4 text-sm text-ink/60">
          Resultados para{" "}
          <span className="font-semibold text-ink">"{busquedaUrl}"</span>
        </p>
      )}

      <div className="mt-6">
        {cargando ? (
          <Cargando mensaje="Buscando productos..." />
        ) : error ? (
          <ErrorAviso mensaje={error} />
        ) : productos.length === 0 ? (
          <Vacio
            titulo="No encontramos productos"
            descripcion="Probá con otra categoría o cambiá los términos de búsqueda."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {productos.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onAgregar={handleAgregar}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
