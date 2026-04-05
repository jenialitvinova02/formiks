import User from '../models/User';
import Template from '../models/Template';
import ResponseModel from '../models/Response';
import Answer from '../models/Answer';
import Question from '../models/Question';
import sequelize from '../db';
import initAssociations from '../models/associations';
import { ROLE_ADMIN, ROLE_USER } from '../constants/roles';
import { AppError } from '../errors/AppError';
import { registerUser, loginUser } from '../services/authService';
import {
  requireAnswerAccess,
  requireResponseAccess,
  requireTemplateAccess,
} from '../services/accessService';
import { createResponseFromAnswers } from '../services/responseService';
import {
  getResponseWithAnswers,
  listResponsesForTemplate,
  listResponsesForUser,
} from '../services/responseService';
import {
  getProfile,
  listUsers,
  updateProfile,
  updateUserRole,
} from '../services/userService';
import { serializeUser } from '../utils/serializers';
import { signJwt, verifyJwt } from '../utils/jwt';
import { authenticateJWT } from '../middleware/authenticateJWT';
import {
  createTemplateWithQuestions,
  getTemplateWithQuestions,
  listTemplatesForUser,
  updateTemplateWithQuestions,
} from '../services/templateService';
import {
  createQuestion,
  listQuestionsForTemplate,
} from '../services/questionService';

