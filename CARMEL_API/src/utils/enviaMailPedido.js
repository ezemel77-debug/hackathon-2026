import enviarMail from "./enviarMail.js";

export default async function enviaMailPedido(usuario, orden, items) {
  const detalle = items
    .map((item) => {
      const nombre = item.producto.nombre;
      const cantidad = item.cantidad;
      const precio = Number(item.precio_unitario);
      const subtotal = cantidad * precio;

      return `${nombre} - ${cantidad} x $${precio.toFixed(2)} = $${subtotal.toFixed(2)}`;
    })
    .join("\n");

  const comprobante = `Hola ${usuario.nombre}:

Tu pedido en CARMEL fue registrado correctamente.

Código: ${orden.codigo}

PRODUCTOS:
${detalle}

Total: $${Number(orden.total).toFixed(2)}
Método de pago: ${orden.metodo_pago}
Estado: ${orden.estado}

¡Gracias por tu compra!`;

  const avisoAdmin = `Nuevo pedido recibido en CARMEL.

Código: ${orden.codigo}
Cliente: ${usuario.nombre} ${usuario.apellido}
Correo: ${usuario.email}

PRODUCTOS:
${detalle}

Total: $${Number(orden.total).toFixed(2)}
Método de pago: ${orden.metodo_pago}
Estado: ${orden.estado}

Ingresá al panel de administración para gestionarlo.`;

  const resultados = await Promise.allSettled([
    enviarMail(
      usuario.email,
      `Confirmación de pedido ${orden.codigo} - CARMEL`,
      comprobante,
    ),
    enviarMail(
      process.env.ADMIN_EMAIL,
      `Nuevo pedido ${orden.codigo} - CARMEL`,
      avisoAdmin,
    ),
  ]);

  for (const resultado of resultados) {
    if (resultado.status === "rejected") {
      console.error("Error enviando mail de pedido:", resultado.reason);
    }
  }
}
