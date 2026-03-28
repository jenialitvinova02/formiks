// filepath: c:\Users\Danila\Desktop\ITtransition\CourseProject\client\src\pages\templates\ViewAnswer.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTemplate } from '../../hooks/useTemplate';
import { useAnswer } from '../../hooks/useAnswer';

const ViewAnswerPage: React.FC = () => {
  const { templateId, answerId } = useParams<{ templateId: string; answerId: string }>();
  const { data: tpl, loading: l1, error: e1 } = useTemplate(templateId);
  const { data: ans, loading: l2, error: e2 } = useAnswer(answerId);

  if (l1 || l2) return <p>Loading…</p>;
  if (e1)       return <p>Error loading template: {e1}</p>;
  if (e2)       return <p>Error loading answer: {e2}</p>;
  if (!tpl || !ans) return null;

  const question = tpl.questions.find(q => q.id === ans.questionId);

  return (
    <div>
      <h1>{tpl.title}</h1>
      <p>{tpl.description}</p>

      <h2>Answer #{ans.id}</h2>
      {question && (
        <>
          <strong>Question:</strong> {question.title}<br/>
          <em>Type:</em> {question.type}<br/>
        </>
      )}
      <p><strong>Value:</strong> {ans.value}</p>
    </div>
  );
};

export default ViewAnswerPage;