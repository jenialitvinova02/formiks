import { useState, useCallback } from 'react';

export type AnswerValue = string | boolean | string[];

export const useAnswersState = () => {
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});

  const updateAnswer = useCallback((qid: number, val: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
  }, []);

  return { answers, updateAnswer, setAnswers };
};
