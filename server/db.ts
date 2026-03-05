import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('Formics', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;