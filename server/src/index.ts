import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client';
import diocesesRouter from './routes/dioceses';
import parishesRouter from './routes/parishes';
import ministriesRouter from './routes/ministries';
import usersRouter from './routes/users';
import searchRouter from './routes/search';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(limiter);
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

// API Routes
app.use('/api/dioceses', diocesesRouter);
app.use('/api/parishes', parishesRouter);
app.use('/api/ministries', ministriesRouter);
app.use('/api/users', usersRouter);
app.use('/api/search', searchRouter);

// Root endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'Find My Ministry API',
        version: '1.0.0',
        endpoints: [
            '/api/dioceses',
            '/api/parishes',
            '/api/ministries',
            '/api/users',
            '/api/search',
        ],
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
    });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message,
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Received SIGINT. Gracefully shutting down...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Gracefully shutting down...');
    await prisma.$disconnect();
    process.exit(0);
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api`);
    console.log(`🏥 Health Check: http://localhost:${port}/health`);
});