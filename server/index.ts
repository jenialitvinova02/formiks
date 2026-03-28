import express from 'express';
import cors from 'cors';
import sequelize from './db';

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

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

initAssociations();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/answers', answerRoutes);

sequelize.sync().then(() => {
  console.log('DB connected');
  app.listen(process.env.PORT || 3000, () => console.log('Server running'));
});