import sequelize from '../db';
import Question from '../models/Question';
import Template from '../models/Template';
import { realtimeAnalyticsService } from './realtimeAnalyticsService';

interface TemplateQuestionPayload {
  title: string;
  description?: string;
  type: string;
  options?: string[];
  correctAnswer?: string;
  order?: number;
  showInTable?: boolean;
}

function normalizeQuestionOptions(question: TemplateQuestionPayload) {
  if (!Array.isArray(question.options)) {
    return null;
  }

  const options = question.options
    .map((option) => String(option).trim())
    .filter(Boolean);

  return options.length ? options : null;
}

function normalizeCorrectAnswer(question: TemplateQuestionPayload) {
  const value = question.correctAnswer?.trim();
  if (!value) {
    return null;
  }

  if (question.type === 'multiple-choice') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return JSON.stringify(
          parsed.map((option) => String(option).trim()).filter(Boolean),
        );
      }
    } catch {
      // Comma-separated form input is normalized below.
    }

    return JSON.stringify(
      value
        .split(',')
        .map((option) => option.trim())
        .filter(Boolean),
    );
  }

  return value;
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

async function getTemplateWithQuestionsTx(templateId: number, transaction: any) {
  return Template.findByPk(templateId, {
    include: [{ model: Question, as: 'questions' }],
    transaction,
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
  const created = await sequelize.transaction(async (transaction) => {
    const template = await Template.create(
      {
        title: payload.title,
        description: payload.description,
        topic: payload.topic,
        image: payload.image,
        tags: payload.tags,
        isPublic: payload.isPublic ?? false,
        userId,
      },
      { transaction },
    );

    if (Array.isArray(payload.questions)) {
      await Promise.all(
        payload.questions.map((question, index) =>
          Question.create(
            {
              title: question.title,
              description: question.description ?? '',
              type: question.type,
              options: normalizeQuestionOptions(question),
              correctAnswer: normalizeCorrectAnswer(question),
              order: Number(question.order ?? index),
              showInTable: question.showInTable ?? true,
              templateId: template.id,
            },
            { transaction },
          ),
        ),
      );
    }

    return getTemplateWithQuestionsTx(template.id, transaction);
  });

  if (created) {
    realtimeAnalyticsService.recordEvent({
      type: 'template_created',
      userId,
      templateId: created.id,
      templateTitle: created.title,
    });
  }

  return created;
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
  const updated = await sequelize.transaction(async (transaction) => {
    await template.update(
      {
        title: payload.title,
        description: payload.description,
        topic: payload.topic,
        image: payload.image,
        tags: payload.tags,
        isPublic: payload.isPublic ?? false,
      },
      { transaction },
    );

    await Question.destroy({ where: { templateId: template.id }, transaction });
    if (Array.isArray(payload.questions)) {
      await Promise.all(
        payload.questions.map((question, index) =>
          Question.create(
            {
              title: question.title,
              description: question.description ?? '',
              type: question.type,
              options: normalizeQuestionOptions(question),
              correctAnswer: normalizeCorrectAnswer(question),
              order: Number(question.order ?? index),
              showInTable: question.showInTable ?? true,
              templateId: template.id,
            },
            { transaction },
          ),
        ),
      );
    }

    return getTemplateWithQuestionsTx(template.id, transaction);
  });

  if (updated) {
    realtimeAnalyticsService.recordEvent({
      type: 'template_updated',
      userId: updated.userId,
      templateId: updated.id,
      templateTitle: updated.title,
    });
  }

  return updated;
}

export async function updateTemplatePublicAccess(
  template: Template,
  isPublic: boolean,
) {
  await template.update({ isPublic });

  realtimeAnalyticsService.recordEvent({
    type: 'template_updated',
    userId: template.userId,
    templateId: template.id,
    templateTitle: template.title,
  });

  return template;
}
