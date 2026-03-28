import React from 'react';
import { useParams } from 'react-router-dom';
import { useTemplate } from '../../hooks/useTemplate';
import { useAnswersForResponse } from '../../hooks/useAnswersForResponse';
import { useTranslation } from 'react-i18next';

const ViewAnswerPage: React.FC = () => {
  const { t } = useTranslation();
  const { templateId, answerId } = useParams<{ templateId: string; answerId?: string }>();
  
  if (!answerId) {
    return <p>{t('viewAnswer.noAnswerId')}</p>;
  }

  const { data: tpl, loading: l1, error: e1 } = useTemplate(templateId);
  const { data: answers, loading: l2, error: e2 } = useAnswersForResponse(answerId);

  if (l1 || l2) return <p>{t('viewAnswer.loading')}</p>;
  if (e1) return <p>{t('viewAnswer.errorTemplate', { error: e1 })}</p>;
  if (e2) return <p>{t('viewAnswer.errorAnswers', { error: e2 })}</p>;
  if (!tpl || answers.length === 0) return <p>{t('viewAnswer.noAnswers')}</p>;

  return (
    <div>
      <h1>{tpl.title}</h1>
      <p>{tpl.description}</p>
      <h2>{t('viewAnswer.response')} #{answerId}</h2>
      {answers.map(answer => (
        <div key={answer.id}>
          {answer.question && (
            <>
              <strong>{t('viewAnswer.question')}: </strong> {answer.question.title}<br />
              <em>{t('viewAnswer.type')}: </em> {answer.question.type}<br />
            </>
          )}
          <p><strong>{t('viewAnswer.answer')}: </strong> {answer.value}</p>
        </div>
      ))}
    </div>
  );
};

export default ViewAnswerPage;