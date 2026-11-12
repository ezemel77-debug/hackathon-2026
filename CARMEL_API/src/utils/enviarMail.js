import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export default async function enviarMail(destino, asunto, mensaje) {
  return await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: destino,
    subject: asunto,
    text: mensaje,
  });
}
