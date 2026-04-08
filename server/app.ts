import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { logger } from './utils/logger';
import './models/User';
import './models/Template';
import './models/Question';
import './models/Response';
import './models/Answer';
import initAssociations from './models/associations';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import templateRoutes from './routes/templates';
import questionRoutes from './routes/questions';
import responseRoutes from './routes/responses';
import answerRoutes from './routes/answers';
import publicTemplates from './routes/publicTemplates';
import analyticsRoutes from './routes/analytics';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

initAssociations();

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(
    pinoHttp({
      logger,
      serializers: {
        req(req) {
          return {
            method: req.method,
            url: req.url.split('?')[0],
          };
        },
      },
    }),
  );

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/public/templates', publicTemplates);
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/templates', templateRoutes);
  app.use('/api/questions', questionRoutes);
  app.use('/api/responses', responseRoutes);
  app.use('/api/answers', answerRoutes);
  app.use('/api/analytics', analyticsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
