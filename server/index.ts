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
    await sequelize.sync();

    if (databaseMode === 'sqlite') {
      await seedLocalData();
    }

    const port = Number(process.env.PORT || 3000);
    logger.info(`DB connected via ${databaseMode}: ${databaseLocation}`);
    app.listen(port, () => logger.info(`Server is running on port ${port}`));
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
}

start();
