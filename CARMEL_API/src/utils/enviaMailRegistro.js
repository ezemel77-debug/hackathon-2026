import nodemailer from "nodemailer";

export default async function enviaMailReg(nombre, email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Bienvenido a CARMEL",
    text: `Hola ${nombre},\n\nTu registro en CARMEL fue exitoso.\n\n¡Gracias por registrarte!`,
  };

  return await transporter.sendMail(mailOptions);
}
