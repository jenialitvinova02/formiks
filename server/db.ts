import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
dotenv.config();

const mysqlUri = process.env.DB_URI?.trim();
const useSqlite = process.env.DB_DIALECT === 'sqlite' || !mysqlUri;

const sqliteStorage =
  process.env.SQLITE_STORAGE ||
  path.resolve(__dirname, 'data', 'formics.sqlite');

if (useSqlite) {
  fs.mkdirSync(path.dirname(sqliteStorage), { recursive: true });
}

const sequelize = useSqlite
  ? new Sequelize({
      dialect: 'sqlite',
      storage: sqliteStorage,
      define: {
        underscored: true,
        timestamps: true,
      },
      logging: false,
    })
  : new Sequelize(mysqlUri!, {
      dialect: 'mysql',
      define: {
        underscored: true,
        timestamps: true,
      },
      logging: (sql) => logger.debug({ sql }, 'sequelize query'),
    });

sequelize
  .authenticate()
  .then(() => {
    const mode = useSqlite ? `sqlite (${sqliteStorage})` : 'mysql';
    logger.info(`Database connection has been established successfully: ${mode}`);
  })
  .catch((error) => {
    logger.error({ err: error }, 'Unable to connect to the database');
  });

export const databaseMode = useSqlite ? 'sqlite' : 'mysql';
export const databaseLocation = useSqlite ? sqliteStorage : mysqlUri!;

export default sequelize;