describe('Backend business logic', () => {
  beforeAll(async () => {
    initAssociations();
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await sequelize.truncate({ cascade: true, restartIdentity: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('registers a user as regular user and hashes the password', async () => {
    const created = await registerUser({
      username: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
    });

    expect(created.role).toBe(ROLE_USER);
    expect((created as { password?: string }).password).toBeUndefined();

    const saved = await User.findOne({ where: { email: 'alice@example.com' } });
    expect(saved?.password).not.toBe('password123');
    expect(saved?.role).toBe(ROLE_USER);
  });

  it('rejects duplicate registration', async () => {
    await registerUser({
      username: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
    });

    await expect(
      registerUser({
        username: 'Alice 2',
        email: 'alice@example.com',
        password: 'password123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('logs in valid users and signs/verifies jwt', async () => {
    await registerUser({
      username: 'Bob',
      email: 'bob@example.com',
      password: 'password123',
    });

    const result = await loginUser({
      email: 'bob@example.com',
      password: 'password123',
    });

    expect(result.user.email).toBe('bob@example.com');
    const payload = verifyJwt(result.token) as { email: string };
    expect(payload.email).toBe('bob@example.com');
  });

  it('serializes user data without password', async () => {
    const user = await User.create({
      username: 'Charlie',
      email: 'charlie@example.com',
      password: 'hashed',
      role: ROLE_USER,
    });

    const serialized = serializeUser(user);
    expect(serialized.email).toBe('charlie@example.com');
    expect((serialized as { password?: string }).password).toBeUndefined();
  });

  it('exposes safe profile and safe admin user list', async () => {
    const user = await User.create({
      username: 'Dana',
      email: 'dana@example.com',
      password: 'hashed',
      role: ROLE_USER,
    });

    const profile = await getProfile(user.id);
    const users = await listUsers();

    expect(profile.email).toBe('dana@example.com');
    expect((profile as { password?: string }).password).toBeUndefined();
    expect((users[0] as { password?: string }).password).toBeUndefined();
  });

  it('updates profile fields', async () => {
    const user = await User.create({
      username: 'Profile User',
      email: 'profile@example.com',
      password: 'hashed',
      role: ROLE_USER,
    });

    const updated = await updateProfile(user.id, {
      username: 'Profile User Updated',
      email: 'profile-updated@example.com',
    });
    expect(updated.username).toBe('Profile User Updated');
    expect(updated.email).toBe('profile-updated@example.com');
  });

  it('updates user role with validated values', async () => {
    const user = await User.create({
      username: 'Eve',
      email: 'eve@example.com',
      password: 'hashed',
      role: ROLE_USER,
    });

    const updated = await updateUserRole(user.id, ROLE_ADMIN);
    expect(updated.role).toBe(ROLE_ADMIN);
  });

  it('allows public template access but blocks private template access for strangers', async () => {
    const owner = await User.create({
      username: 'Owner',
      email: 'owner@example.com',
      password: 'hashed',
      role: ROLE_USER,
    });
    const stranger = await User.create({
      username: 'Stranger',
      email: 'stranger@example.com',
      password: 'hashed',
      role: ROLE_USER,
    });

    const publicTemplate = await Template.create({
      title: 'Public',
      description: 'Desc',
      topic: 'topic',
      isPublic: true,
      userId: owner.id,
    });
    const privateTemplate = await Template.create({
      title: 'Private',
      description: 'Desc',
      topic: 'topic',
      isPublic: false,
      userId: owner.id,
    });

    await expect(
      requireTemplateAccess(
        { user: { id: stranger.id, email: stranger.email, role: stranger.role } } as any,
        publicTemplate.id,
        { allowPublic: true },
      ),
    ).resolves.toBeTruthy();

    await expect(
      requireTemplateAccess(
        { user: { id: stranger.id, email: stranger.email, role: stranger.role } } as any,
        privateTemplate.id,
      ),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('blocks answer and response access for non-owners', async () => {
    const owner = await User.create({
      username: 'Owner 2',
      email: 'owner2@example.com',
      password: 'hashed',
      role: ROLE_USER,
    });
    const stranger = await User.create({
      username: 'Stranger 2',
      email: 'stranger2@example.com',
      password: 'hashed',
      role: ROLE_USER,
    });
    const template = await Template.create({
      title: 'Template',
      description: 'Desc',
      topic: 'topic',
      isPublic: false,
      userId: owner.id,
    });
    const question = await Question.create({
      title: 'Q1',
      description: '',
      type: 'text',
      templateId: template.id,
      order: 0,
      showInTable: true,
    });
    const response = await ResponseModel.create({
      templateId: template.id,
      userId: owner.id,
    });
    const answer = await Answer.create({
      responseId: response.id,
      questionId: question.id,
      value: 'secret',
    });

    const req = {
      user: { id: stranger.id, email: stranger.email, role: stranger.role },
    } as any;

    await expect(requireResponseAccess(req, response.id)).rejects.toBeInstanceOf(
      AppError,
    );
    await expect(requireAnswerAccess(req, answer.id)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('creates response records from answers', async () => {
    const owner = await User.create({
      username: 'Owner 3',
      email: 'owner3@example.com',
      password: 'hashed',
      role: ROLE_USER,
    });
    const template = await Template.create({
      title: 'Template',
      description: 'Desc',
      topic: 'topic',
      isPublic: true,
      userId: owner.id,
    });
    const question = await Question.create({
      title: 'Q1',
      description: '',
      type: 'text',
      templateId: template.id,
      order: 0,
      showInTable: true,
    });

    const result = await createResponseFromAnswers(owner.id, template.id, {
      [question.id]: 'hello',
    });

    expect(result.response.templateId).toBe(template.id);
    expect(result.answers).toHaveLength(1);
    expect(result.answers[0].value).toBe('hello');
  });

  it('lists and loads response entities', async () => {
    const owner = await User.create({
      username: 'Owner 4',
      email: 'owner4@example.com',
      password: 'hashed',
      role: ROLE_USER,
    });
    const template = await Template.create({
      title: 'Template',
      description: 'Desc',
      topic: 'topic',
      isPublic: true,
      userId: owner.id,
    });
    const question = await Question.create({
      title: 'Q1',
      description: '',
      type: 'text',
      templateId: template.id,
      order: 0,
      showInTable: true,
    });
    const response = await ResponseModel.create({
      templateId: template.id,
      userId: owner.id,
    });
    await Answer.create({
      responseId: response.id,
      questionId: question.id,
      value: 'hello',
    });

    const userResponses = await listResponsesForUser(owner.id);
    const templateResponses = await listResponsesForTemplate(template.id);
    const loaded = await getResponseWithAnswers(response.id);

    expect(userResponses).toHaveLength(1);
    expect(templateResponses).toHaveLength(1);
    expect(loaded?.answers).toHaveLength(1);
  });

  it('creates, updates and lists templates with questions', async () => {
    const owner = await User.create({
      username: 'Template Owner',
      email: 'template-owner@example.com',
      password: 'hashed',
      role: ROLE_USER,
    });

    const template = await createTemplateWithQuestions(owner.id, {
      title: 'Customer Survey',
      description: 'Collect feedback',
      topic: 'feedback',
      isPublic: true,
      questions: [
        {
          title: 'Your name',
          description: 'Short text',
          type: 'text',
          order: 0,
          showInTable: true,
        },
      ],
    });

    expect(template?.questions).toHaveLength(1);

    const listed = await listTemplatesForUser({ id: owner.id, role: ROLE_USER });
    expect(listed).toHaveLength(1);

    const loaded = await getTemplateWithQuestions(template!.id);
    expect(loaded?.questions).toHaveLength(1);

    const updated = await updateTemplateWithQuestions(loaded!, {
      title: 'Updated Survey',
      description: 'Updated feedback',
      topic: 'feedback',
      isPublic: false,
      questions: [
        {
          title: 'Rate us',
          description: '1 to 10',
          type: 'number',
          order: 0,
          showInTable: true,
        },
      ],
    });

    expect(updated?.title).toBe('Updated Survey');
    expect(updated?.questions?.[0].title).toBe('Rate us');
  });

  it('creates and lists questions for a template', async () => {
    const owner = await User.create({
      username: 'Question Owner',
      email: 'question-owner@example.com',
      password: 'hashed',
      role: ROLE_USER,
    });
    const template = await Template.create({
      title: 'Question Template',
      description: 'Desc',
      topic: 'topic',
      isPublic: false,
      userId: owner.id,
    });

    await createQuestion({
      templateId: template.id,
      title: 'Question A',
      description: 'Desc',
      type: 'text',
      order: 0,
      showInTable: true,
    });

    const questions = await listQuestionsForTemplate(template.id);
    expect(questions).toHaveLength(1);
    expect(questions[0].title).toBe('Question A');
  });

  it('authenticates jwt in middleware', () => {
    const token = signJwt({ id: 1, email: 'admin@example.com', role: ROLE_ADMIN });
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as any;
    const next = vi.fn();

    authenticateJWT(req, {} as any, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.email).toBe('admin@example.com');
  });
});
