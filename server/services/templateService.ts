import Question from '../models/Question';
import Template from '../models/Template';

interface TemplateQuestionPayload {
  title: string;
  description?: string;
  type: string;
  order?: number;
  showInTable?: boolean;
}

export async function listTemplatesForUser(user: { id: number; role: string }) {
  const where = user.role === 'admin' ? {} : { userId: user.id };
  return Template.findAll({
    where,
    include: [{ model: Question, as: 'questions' }],
  });
}

export async function getTemplateWithQuestions(templateId: number) {
  return Template.findByPk(templateId, {
    include: [{ model: Question, as: 'questions' }],
  });
}

export async function createTemplateWithQuestions(
  userId: number,
  payload: {
    title: string;
    description: string;
    topic: string;
    image?: string;
    tags?: string;
    isPublic?: boolean;
    questions?: TemplateQuestionPayload[];
  },
) {
  const template = await Template.create({
    title: payload.title,
    description: payload.description,
    topic: payload.topic,
    image: payload.image,
    tags: payload.tags,
    isPublic: payload.isPublic ?? false,
    userId,
  });

  if (Array.isArray(payload.questions)) {
    await Promise.all(
      payload.questions.map((question, index) =>
        Question.create({
          title: question.title,
          description: question.description ?? '',
          type: question.type,
          order: Number(question.order ?? index),
          showInTable: question.showInTable ?? true,
          templateId: template.id,
        }),
      ),
    );
  }

  return getTemplateWithQuestions(template.id);
}

export async function updateTemplateWithQuestions(
  template: Template,
  payload: {
    title: string;
    description: string;
    topic: string;
    image?: string;
    tags?: string;
    isPublic?: boolean;
    questions?: TemplateQuestionPayload[];
  },
) {
  await template.update({
    title: payload.title,
    description: payload.description,
    topic: payload.topic,
    image: payload.image,
    tags: payload.tags,
    isPublic: payload.isPublic ?? false,
  });

  await Question.destroy({ where: { templateId: template.id } });
  if (Array.isArray(payload.questions)) {
    await Promise.all(
      payload.questions.map((question, index) =>
        Question.create({
          title: question.title,
          description: question.description ?? '',
          type: question.type,
          order: Number(question.order ?? index),
          showInTable: question.showInTable ?? true,
          templateId: template.id,
        }),
      ),
    );
  }

  return getTemplateWithQuestions(template.id);
}
