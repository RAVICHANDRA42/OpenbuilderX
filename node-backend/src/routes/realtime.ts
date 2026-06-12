import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { authenticate, optionalAuth } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { AppError, NotFoundError } from '@/middleware/error-handler';
import redisService from '@/services/redis-service';
import logger from '@/utils/logger';

const router = Router();

const ROOM_TTL = 86400;

const createRoomSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(['chat', 'code', 'builder']).optional().default('chat'),
});

router.get('/status', (_req: Request, res: Response) => {
  res.json({
    connected: true,
    transports: ['websocket', 'polling'],
    rooms: 0,
    clients: 0,
  });
});

router.post(
  '/rooms',
  authenticate,
  validate({ body: createRoomSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, type } = req.body;
      const roomId = uuidv4();
      const room = {
        id: roomId,
        name,
        type,
        createdBy: req.user!.userId,
        createdAt: new Date().toISOString(),
        members: [req.user!.userId],
      };

      await redisService.set(`room:${roomId}`, room, ROOM_TTL);

      logger.info('Room created', { roomId, name, type, userId: req.user!.userId });
      res.status(201).json(room);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/rooms/:id',
  optionalAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const room = await redisService.get<RoomData>(`room:${req.params.id}`);

      if (!room) {
        throw new NotFoundError('Room');
      }

      res.json(room);
    } catch (err) {
      next(err);
    }
  },
);

interface RoomData {
  id: string;
  name: string;
  type: string;
  createdBy: string;
  createdAt: string;
  members: string[];
}

export default router;
