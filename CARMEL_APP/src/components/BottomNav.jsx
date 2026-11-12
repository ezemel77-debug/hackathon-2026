import { NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const items = [
  { to: "/", label: "Inicio", icon: HomeIcon, end: true },
  { to: "/catalogo", label: "Catálogo", icon: GridIcon },
  { to: "/carrito", label: "Carrito", icon: BagIcon },
  { to: "/perfil", label: "Perfil", icon: UserIcon },
];

export default function BottomNav() {
  const { carrito } = useCart();
  const location = useLocation();

  const enAuth =
    location.pathname === "/login" || location.pathname === "/registro";
  if (enAuth) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white md:hidden">
      <div className="mx-auto flex max-w-6xl justify-around">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                isActive ? "text-forest-800" : "text-ink/45"
              }`
            }
          >
            <Icon />
            {label}
            {to === "/carrito" && carrito.cantidad > 0 && (
              <span className="absolute right-6 top-1.5 h-1.5 w-1.5 rounded-full bg-honey-500" />
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M3 11.5 12 4l9 7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M6 8h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5L6 8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
    </svg>
  );
}
