import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

import logger from '@/utils/logger';

const router = Router();

function verifyStripeSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const parts = signature.split(',');
    const timestampPart = parts.find((p) => p.startsWith('t='));
    const signaturePart = parts.find((p) => p.startsWith('v1='));

    if (!timestampPart || !signaturePart) return false;

    const timestamp = timestampPart.slice(2);
    const sig = signaturePart.slice(3);

    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${payload}`)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

router.post('/stripe', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';

    if (!sig || !verifyStripeSignature(JSON.stringify(req.body), sig, secret)) {
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    const event = req.body;

    logger.info('Stripe webhook received', { type: event.type });

    switch (event.type) {
      case 'payment_intent.succeeded':
        logger.info('Payment succeeded', { id: event.data.object.id });
        break;
      case 'payment_intent.payment_failed':
        logger.warn('Payment failed', { id: event.data.object.id });
        break;
      case 'customer.subscription.updated':
        logger.info('Subscription updated', { id: event.data.object.id });
        break;
      default:
        logger.debug('Unhandled Stripe event', { type: event.type });
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
});

router.post('/sendgrid', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = Array.isArray(req.body) ? req.body : [req.body];

    for (const event of events) {
      logger.info('SendGrid event', {
        event: event.event,
        email: event.email,
        category: event.category,
        timestamp: event.timestamp,
      });
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
});

router.post('/generic', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const webhook = {
      id: crypto.randomUUID(),
      source: req.headers['x-webhook-source'] || 'unknown',
      event: req.headers['x-event-type'] || 'generic',
      receivedAt: new Date().toISOString(),
      payload: req.body,
    };

    logger.info('Generic webhook received', {
      source: webhook.source,
      event: webhook.event,
      id: webhook.id,
    });

    res.status(201).json({ id: webhook.id, received: true });
  } catch (err) {
    next(err);
  }
});

export default router;
