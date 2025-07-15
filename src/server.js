import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

    // Абсолютний шлях до swagger.json (важливо для запуску з src)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const swaggerPath = path.join(__dirname, '../docs/swagger.json');
    const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));

    // Swagger UI має бути ДО роутів, які можуть його перекрити!
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.get('/', (req, res) => {
        res.json({ message: 'Hello World!' });
    });

    app.use('/contacts', contactsRouter);
    app.use('/auth', authRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
