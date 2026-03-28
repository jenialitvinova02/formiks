import { useState, useEffect, useCallback } from 'react';
import { AnswerFull } from './useAnswersForResponse';

export function useAnswerValues(answers: AnswerFull[]) {
  const [values, setValues] = useState<Record<number, string>>({});

  useEffect(() => {
    const init: Record<number, string> = {};
    answers.forEach(a => {
      init[a.id] = a.value;
    });
    setValues(init);
  }, [answers]);

  const handleChange = useCallback((ansId: number, val: string) => {
    setValues(prev => ({ ...prev, [ansId]: val }));
  }, []);

  return { values, handleChange };
}