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
type SubmittedAnswerValue = string | boolean | string[];

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
  answers: Record<string, SubmittedAnswerValue>,
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

function normalizeAnswerValue(value: SubmittedAnswerValue) {
  if (Array.isArray(value)) {
    return JSON.stringify(value.map((item) => String(item).trim()).filter(Boolean));
  }

  return String(value);
}

function parseStoredAnswer(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item));
    }
  } catch {
    return value;
  }

  return value;
}

function normalizeForComparison(value: string | string[]) {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim().toLowerCase()).sort().join('|');
  }

  return value.trim().toLowerCase();
}

function isCorrectAnswer(answerValue: string, correctAnswer: string | null) {
  if (!correctAnswer) {
    return null;
  }

  return (
    normalizeForComparison(parseStoredAnswer(answerValue)) ===
    normalizeForComparison(parseStoredAnswer(correctAnswer))
  );
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
  answers: Record<string, SubmittedAnswerValue>,
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
            value: normalizeAnswerValue(value),
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
  answers: Record<string, SubmittedAnswerValue>,
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

export async function getResponseAnalyticsForTemplate(templateId: number) {
  const template = await Template.findByPk(templateId, {
    include: [{ model: Question, as: 'questions' }],
  });

  if (!template) {
    throw new AppError(404, 'Template not found');
  }

  const responses = await ResponseModel.findAll({
    where: { templateId },
    include: [{ model: Answer, as: 'answers', include: ['question'] }],
  });

  const questions = ((template as any).questions || []) as Question[];
  const questionStats = questions.map((question) => {
    const values = responses
      .flatMap((response) => ((response as any).answers || []) as Answer[])
      .filter((answer) => answer.questionId === question.id)
      .map((answer) => answer.value);

    const optionCounts = new Map<string, number>();
    values.forEach((value) => {
      const parsed = parseStoredAnswer(value);
      const selected = Array.isArray(parsed) ? parsed : [String(parsed)];
      selected.forEach((option) => {
        optionCounts.set(option, (optionCounts.get(option) || 0) + 1);
      });
    });

    const graded = values
      .map((value) => isCorrectAnswer(value, question.correctAnswer))
      .filter((result): result is boolean => result !== null);

    return {
      questionId: question.id,
      title: question.title,
      type: question.type,
      totalAnswers: values.length,
      optionCounts: Array.from(optionCounts.entries()).map(([option, count]) => ({
        option,
        count,
      })),
      correctAnswer: question.correctAnswer,
      correctCount: graded.filter(Boolean).length,
      incorrectCount: graded.filter((result) => !result).length,
      accuracy:
        graded.length > 0
          ? Math.round((graded.filter(Boolean).length / graded.length) * 100)
          : null,
    };
  });

  const gradedTotals = questionStats.reduce(
    (acc, question) => ({
      correct: acc.correct + question.correctCount,
      incorrect: acc.incorrect + question.incorrectCount,
    }),
    { correct: 0, incorrect: 0 },
  );

  return {
    templateId,
    totalResponses: responses.length,
    totalAnswers: questionStats.reduce((sum, question) => sum + question.totalAnswers, 0),
    correctCount: gradedTotals.correct,
    incorrectCount: gradedTotals.incorrect,
    questions: questionStats,
  };
}
