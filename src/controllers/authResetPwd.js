import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import { User } from '../db/models/user.js';

export const resetPwd = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.log(err.message);  
        return next(createError(401, 'Token is expired or invalid.'));
    }
    const { email } = payload;
    const user = await User.findOne({ email });
    if (!user) {
        return next(createError(404, 'User not found!'));
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    user.refreshToken = null;
    await user.save();

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
