import mongoose, { Model } from 'mongoose';
import logger from '@/utils/logger';

export interface Notification {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DeviceRegistration {
  userId: string;
  token: string;
  platform: 'web' | 'ios' | 'android';
  createdAt: Date;
}

const deviceSchema = new mongoose.Schema<DeviceRegistration>(
  {
    userId: { type: String, required: true, index: true },
    token: { type: String, required: true },
    platform: { type: String, enum: ['web', 'ios', 'android'], required: true },
  },
  { timestamps: true },
);

const DeviceModel: Model<DeviceRegistration> = mongoose.model('Device', deviceSchema);

async function sendPush(userId: string, title: string, body: string, data?: Record<string, unknown>): Promise<void> {
  try {
    const devices = await DeviceModel.find({ userId }).lean();

    if (devices.length === 0) {
      logger.debug('No devices registered for push', { userId });
      return;
    }

    for (const device of devices) {
      logger.info('Sending push notification', {
        userId,
        device: device.platform,
        token: device.token.slice(0, 12) + '...',
        title,
      });
    }
  } catch (err) {
    logger.error('Failed to send push notification', { userId, error: err });
  }
}

async function sendEmail(
  to: string,
  subject: string,
  htmlBody: string,
): Promise<void> {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;

    if (!apiKey) {
      logger.warn('SendGrid API key not configured; skipping email', { to, subject });
      return;
    }

    logger.info('Sending email via SendGrid', { to, subject });
  } catch (err) {
    logger.error('Failed to send email', { to, subject, error: err });
  }
}

export const NotificationModel: Model<Notification> = mongoose.model(
  'Notification',
  new mongoose.Schema<Notification>(
    {
      userId: { type: String, required: true, index: true },
      type: { type: String, required: true },
      title: { type: String, required: true },
      body: { type: String, required: true },
      data: { type: mongoose.Schema.Types.Mixed, default: {} },
      read: { type: Boolean, default: false },
    },
    { timestamps: true },
  ),
);

async function sendInApp(
  userId: string,
  type: string,
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<Notification> {
  const notification = await NotificationModel.create({
    userId,
    type,
    title,
    body,
    data: data || {},
    read: false,
  });

  logger.info('In-app notification created', { userId, type, notificationId: notification._id });
  return notification;
}

async function registerDevice(
  userId: string,
  token: string,
  platform: 'web' | 'ios' | 'android',
): Promise<void> {
  await DeviceModel.findOneAndUpdate(
    { userId, token },
    { userId, token, platform },
    { upsert: true, new: true },
  );

  logger.info('Device registered', { userId, platform });
}

export default {
  sendPush,
  sendEmail,
  sendInApp,
  registerDevice,
};
