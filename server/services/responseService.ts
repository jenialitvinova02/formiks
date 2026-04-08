import Answer from '../models/Answer';
import sequelize from '../db';
import ResponseModel from '../models/Response';
import Template from '../models/Template';
import { realtimeAnalyticsService } from './realtimeAnalyticsService';

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

export async function createResponseFromAnswers(
  userId: number,
  templateId: number,
  answers: Record<string, string | boolean>,
) {
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

export async function listResponsesForTemplate(templateId: number) {
  return ResponseModel.findAll({
    where: { templateId },
    include: [{ model: Answer, as: 'answers' }],
  });
}
