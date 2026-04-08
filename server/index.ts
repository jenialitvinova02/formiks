import sequelize from './db';
import './models/User';
import './models/Template';
import './models/Question';
import './models/Response';
import './models/Answer';
import dotenv from 'dotenv';
import { databaseMode, databaseLocation } from './db';
import { seedLocalData } from './seedLocalData';
import { createApp } from './app';
import { logger } from './utils/logger';
dotenv.config();

const app = createApp();

async function start() {
  try {
    if (databaseMode === 'sqlite') {
      await sequelize.sync();
      await seedLocalData();
    }

    const port = Number(process.env.PORT || 3000);
    logger.info(`DB connected via ${databaseMode}: ${databaseLocation}`);
    const server = app.listen(port, () => logger.info(`Server is running on port ${port}`));

    const shutdown = (signal: string) => {
      logger.info({ signal }, 'Shutting down server');
      server.close(async () => {
        await sequelize.close();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
}

start();
