import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { Session } from "../db/models/session.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization header missing or malformed');
    }
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw createHttpError(401, 'Invalid authorization format');
    }
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Invalid access token');
    }

    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (error) {
    next(error);
  }
};

