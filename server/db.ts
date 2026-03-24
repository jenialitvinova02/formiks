import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();  // ← убедитесь, что в этой же папке лежит server/.env


// Используем переменную DB_URI из .env, чтобы задать user/password/host/db
const sequelize = new Sequelize(process.env.DB_URI!, {
  dialect: 'mysql',
  define: {
    underscored: true,   // создаёт/ищет колонки created_at/updated_at
    timestamps: true     // автоматически добавляет поля createdAt/updatedAt
  },
  logging: console.log,  // или false, если не нужен SQL‑лог
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

export default sequelize;