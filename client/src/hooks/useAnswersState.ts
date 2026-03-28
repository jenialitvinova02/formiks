import { useState, useCallback } from 'react';

export const useAnswersState = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const updateAnswer = useCallback((qid: number, val: string | boolean) => {
    setAnswers((prev) => ({ ...prev, [qid]: String(val) }));
  }, []);

  return { answers, updateAnswer, setAnswers };
};
