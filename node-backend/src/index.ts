import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';

import { errorHandler } from '@/middleware/error-handler';
import realtimeRoutes from '@/routes/realtime';
import webhookRoutes from '@/routes/webhooks';
import notificationRoutes from '@/routes/notifications';
import { initializeSocketService } from '@/services/socket-service';
import redisService from '@/services/redis-service';
import logger from '@/utils/logger';

dotenv.config();

const PORT = parseInt(process.env.PORT || '4000', 10);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/openbuilder';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: { write: (msg: string) => logger.info(msg.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.use('/api/realtime', realtimeRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

const io = new SocketIOServer(httpServer, {
  cors: { origin: CORS_ORIGIN, credentials: true },
  pingInterval: 10000,
  pingTimeout: 5000,
});

initializeSocketService(io);

async function start(): Promise<void> {
  try {
    await redisService.connect(REDIS_URL);
    logger.info('Redis connected');

    await mongoose.connect(MONGODB_URI);
    logger.info('MongoDB connected');

    httpServer.listen(PORT, () => {
      logger.info(`Node backend listening on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

export { app, httpServer, io };
