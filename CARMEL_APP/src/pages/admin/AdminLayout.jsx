import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { to: "/admin/productos", label: "Productos" },
  { to: "/admin/pedidos", label: "Pedidos" },
  { to: "/admin/usuarios", label: "Usuarios" },
];

export default function AdminLayout() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-6">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Panel de administración
      </h1>
      <p className="mt-1 text-sm text-ink/55">
        Gestioná el catálogo, los pedidos y los usuarios de CARMEL.
      </p>

      <div className="mt-5 flex gap-2 border-b border-line">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `border-b-2 px-3 py-2.5 text-sm font-semibold ${
                isActive
                  ? "border-forest-800 text-forest-800"
                  : "border-transparent text-ink/50 hover:text-ink"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}
