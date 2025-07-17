import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../db/models/user.js';
import { sendResetPasswordEmail } from '../services/emailService.js';

export const sendResetEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(createError(404, 'User not found!'));
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  try {
    console.log("email із контролера:", email);
    console.log("resetLink із контролера:", resetLink);


    await sendResetPasswordEmail(email, resetLink);

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
