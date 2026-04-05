import Question from '../models/Question';

export async function listQuestionsForTemplate(templateId: number) {
  return Question.findAll({
    where: { templateId },
    order: [['order', 'ASC'], ['id', 'ASC']],
  });
}

export async function createQuestion(payload: {
  templateId: number;
  title: string;
  description?: string;
  type: string;
  order?: number;
  showInTable?: boolean;
}) {
  return Question.create({
    templateId: payload.templateId,
    title: payload.title,
    description: payload.description ?? '',
    type: payload.type,
    order: payload.order ?? 0,
    showInTable: payload.showInTable ?? true,
  });
}
