import Redis from 'ioredis';
import logger from '@/utils/logger';

class RedisService {
  private client: Redis | null = null;
  private subscriber: Redis | null = null;
  private isConnected = false;

  async connect(url: string): Promise<void> {
    this.client = new Redis(url, {
      retryStrategy: (times) => Math.min(times * 100, 3000),
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.subscriber = new Redis(url, {
      retryStrategy: (times) => Math.min(times * 100, 3000),
      lazyConnect: true,
    });

    await Promise.all([this.client.connect(), this.subscriber.connect()]);
    this.isConnected = true;

    this.client.on('error', (err) => {
      logger.error('Redis client error', { error: err.message });
    });

    this.subscriber.on('error', (err) => {
      logger.error('Redis subscriber error', { error: err.message });
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;

    try {
      const value = await this.client.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (err) {
      logger.error('Redis get error', { key, error: err });
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    if (!this.client) return;

    try {
      const serialized = JSON.stringify(value);

      if (ttlSeconds) {
        await this.client.setex(key, ttlSeconds, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (err) {
      logger.error('Redis set error', { key, error: err });
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client) return;

    try {
      await this.client.del(key);
    } catch (err) {
      logger.error('Redis del error', { key, error: err });
    }
  }

  async expire(key: string, seconds: number): Promise<void> {
    if (!this.client) return;

    try {
      await this.client.expire(key, seconds);
    } catch (err) {
      logger.error('Redis expire error', { key, error: err });
    }
  }

  async ttl(key: string): Promise<number> {
    if (!this.client) return -2;
    return this.client.ttl(key);
  }

  async incr(key: string): Promise<number> {
    if (!this.client) return 0;
    return this.client.incr(key);
  }

  async setSession(userId: string, data: Record<string, unknown>, ttlSeconds: number = 3600): Promise<void> {
    await this.set(`session:${userId}`, data, ttlSeconds);
  }

  async getSession(userId: string): Promise<Record<string, unknown> | null> {
    return this.get<Record<string, unknown>>(`session:${userId}`);
  }

  async destroySession(userId: string): Promise<void> {
    await this.del(`session:${userId}`);
  }

  async checkRateLimit(key: string, maxRequests: number, windowSeconds: number): Promise<boolean> {
    const redisKey = `ratelimit:${key}`;
    const current = await this.incr(redisKey);

    if (current === 1) {
      await this.expire(redisKey, windowSeconds);
    }

    return current <= maxRequests;
  }

  async getRateLimitRemaining(key: string, maxRequests: number): Promise<number> {
    const redisKey = `ratelimit:${key}`;
    const current = await this.client?.get(redisKey);
    const count = current ? parseInt(current, 10) : 0;
    return Math.max(0, maxRequests - count);
  }

  async publish(channel: string, message: unknown): Promise<void> {
    if (!this.client) return;

    try {
      await this.client.publish(channel, JSON.stringify(message));
    } catch (err) {
      logger.error('Redis publish error', { channel, error: err });
    }
  }

  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    if (!this.subscriber) return;

    try {
      await this.subscriber.subscribe(channel);
      this.subscriber.on('message', (ch: string, msg: string) => {
        if (ch === channel) {
          callback(msg);
        }
      });
    } catch (err) {
      logger.error('Redis subscribe error', { channel, error: err });
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;

    if (this.subscriber) {
      await this.subscriber.quit();
      this.subscriber = null;
    }

    if (this.client) {
      await this.client.quit();
      this.client = null;
    }

    logger.info('Redis disconnected');
  }
}

export default new RedisService();
