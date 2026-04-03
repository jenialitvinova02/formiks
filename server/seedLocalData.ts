import bcrypt from 'bcrypt';
import User from './models/User';
import Template from './models/Template';
import Question from './models/Question';
import ResponseModel from './models/Response';
import Answer from './models/Answer';

const DEFAULT_PASSWORD = 'password123';

async function ensureUser({
  username,
  email,
  role,
}: {
  username: string;
  email: string;
  role: 'user' | 'admin';
}) {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return existing;
  }

  const password = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  return User.create({
    username,
    email,
    password,
    role,
  });
}

export async function seedLocalData() {
  const existingUsers = await User.count();
  const existingTemplates = await Template.count();

  if (existingUsers > 0 || existingTemplates > 0) {
    return;
  }

  const admin = await ensureUser({
    username: 'Local Admin',
    email: 'admin@local.test',
    role: 'admin',
  });
  const demoUser = await ensureUser({
    username: 'Demo User',
    email: 'demo@local.test',
    role: 'user',
  });

  const template = await Template.create({
    title: 'Local Feedback Form',
    description: 'Demo template for local development and manual testing.',
    topic: 'feedback',
    tags: 'demo,local,feedback',
    isPublic: true,
    userId: demoUser.id,
  });

  const questions = await Question.bulkCreate([
    {
      title: 'Your name',
      description: 'Short text field',
      type: 'text',
      order: 1,
      showInTable: true,
      templateId: template.id,
    },
    {
      title: 'How satisfied are you from 1 to 10?',
      description: 'Numeric field',
      type: 'number',
      order: 2,
      showInTable: true,
      templateId: template.id,
    },
    {
      title: 'Would you recommend this app?',
      description: 'Checkbox field',
      type: 'checkbox',
      order: 3,
      showInTable: true,
      templateId: template.id,
    },
  ]);

  const response = await ResponseModel.create({
    templateId: template.id,
    userId: admin.id,
  });

  await Answer.bulkCreate([
    {
      responseId: response.id,
      questionId: questions[0].id,
      value: 'Local Admin',
    },
    {
      responseId: response.id,
      questionId: questions[1].id,
      value: '9',
    },
    {
      responseId: response.id,
      questionId: questions[2].id,
      value: 'true',
    },
  ]);

  console.log('Local demo data created.');
  console.log('Admin login: admin@local.test / password123');
  console.log('User login: demo@local.test / password123');
}
