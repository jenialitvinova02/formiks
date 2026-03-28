import React from 'react';
import { useParams } from 'react-router-dom';
import { useTemplate } from '../../hooks/useTemplate';
import { useAnswersForResponse } from '../../hooks/useAnswersForResponse';

const ViewAnswerPage: React.FC = () => {
  const { templateId, answerId } = useParams<{ templateId: string; answerId?: string }>();
  
  if (!answerId) {
    return <p>No answer id provided</p>;
  }

  const { data: tpl, loading: l1, error: e1 } = useTemplate(templateId);
  const { data: answers, loading: l2, error: e2 } = useAnswersForResponse(answerId);

  if (l1 || l2) return <p>Loading…</p>;
  if (e1) return <p>Error loading template: {e1}</p>;
  if (e2) return <p>Error loading answers: {e2}</p>;
  if (!tpl || answers.length === 0) return <p>No answers found for this response</p>;

  return (
    <div>
      <h1>{tpl.title}</h1>
      <p>{tpl.description}</p>
      <h2>Response #{answerId}</h2>
      {answers.map(answer => (
        <div key={answer.id}>
          {answer.question && (
            <>
              <strong>Question:</strong> {answer.question.title}<br />
              <em>Type:</em> {answer.question.type}<br />
            </>
          )}
          <p><strong>Answer:</strong> {answer.value}</p>
        </div>
      ))}
    </div>
  );
};

export default ViewAnswerPage;