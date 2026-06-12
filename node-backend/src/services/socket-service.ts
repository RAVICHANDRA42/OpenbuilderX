import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

import redisService from '@/services/redis-service';
import logger from '@/utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  email?: string;
  role?: string;
}

interface ChatMessagePayload {
  roomId: string;
  content: string;
  attachments?: string[];
}

interface CodeChangePayload {
  roomId: string;
  filePath: string;
  content: string;
  version: number;
}

interface BuilderUpdatePayload {
  roomId: string;
  componentId: string;
  patch: Record<string, unknown>;
}

interface TypingIndicatorPayload {
  roomId: string;
  isTyping: boolean;
}

let io: SocketIOServer;

export function initializeSocketService(server: SocketIOServer): void {
  io = server;

  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
      next(new Error('Authentication required'));
      return;
    }

    try {
      const decoded = jwt.verify(token as string, JWT_SECRET) as {
        userId: string;
        email: string;
        role: string;
      };
      socket.userId = decoded.userId;
      socket.email = decoded.email;
      socket.role = decoded.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info('Socket connected', {
      userId: socket.userId,
      socketId: socket.id,
    });

    socket.on('room:join', async (roomId: string) => {
      await socket.join(roomId);
      const room = io.sockets.adapter.rooms.get(roomId);
      const count = room?.size ?? 0;

      io.to(roomId).emit('room:joined', {
        userId: socket.userId,
        socketId: socket.id,
        members: count,
      });

      logger.info('Socket joined room', {
        userId: socket.userId,
        roomId,
        members: count,
      });
    });

    socket.on('room:leave', async (roomId: string) => {
      await socket.leave(roomId);
      const room = io.sockets.adapter.rooms.get(roomId);

      io.to(roomId).emit('room:left', {
        userId: socket.userId,
        socketId: socket.id,
        members: room?.size ?? 0,
      });
    });

    socket.on('chat:message', async (payload: ChatMessagePayload) => {
      const message = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        userId: socket.userId,
        email: socket.email,
        content: payload.content,
        attachments: payload.attachments || [],
        timestamp: new Date().toISOString(),
      };

      io.to(payload.roomId).emit('chat:message', message);

      await redisService.publish(`room:${payload.roomId}`, {
        type: 'chat:message',
        data: message,
      });
    });

    socket.on('code:change', async (payload: CodeChangePayload) => {
      socket.to(payload.roomId).emit('code:change', {
        userId: socket.userId,
        filePath: payload.filePath,
        content: payload.content,
        version: payload.version,
        timestamp: new Date().toISOString(),
      });

      await redisService.set(
        `code:${payload.roomId}:${payload.filePath}`,
        { content: payload.content, version: payload.version },
        3600,
      );
    });

    socket.on('builder:update', async (payload: BuilderUpdatePayload) => {
      socket.to(payload.roomId).emit('builder:update', {
        userId: socket.userId,
        componentId: payload.componentId,
        patch: payload.patch,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('typing:indicator', (payload: TypingIndicatorPayload) => {
      socket.to(payload.roomId).emit('typing:indicator', {
        userId: socket.userId,
        email: socket.email,
        isTyping: payload.isTyping,
      });
    });

    socket.on('disconnect', () => {
      logger.info('Socket disconnected', {
        userId: socket.userId,
        socketId: socket.id,
      });
    });
  });
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
