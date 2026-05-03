import React from 'react';
import { QUESTION_TYPES } from '../../constants';
import { useTranslation } from 'react-i18next';
import './QuestionItem.scss';

interface Props {
  index: number;
  title: string;
  description: string;
  type: string;
  options?: string[];
  correctAnswer?: string;
  onChange: (
    field: 'title' | 'description' | 'type' | 'options' | 'correctAnswer',
    value: string | string[],
  ) => void;
}

export const QuestionItem: React.FC<Props> = ({
  index,
  title,
  description,
  type,
  options = [],
  correctAnswer = '',
  onChange,
}) => {
  const { t } = useTranslation();
  const usesOptions = type === 'single-choice' || type === 'multiple-choice';
  const optionText = options.join('\n');

  return (
    <div className="questionItem">
      <h4>
        {t('questionItem.question')} {index + 1}
      </h4>
      <div className="questionItem__container">
        <input
          placeholder={t('questionItem.titlePlaceholder')}
          value={title}
          onChange={(e) => onChange('title', e.target.value)}
        />
        <input
          placeholder={t('questionItem.descriptionPlaceholder')}
          value={description}
          onChange={(e) => onChange('description', e.target.value)}
        />
        <select value={type} onChange={(e) => onChange('type', e.target.value)}>
          {QUESTION_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {t(`questionItem.option.${option.value}`, option.label)}
            </option>
          ))}
        </select>
        {usesOptions && (
          <textarea
            placeholder="Answer options, one per line"
            value={optionText}
            onChange={(e) =>
              onChange(
                'options',
                e.target.value
                  .split('\n')
                  .map((item) => item.trim())
                  .filter(Boolean),
              )
            }
          />
        )}
        <input
          placeholder={
            usesOptions
              ? 'Correct answer. For multiple choice use comma-separated values'
              : 'Correct answer (optional)'
          }
          value={correctAnswer}
          onChange={(e) => onChange('correctAnswer', e.target.value)}
        />
      </div>
    </div>
  );
};

export default QuestionItem;
