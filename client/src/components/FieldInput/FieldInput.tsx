import React from 'react';
import { Question } from '../../hooks/useQuestions';
import { useTranslation } from 'react-i18next';
import './FieldInput.scss';

interface Props {
  question: Question;
  value: string;
  onChange: (qid: number, val: string | boolean) => void;
}

const FieldInput: React.FC<Props> = ({ question, value, onChange }) => {
  const { id, type } = question;
  const { t: translate } = useTranslation();
  const fieldType = type.toLowerCase().trim();

  console.log(`Rendering FieldInput for question id ${id} with type:`, fieldType);

  if (fieldType === 'integer' || fieldType === 'number' || fieldType === 'int') {
    return (
      <input
        type="number"
        value={value}
        onChange={e => onChange(id, e.target.value)}
      />
    );
  }

  if (fieldType === 'single-line' || fieldType === 'single line' || fieldType === 'text') {
    return (
      <input
        type="text"
        value={value}
        onChange={e => onChange(id, e.target.value)}
      />
    );
  }

  if (fieldType === 'multi-line' || fieldType === 'multi line' || fieldType === 'multiline') {
    return (
      <textarea
        value={value}
        onChange={e => onChange(id, e.target.value)}
      />
    );
  }

  if (fieldType === 'checkbox') {
    return (
      <input
        type="checkbox"
        checked={value === 'true' || value === 'on'}
        onChange={e => onChange(id, e.target.checked)}
      />
    );
  }

  console.warn(`FieldInput: Unhandled question type "${type}" for question id ${id}`);
  return <div>{translate('fieldInput.unknownField', { type })}</div>;
};

export default FieldInput;