const iconosPorCategoria = {
  miel: "🍯",
  "dulce de leche": "🫙",
};

export default function ProductoImagen({ producto, className = "" }) {
  const nombreCategoria = producto?.categoria?.nombre?.toLowerCase() || "";
  const icono = iconosPorCategoria[nombreCategoria] || "🌿";

  if (producto?.imagen_url) {
    return (
      <img
        src={producto.imagen_url}
        alt={producto.nombre}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-forest-50 text-4xl ${className}`}
    >
      {icono}
    </div>
  );
}
