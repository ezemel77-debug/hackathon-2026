import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CategoryChips from "../components/CategoryChips";
import ProductCard from "../components/ProductCard";
import { Cargando, ErrorAviso } from "../components/Estado";
import logo from '../img/logo_carmel.jpeg';

export default function Home() {
  const { usuario } = useAuth();
  const { agregar } = useCart();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState(null);

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      setError("");
      try {
        const [cats, prods] = await Promise.all([
          api.listarCategorias(),
          api.listarProductos(),
        ]);
        setCategorias(cats.categorias);
        setProductos(prods.productos);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  function seleccionarCategoria(id) {
    if (id === null) {
      setCategoriaActiva(null);
      return;
    }
    navigate(`/catalogo?categoria=${id}`);
  }

  async function handleAgregar(productoId) {
    if (!usuario) {
      navigate("/login");
      return;
    }
    await agregar(productoId);
  }

  const destacados = productos.slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
      <section className="overflow-hidden rounded-xl2 bg-forest-800 px-6 py-8 text-cream md:px-10 md:py-12">
        <p className="text-xs font-semibold uppercase tracking-wide text-honey-200">
          Calidad exportación
        </p>
        <h1 className="mt-2 max-w-md font-display text-3xl font-semibold leading-tight md:text-4xl">
          Miel artesanal de la sierra, directo a tu mesa
        </h1>
        <p className="mt-3 max-w-md text-sm text-cream/75">
          Productos apícolas y dulce de leche elaborados por pequeños
          productores de Córdoba, sin conservantes ni aditivos.
        </p>
        <Link
          to="/catalogo"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-honey-500 px-6 py-3 text-sm font-semibold text-forest-950 hover:bg-honey-600"
        >
          Ver productos →
        </Link>
        {/* <section>
       <img src={logo} alt="" srcset="" className="h-10 w-10 object-contain" />
      </section> */}
         
      </section>
      

      {error && (
        <div className="mt-6">
          <ErrorAviso mensaje={error} />
        </div>
      )}

      {cargando ? (
        <Cargando mensaje="Cargando catálogo..." />
      ) : (
        <>
          <section className="mt-8">
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">
              Categorías
            </h2>
            <CategoryChips
              categorias={categorias}
              categoriaActiva={categoriaActiva}
              onSeleccionar={seleccionarCategoria}
            />
          </section>

          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">
                Productos destacados
              </h2>
              <Link
                to="/catalogo"
                className="text-sm font-semibold text-forest-800 hover:underline"
              >
                Ver todo
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {destacados.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  onAgregar={handleAgregar}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
