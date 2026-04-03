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
import publicTemplates from './routes/publicTemplates';

import dotenv from 'dotenv';
import { databaseMode, databaseLocation } from './db';
import { seedLocalData } from './seedLocalData';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

initAssociations();

app.use('/api/public/templates', publicTemplates);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/answers', answerRoutes);

async function start() {
  try {
    await sequelize.sync();

    if (databaseMode === 'sqlite') {
      await seedLocalData();
    }

    const port = Number(process.env.PORT || 3000);
    console.log(`DB connected via ${databaseMode}: ${databaseLocation}`);
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
