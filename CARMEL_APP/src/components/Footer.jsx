import { Link, useLocation } from "react-router-dom";
import logo from "../img/logo_carmel.jpeg";

export default function Footer() {
  const location = useLocation();

  // Igual que el Header: no se muestra en login y registro
  const enAuth =
    location.pathname === "/login" || location.pathname === "/registro";
  if (enAuth) return null;

  return (
    <footer className="bg-forest-950 text-cream/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo Carmel" className="h-9 w-9 object-contain" />
            <span className="font-display text-xl font-semibold text-cream">
              CARMEL
            </span>
          </div>
          <p className="mt-3 text-sm">Productos de mi tierra</p>
          <p className="mt-1 text-sm text-cream/60">
            Miel y dulce de leche artesanales, de las sierras de Córdoba.
          </p>
        </div>

        <nav>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-honey-500">
            Navegación
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-cream">Inicio</Link>
            </li>
            <li>
              <Link to="/catalogo" className="hover:text-cream">Catálogo</Link>
            </li>
            <li>
              <Link to="/carrito" className="hover:text-cream">Carrito</Link>
            </li>
            <li>
              <Link to="/perfil" className="hover:text-cream">Mi perfil</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-honey-500">
            Proyecto
          </h3>
          <p className="mt-3 text-sm">
            Proyecto Integrador II – Tecnicatura Superior en Desarrollo Web y
            Aplicaciones Digitales
          </p>
          <p className="mt-1 text-sm text-cream/60">
            Instituto Superior Santa Rosa de Calamuchita
          </p>
        </div>
      </div>

      <div className="border-t border-forest-800 py-4 text-center text-xs text-cream/50">
        © 2026 CARMEL · E. Melendres – F. Fontana – Theo Iturri
      </div>
    </footer>
  );
}
