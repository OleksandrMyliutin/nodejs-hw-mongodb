import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';


export const startServer = () => {
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(cors());
    app.use(express.json());
    app.use(
        pino({
        transport: {
            target: 'pino-pretty',
        },
        })
    );
    app.use(cookieParser());
    app.get('/', (req, res) => {
        res.json({ message: 'Hello World!' });
    });

    app.use('/contacts', contactsRouter);

    app.use('/auth', authRouter);

    // Middleware для неіснуючих маршрутів
    app.use(notFoundHandler);

    // Middleware обробки помилок
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};