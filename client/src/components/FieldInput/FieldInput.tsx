import React from 'react';
import { AnswerValue } from '../../hooks';
import { Question, useNormalizedFieldType } from '../../hooks';
import { useTranslation } from 'react-i18next';
import './FieldInput.scss';

interface Props {
  question: Question;
  value: AnswerValue;
  onChange: (qid: number, val: AnswerValue) => void;
}

export const FieldInput: React.FC<Props> = ({ question, value, onChange }) => {
  const { id, type } = question;
  const { t } = useTranslation();
  const normalizedType = useNormalizedFieldType(type);
  const stringValue = typeof value === 'string' ? value : '';
  const arrayValue = Array.isArray(value) ? value : [];

  switch (normalizedType) {
    case 'number':
      return (
        <input
          className="fieldInput"
          type="number"
          value={stringValue}
          onChange={(e) => onChange(id, e.target.value)}
        />
      );
    case 'text':
      return (
        <input
          className="fieldInput"
          type="text"
          value={stringValue}
          onChange={(e) => onChange(id, e.target.value)}
        />
      );
    case 'textarea':
      return (
        <textarea
          className="fieldInput fieldInput--textarea"
          value={stringValue}
          onChange={(e) => onChange(id, e.target.value)}
        />
      );
    case 'checkbox':
      return (
        <input
          className="fieldInput fieldInput--checkbox"
          type="checkbox"
          checked={value === true || value === 'true' || value === 'on'}
          onChange={(e) => onChange(id, e.target.checked)}
        />
      );
    case 'single-choice':
      return (
        <div className="fieldInput__choices">
          {(question.options || []).map((option) => (
            <label key={option}>
              <input
                type="radio"
                name={`question-${id}`}
                value={option}
                checked={stringValue === option}
                onChange={(e) => onChange(id, e.target.value)}
              />
              {option}
            </label>
          ))}
        </div>
      );
    case 'multiple-choice':
      return (
        <div className="fieldInput__choices">
          {(question.options || []).map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                checked={arrayValue.includes(option)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...arrayValue, option]
                    : arrayValue.filter((item) => item !== option);
                  onChange(id, next);
                }}
              />
              {option}
            </label>
          ))}
        </div>
      );
    default:
      console.warn(
        `FieldInput: Unhandled question type "${type}" for question id ${id}`,
      );
      return <div>{t('fieldInput.unknownField', { type })}</div>;
  }
};

export default FieldInput;
