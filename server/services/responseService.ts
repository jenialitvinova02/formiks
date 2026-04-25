import Answer from '../models/Answer';
import sequelize from '../db';
import ResponseModel from '../models/Response';
import Template from '../models/Template';
import Question from '../models/Question';
import User from '../models/User';
import { realtimeAnalyticsService } from './realtimeAnalyticsService';
import { AppError } from '../errors/AppError';
import { ROLE_USER } from '../constants/roles';

const GUEST_USER_EMAIL = 'guest@local.test';

export async function listResponsesForUser(userId: number) {
  return ResponseModel.findAll({
    where: { userId },
    include: ['template'],
  });
}

export async function listAllResponses() {
  return ResponseModel.findAll({
    include: ['template', 'user'],
  });
}

export async function getResponseWithAnswers(responseId: number) {
  return ResponseModel.findByPk(responseId, {
    include: [{ model: Answer, as: 'answers', include: ['question'] }, 'template'],
  });
}

async function ensureAnswerQuestionsBelongToTemplate(
  templateId: number,
  answers: Record<string, string | boolean>,
) {
  const questionIds = Object.keys(answers).map(Number);
  if (!questionIds.length) {
    throw new AppError(400, 'At least one answer is required');
  }

  const count = await Question.count({
    where: {
      id: questionIds,
      templateId,
    },
  });

  if (count !== questionIds.length) {
    throw new AppError(400, 'Answers contain questions outside of the selected template');
  }
}

async function getOrCreateGuestUser() {
  const existing = await User.findOne({ where: { email: GUEST_USER_EMAIL } });
  if (existing) {
    return existing;
  }

  return User.create({
    username: 'Guest User',
    email: GUEST_USER_EMAIL,
    // This account is a technical owner for anonymous responses and is not exposed for login.
    password: '$2b$10$k3W6H2NfhY8kxjdva0VUceVCO00gwq7zrVOtl8xYfQ2zA0ccR2Swq',
    role: ROLE_USER,
  });
}

export async function createResponseFromAnswers(
  userId: number,
  templateId: number,
  answers: Record<string, string | boolean>,
) {
  await ensureAnswerQuestionsBelongToTemplate(templateId, answers);

  const created = await sequelize.transaction(async (transaction) => {
    const response = await ResponseModel.create(
      {
        templateId,
        userId,
      },
      { transaction },
    );

    const createdAnswers = await Promise.all(
      Object.entries(answers).map(([questionId, value]) =>
        Answer.create(
          {
            responseId: response.id,
            questionId: Number(questionId),
            value: String(value),
          },
          { transaction },
        ),
      ),
    );

    return {
      response,
      answers: createdAnswers,
    };
  });

  const template = await Template.findByPk(templateId);
  realtimeAnalyticsService.recordEvent({
    type: 'response_submitted',
    userId,
    templateId,
    templateTitle: template?.title,
    answersCount: Object.keys(answers).length,
  });

  return created;
}

export async function createPublicResponseFromAnswers(
  templateId: number,
  answers: Record<string, string | boolean>,
) {
  const template = await Template.findByPk(templateId);
  if (!template || !template.isPublic) {
    throw new AppError(404, 'Public template not found');
  }

  const guestUser = await getOrCreateGuestUser();
  return createResponseFromAnswers(guestUser.id, templateId, answers);
}

export async function listResponsesForTemplate(templateId: number) {
  return ResponseModel.findAll({
    where: { templateId },
    include: [{ model: Answer, as: 'answers' }],
  });
}
