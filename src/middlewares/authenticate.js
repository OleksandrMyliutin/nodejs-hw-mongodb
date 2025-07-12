import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { isTokenBlacklisted } from "./tokenBlacklist.js";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization header missing or malformed');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw createHttpError(401, 'Invalid authorization format');
    }

    if (isTokenBlacklisted(token)) {
      throw createHttpError(401, 'Access token revoked');
    }

    let user;
    try {
      user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Invalid access token');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
