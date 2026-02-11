// services/mailer.js
const nodemailer = require('nodemailer');

function createTransporterFromEnv() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    // No SMTP configured — we’ll just log reset links to console
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: String(SMTP_SECURE || 'false') === 'true', // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

const transporter = createTransporterFromEnv();

async function sendEmail({ to, subject, html, text }) {
  if (!transporter) {
    // Dev fallback: log the email content and continue
    console.log('--- Email (dev fallback) ---');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text || '');
    console.log('HTML:', html || '');
    console.log('---------------------------');
    return { messageId: 'dev-fallback', previewUrl: null };
  }

  const from = process.env.EMAIL_FROM || 'No-Reply <no-reply@example.com>';
  const info = await transporter.sendMail({ from, to, subject, text, html });
  // Some providers may give preview URLs; nodemailer has it for Ethereal accounts
  const previewUrl = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null;
  if (previewUrl) {
    console.log('Preview URL:', previewUrl);
  }
  return { messageId: info.messageId, previewUrl };
}

module.exports = { sendEmail };