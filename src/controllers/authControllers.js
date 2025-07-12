import { registerUser } from '../services/authServices.js';
import { loginUser } from '../services/authServices.js';
import { logoutUser } from '../services/authServices.js';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { Session } from '../db/models/session.js';
import { addTokenToBlacklist } from "../middlewares/tokenBlacklist.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser({ name, email, password });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await loginUser({ email, password });

    res
    .status(200)
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    })
    .json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const { authorization = "" } = req.headers;
    const token = authorization.split(" ")[1];

    if (token) {
      addTokenToBlacklist(token);
    }

    if (!refreshToken) {
      return res.status(204).end();
    }

    await logoutUser(refreshToken);

    res.clearCookie('refreshToken').status(204).end();
  } catch (error) {
    next(error);
  }
};


export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token missing');
    }

    const session = await Session.findOne({ refreshToken });

    if (!session || session.refreshTokenValidUntil < new Date()) {
      throw createHttpError(403, 'Refresh token is expired or invalid');
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: payload.id, email: payload.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '1h' }
    );

    session.accessToken = newAccessToken;
    session.accessTokenValidUntil = new Date(Date.now() + 60 * 60 * 1000);
    await session.save();

    res.status(200).json({
      status: 200,
      message: 'Access token refreshed successfully!',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
