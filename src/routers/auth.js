import express from 'express';
import { register, login, logout, refreshToken } from '../controllers/authControllers.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/contactSchemas.js';
import { authenticate } from '../middlewares/authenticate.js';

import { sendResetEmail } from '../controllers/auth/sendResetEmail.js';
import { resetEmailSchema } from '../schemas/users/resetEmailSchema.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), register);
authRouter.post('/login', validateBody(loginSchema), login);
authRouter.post('/logout', authenticate, logout);
authRouter.post('/refresh', refreshToken);
authRouter.post('/send-reset-email', validateBody(resetEmailSchema), sendResetEmail);

export default authRouter;