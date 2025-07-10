import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../../models/User.js';
import { createTestAccount } from '../../helpers/email/createTestAccount.js';
import nodemailer from 'nodemailer';


export const sendResetEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(createError(404, 'User not found!'));
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  try {
    const { transporter, testAccount } = await createTestAccount();

    const info = await transporter.sendMail({
      from: `"No Reply" <${testAccount.user}>`,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    console.error(error);
    next(createError(500, 'Failed to send the email, please try again later.'));
  }
};