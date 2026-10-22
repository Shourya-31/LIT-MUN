import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '../../config/env.js';

let transporter: Transporter | undefined;

if (env.SMTP_CONFIGURED) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });
}

export async function sendAccountEmail(to: string, subject: string, text: string): Promise<boolean> {
  if (!transporter || !env.EMAIL_FROM) {
    return false;
  }

  try {
    await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, text });
    return true;
  } catch {
    console.warn('Configured account email delivery failed; message content and credentials were not logged.');
    return false;
  }
}
