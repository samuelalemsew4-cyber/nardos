const nodemailer = require('nodemailer');

const recipient = process.env.CONTACT_EMAIL || 'samuelalemsew4@gmail.com';

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendContactEmail = async ({ name, email, subject, message }) => {
  const transporter = createTransporter();
  if (!transporter) return false;

  await transporter.sendMail({
    from: `Nardos Website <${process.env.SMTP_USER}>`,
    to: recipient,
    replyTo: email,
    subject: `Website contact: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`
  });

  return true;
};

module.exports = { sendContactEmail };
