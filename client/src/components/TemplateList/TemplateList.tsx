import React from 'react';
import './TemplateList.scss';

export interface TemplateInfo {
  id: number;
  title: string;
  description: string;
}

interface Props {
  items: TemplateInfo[];
  onSelect: (id: number) => void;
}

export const TemplateList: React.FC<Props> = ({ items, onSelect }) => (
  <ul className="TemplateList">
    {items.map((t) => (
      <li key={t.id} className="TemplateList__item" onClick={() => onSelect(t.id)}>
        <strong>{t.title}</strong>
        <span>{t.description}</span>
      </li>
    ))}
  </ul>
);

export default TemplateList;
