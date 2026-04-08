import { Router } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/authenticateJWT';
import { realtimeAnalyticsService } from '../services/realtimeAnalyticsService';
import { verifyJwt } from '../utils/jwt';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';

const router = Router();

router.get('/realtime/snapshot', authenticateJWT, (_req, res) => {
  res.json(realtimeAnalyticsService.getSnapshot());
});

router.get('/realtime/stream', (req, res, next) => {
  const token = typeof req.query.token === 'string' ? req.query.token : '';
  if (!token) {
    next(new AppError(401, 'Token missing'));
    return;
  }

  try {
    const user = verifyJwt(token) as AuthRequest['user'];
    if (!user?.id) {
      throw new AppError(403, 'Invalid token');
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const writeSnapshot = () => {
      const snapshot = realtimeAnalyticsService.getSnapshot();
      res.write(`event: analytics:update\n`);
      res.write(`data: ${JSON.stringify(snapshot)}\n\n`);
    };

    writeSnapshot();

    const unsubscribe = realtimeAnalyticsService.subscribe((snapshot) => {
      res.write(`event: analytics:update\n`);
      res.write(`data: ${JSON.stringify(snapshot)}\n\n`);
    });

    const heartbeat = setInterval(() => {
      res.write(`: heartbeat ${Date.now()}\n\n`);
    }, 15000);

    req.on('close', () => {
      clearInterval(heartbeat);
      unsubscribe();
      res.end();
      logger.info({ userId: user.id }, 'Realtime analytics stream closed');
    });
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(403, 'Invalid token'));
  }
});

export default router;
