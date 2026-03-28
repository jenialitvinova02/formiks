import React from 'react';
import { QUESTION_TYPES } from '../../constants';
import { useTranslation } from 'react-i18next';
import './QuestionItem.scss';

interface Props {
  index: number;
  title: string;
  description: string;
  type: string;
  onChange: (field: 'title' | 'description' | 'type', value: string) => void;
}

export const QuestionItem: React.FC<Props> = ({
  index,
  title,
  description,
  type,
  onChange,
}) => {
  const { t } = useTranslation();
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
              {t(`questionItem.option.${option.value}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default QuestionItem;
