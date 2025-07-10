import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw createHttpError(401, 'Authorization header missing');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw createHttpError(401, 'Invalid authorization format');
    }

    const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = user; // Зберігаємо користувача у req
    next();
  } catch (error) {
    next(createHttpError(401, error.message || 'Invalid or expired token'));
  }
};
