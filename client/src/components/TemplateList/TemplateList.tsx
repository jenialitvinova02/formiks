import React from 'react';

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
  <ul>
    {items.map((t) => (
      <li
        key={t.id}
        onClick={() => onSelect(t.id)}
        style={{ cursor: 'pointer' }}
      >
        <strong>{t.title}</strong>: {t.description}
      </li>
    ))}
  </ul>
);

export default TemplateList;
