import React from 'react';
import { Question } from '../../hooks/useQuestions';
import './FieldInput.scss';

interface Props {
  question: Question;
  value: string;
  onChange: (qid: number, val: string | boolean) => void;
}

const FieldInput: React.FC<Props> = ({ question, value, onChange }) => {
  const { id, type } = question;

  switch (type) {
    case 'integer':
      return (
        <input
          type="number"
          value={value}
          onChange={e => onChange(id, e.target.value)}
        />
      );
    case 'single-line':
      return (
        <input
          type="text"
          value={value}
          onChange={e => onChange(id, e.target.value)}
        />
      );
    case 'multi-line':
      return (
        <textarea
          value={value}
          onChange={e => onChange(id, e.target.value)}
        />
      );
    case 'checkbox':
      return (
        <input
          type="checkbox"
          checked={value === 'true'}
          onChange={e => onChange(id, e.target.checked)}
        />
      );
    default:
      return null;
  }
};

export default FieldInput;