import nodemailer from 'nodemailer';
import { config } from '../../config/config.js';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS
  }
});

export const sendResetPasswordEmail = async (to, link) => {
  await transporter.sendMail({
    from: `"Admin" <${config.EMAIL_USER}>`,
    to,
    subject: 'Restablecer contraseña',
    html: `
      <h2>Solicitud de restablecimiento de contraseña</h2>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${link}">Restablecer Contraseña</a>
      <p>Este enlace expirará en 1 hora.</p>
    `
  });
};

export const sendTicketEmail = async (to, { ticketId, total, date, items }) => {
  const itemsHtml = items.map(item => `<li>${item.product.nombre} x${item.quantity}</li>`).join('');
  await transporter.sendMail({
    from: `"Admin" <${config.EMAIL_USER}>`,
    to,
    subject: 'Compra realizada con éxito',
    html: `
      <h2>Gracias por tu compra</h2>
      <p>ID de ticket: ${ticketId}</p>
      <p>Fecha: ${date}</p>
      <p>Total: $${total}</p>
      <ul>${itemsHtml}</ul>
    `
  });
};