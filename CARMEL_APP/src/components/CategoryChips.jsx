export default function CategoryChips({
  categorias,
  categoriaActiva,
  onSeleccionar,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSeleccionar(null)}
        className={`chip ${!categoriaActiva ? "chip-active" : "hover:border-forest-700"}`}
      >
        Todo
      </button>
      {categorias.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSeleccionar(cat.id)}
          className={`chip ${categoriaActiva === cat.id ? "chip-active" : "hover:border-forest-700"}`}
        >
          {cat.nombre}
        </button>
      ))}
    </div>
  );
}
