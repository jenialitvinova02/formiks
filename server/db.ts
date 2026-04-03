import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
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
      logging: console.log,
    });

sequelize
  .authenticate()
  .then(() => {
    const mode = useSqlite ? `sqlite (${sqliteStorage})` : 'mysql';
    console.log(`Database connection has been established successfully: ${mode}`);
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

export const databaseMode = useSqlite ? 'sqlite' : 'mysql';
export const databaseLocation = useSqlite ? sqliteStorage : mysqlUri!;

export default sequelize;
