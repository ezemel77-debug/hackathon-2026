import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from '../img/logo_carmel.jpeg';

export default function Header() {
  const { usuario, logout, esAdmin } = useAuth();
  const { carrito } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [busqueda, setBusqueda] = useState("");

  function buscar(e) {
    e.preventDefault();
    const q = busqueda.trim();
    navigate(q ? `/catalogo?buscar=${encodeURIComponent(q)}` : "/catalogo");
  }

  const enAuth =
    location.pathname === "/login" || location.pathname === "/registro";
  if (enAuth) return null;

  return (
    <header className="sticky top-0 z-30 bg-forest-900 text-cream">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4 md:gap-6">
        {/* <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-honey-500 text-sm font-display font-semibold text-forest-950">
            C
          </span>
          <span className="font-display text-xl font-semibold leading-none">
            CARMEL
          </span>
        </Link> */}

        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img
            src={logo}
            alt="Logo Carmel"
            className="h-9 w-9 object-contain"
          />
          <span className="font-display text-xl font-semibold leading-none">
            CARMEL
          </span>
        </Link>

        <form
          onSubmit={buscar}
          className="order-3 w-full md:order-2 md:max-w-md md:flex-1"
        >
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            type="search"
            placeholder="Buscar productos..."
            className="w-full rounded-full border border-forest-700 bg-forest-800 px-4 py-2 text-sm text-cream placeholder:text-cream/50 focus:border-honey-500 focus:outline-none"
          />
        </form>

        <nav className="order-2 ml-auto flex items-center gap-1 md:order-3 md:gap-3">
          <Link
            to="/catalogo"
            className="hidden rounded-full px-3 py-2 text-sm font-medium hover:bg-forest-800 md:inline-block"
          >
            Catálogo
          </Link>
          {esAdmin && (
            <Link
              to="/admin/productos"
              className="hidden rounded-full px-3 py-2 text-sm font-medium hover:bg-forest-800 md:inline-block"
            >
              Panel admin
            </Link>
          )}
          <Link
            to="/carrito"
            className="relative rounded-full p-2 hover:bg-forest-800"
            aria-label="Carrito"
          >
            <CartIcon />
            {carrito.cantidad > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-honey-500 text-[10px] font-bold text-forest-950">
                {carrito.cantidad}
              </span>
            )}
          </Link>
          {usuario ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/perfil"
                className="rounded-full px-3 py-2 text-sm font-medium hover:bg-forest-800"
              >
                Hola, {usuario.nombre}
              </Link>
              <button
                onClick={logout}
                className="rounded-full px-3 py-2 text-sm font-medium text-cream/70 hover:bg-forest-800"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full bg-honey-500 px-4 py-2 text-sm font-semibold text-forest-950 hover:bg-honey-600 md:inline-block"
            >
              Ingresar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path
        d="M2.5 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 7H6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
