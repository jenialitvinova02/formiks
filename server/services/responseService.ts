import Answer from '../models/Answer';
import ResponseModel from '../models/Response';

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
  const response = await ResponseModel.create({
    templateId,
    userId,
  });

  const createdAnswers = await Promise.all(
    Object.entries(answers).map(([questionId, value]) =>
      Answer.create({
        responseId: response.id,
        questionId: Number(questionId),
        value: String(value),
      }),
    ),
  );

  return {
    response,
    answers: createdAnswers,
  };
}

export async function listResponsesForTemplate(templateId: number) {
  return ResponseModel.findAll({
    where: { templateId },
    include: [{ model: Answer, as: 'answers' }],
  });
}
