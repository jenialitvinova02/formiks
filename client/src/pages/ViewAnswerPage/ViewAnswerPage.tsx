import React from 'react';
import { useParams } from 'react-router-dom';
import { useTemplate, useAnswersForResponse } from '../../hooks';
import { useTranslation } from 'react-i18next';
import { InlineAlert, LoadingSkeleton } from '../../components';
import './ViewAnswerPage.scss';

export const ViewAnswerPage: React.FC = () => {
  const { t } = useTranslation();
  const { templateId, answerId } = useParams<{
    templateId: string;
    answerId?: string;
  }>();

  const { data: tpl, loading: l1, error: e1 } = useTemplate(templateId!);
  const {
    data: answers,
    loading: l2,
    error: e2,
  } = useAnswersForResponse(answerId || '');

  if (!answerId) {
    return (
      <InlineAlert title="Missing answer id" message={t('viewAnswer.noAnswerId')} />
    );
  }

  if (l1 || l2) {
    return (
      <div className="ViewAnswerPage">
        <div className="ViewAnswerPage__container">
          <LoadingSkeleton rows={4} />
        </div>
      </div>
    );
  }
  if (e1)
    return (
      <InlineAlert
        title="Template error"
        message={t('viewAnswer.errorTemplate', { error: e1 })}
      />
    );
  if (e2)
    return (
      <InlineAlert
        title="Answer error"
        message={t('viewAnswer.errorAnswers', { error: e2 })}
      />
    );
  if (!tpl || answers.length === 0)
    return <InlineAlert title="No answers" message={t('viewAnswer.noAnswers')} />;

  return (
    <div className="ViewAnswerPage">
      <div className="ViewAnswerPage__container">
        <div className="page-title">
          <h1>{tpl.title}</h1>
          <p>{tpl.description}</p>
          <h2>
            {t('viewAnswer.response')} #{answerId}
          </h2>
        </div>
        {answers.map((answer) => (
          <div key={answer.id} className="ViewAnswerPage__item">
            {answer.question && (
              <>
                <strong>{t('viewAnswer.question')}: </strong>
                {answer.question.title}
                <br />
                <em>{t('viewAnswer.type')}: </em> {answer.question.type}
                <br />
              </>
            )}
            <p>
              <strong>{t('viewAnswer.answer')}: </strong> {answer.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAnswerPage;
