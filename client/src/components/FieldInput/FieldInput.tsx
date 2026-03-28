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
  const t = type.toLowerCase().trim();

  console.log(`Rendering FieldInput for question id ${id} with type:`, t);

  if (t === 'integer' || t === 'number' || t === 'int') {
    return (
      <input
        type="number"
        value={value}
        onChange={e => onChange(id, e.target.value)}
      />
    );
  }

  if (t === 'single-line' || t === 'single line' || t === 'text') {
    return (
      <input
        type="text"
        value={value}
        onChange={e => onChange(id, e.target.value)}
      />
    );
  }

  if (t === 'multi-line' || t === 'multi line' || t === 'multiline') {
    return (
      <textarea
        value={value}
        onChange={e => onChange(id, e.target.value)}
      />
    );
  }

  if (t === 'checkbox') {
    return (
      <input
        type="checkbox"
        checked={value === 'true' || value === 'on'}
        onChange={e => onChange(id, e.target.checked)}
      />
    );
  }

  console.warn(`FieldInput: Unhandled question type "${type}" for question id ${id}`);
  return <div>Unknown field type: {type}</div>;
};

export default FieldInput;