import enviarMail from "./enviarMail.js";

export default async function enviaMailEstado(usuario, orden) {
  const mensaje = `Hola ${usuario.nombre}:

Te informamos que el estado de tu pedido en CARMEL ha cambiado.

Código de pedido: ${orden.codigo}

Nuevo estado: ${orden.estado}

Total del pedido: $${Number(orden.total).toFixed(2)}

Podés consultar tus pedidos ingresando a tu cuenta de CARMEL.

¡Gracias por confiar en nosotros!`;

  return await enviarMail(
    usuario.email,
    `Actualización de pedido ${orden.codigo} - CARMEL`,
    mensaje,
  );
}
