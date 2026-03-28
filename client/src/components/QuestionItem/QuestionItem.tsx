import React from 'react';
import { QUESTION_TYPES } from '../../constants/form';
import './QuestionItem.scss';

interface Props {
  index: number;
  title: string;
  description: string;
  type: string;
  onChange: (field: 'title'|'description'|'type', value: string) => void;
}

const QuestionItem: React.FC<Props> = ({ index, title, description, type, onChange }) => (
  <div className="questionItem">
    <h4>Question {index + 1}</h4>
    <div className="questionItem__container">
    <input
      placeholder="Title"
      value={title}
      onChange={e => onChange('title', e.target.value)}
    />
    <input
      placeholder="Description"
      value={description}
      onChange={e => onChange('description', e.target.value)}
    />
    <select value={type} onChange={e => onChange('type', e.target.value)}>
      {QUESTION_TYPES.map(t => (
        <option key={t.value} value={t.value}>{t.label}</option>
      ))}
    </select>
    </div>

  </div>
);

export default QuestionItem;