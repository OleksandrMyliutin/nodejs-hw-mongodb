import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendResetPasswordEmail = async (email, resetLink) => {
    console.log("Відправка листа на:", email, "Посилання:", resetLink);
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Password Reset',
        html: `
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 5 minutes.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};
