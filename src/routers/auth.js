import express from 'express';
import { register, login, logout, refreshToken } from '../controllers/authControllers.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/contactSchemas.js';

import { sendResetEmail } from '../controllers/authSendResetEmail.js';
import { resetPwd } from '../controllers/authResetPwd.js';
import { resetEmailSchema, resetPwdSchema } from '../validation/usersResetSchema.js';

import upload from '../middlewares/uploadImage.js';
import { updateAvatar } from '../controllers/authControllers.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), register);
authRouter.post('/login', validateBody(loginSchema), login);
authRouter.post('/logout', logout);
authRouter.post('/refresh', refreshToken);

// відправити лист для скидання паролю
authRouter.post('/send-reset-email', validateBody(resetEmailSchema), sendResetEmail);

// зміна пароля по токену
authRouter.post('/reset-pwd', validateBody(resetPwdSchema), resetPwd);

authRouter.patch('/avatar', upload.single('avatar'), updateAvatar);

export default authRouter;
