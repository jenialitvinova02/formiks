import React from 'react';
import { Question, useNormalizedFieldType } from '../../hooks';
import { useTranslation } from 'react-i18next';
import './FieldInput.scss';

interface Props {
  question: Question;
  value: string;
  onChange: (qid: number, val: string | boolean) => void;
}

export const FieldInput: React.FC<Props> = ({ question, value, onChange }) => {
  const { id, type } = question;
  const { t } = useTranslation();
  const normalizedType = useNormalizedFieldType(type);

  switch (normalizedType) {
    case 'number':
      return (
        <input
          className="fieldInput"
          type="number"
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
        />
      );
    case 'text':
      return (
        <input
          className="fieldInput"
          type="text"
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
        />
      );
    case 'textarea':
      return (
        <textarea
          className="fieldInput fieldInput--textarea"
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
        />
      );
    case 'checkbox':
      return (
        <input
          className="fieldInput fieldInput--checkbox"
          type="checkbox"
          checked={value === 'true' || value === 'on'}
          onChange={(e) => onChange(id, e.target.checked)}
        />
      );
    default:
      console.warn(
        `FieldInput: Unhandled question type "${type}" for question id ${id}`,
      );
      return <div>{t('fieldInput.unknownField', { type })}</div>;
  }
};

export default FieldInput;
