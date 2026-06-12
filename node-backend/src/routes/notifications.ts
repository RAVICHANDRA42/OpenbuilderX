import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { NotFoundError } from '@/middleware/error-handler';
import notificationService, { NotificationModel } from '@/services/notification-service';

const router = Router();

const paginationSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

const registerDeviceSchema = z.object({
  token: z.string().min(1),
  platform: z.enum(['web', 'ios', 'android']),
});

router.get(
  '/',
  authenticate,
  validate({ query: paginationSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query as unknown as { page: number; limit: number };
      const skip = (page - 1) * limit;

      const [notifications, total] = await Promise.all([
        NotificationModel.find({ userId: req.user!.userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        NotificationModel.countDocuments({ userId: req.user!.userId }),
      ]);

      res.json({
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  '/:id/read',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModel.findOneAndUpdate(
        { _id: req.params.id, userId: req.user!.userId },
        { read: true },
        { new: true },
      );

      if (!notification) {
        throw new NotFoundError('Notification');
      }

      res.json(notification);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  '/register-device',
  authenticate,
  validate({ body: registerDeviceSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, platform } = req.body;

      await notificationService.registerDevice(req.user!.userId, token, platform);

      res.json({ registered: true });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
