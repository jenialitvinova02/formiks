import express from 'express';
import sequelize from './db';
import userRoutes from './routes/users';
import templateRoutes from './routes/template';
import questionRoutes from './routes/questions';
import formRoutes from './routes/forms';
import answerRoutes from './routes/answers';
import authRoutes from './routes/auth'; 

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/auth', authRoutes);

sequelize.sync().then(() => {
    console.log('DB connected');
    app.listen(3000, () => console.log('Server running on port 3000'));
});