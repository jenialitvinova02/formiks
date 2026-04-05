import Answer from '../models/Answer';
import ResponseModel from '../models/Response';
import Template from '../models/Template';
import { ROLE_ADMIN } from '../constants/roles';
import { AppError } from '../errors/AppError';
import { AuthRequest } from '../middleware/authenticateJWT';

export async function requireTemplateAccess(
  req: AuthRequest,
  templateId: number,
  options: { allowPublic?: boolean } = {},
) {
  const template = await Template.findByPk(templateId);
  if (!template) {
    throw new AppError(404, 'Template not found');
  }

  const canAccess =
    req.user?.role === ROLE_ADMIN ||
    template.userId === req.user?.id ||
    (options.allowPublic && template.isPublic);

  if (!canAccess) {
    throw new AppError(403, 'Access denied');
  }

  return template;
}

export async function requireResponseAccess(req: AuthRequest, responseId: number) {
  const response = await ResponseModel.findByPk(responseId);
  if (!response) {
    throw new AppError(404, 'Response not found');
  }

  if (req.user?.role !== ROLE_ADMIN && response.userId !== req.user?.id) {
    throw new AppError(403, 'Access denied');
  }

  return response;
}

export async function requireAnswerAccess(req: AuthRequest, answerId: number) {
  const answer = await Answer.findByPk(answerId);
  if (!answer) {
    throw new AppError(404, 'Answer not found');
  }

  await requireResponseAccess(req, answer.responseId);
  return answer;
}
