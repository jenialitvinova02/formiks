import React from 'react';
import { ResponseInfo } from '../../hooks';

interface Props {
  items: ResponseInfo[];
  onSelect: (id: number) => void;
}

const ResponseList: React.FC<Props> = ({ items, onSelect }) => (
  <ul>
    {items.map((r) => (
      <li
        key={r.id}
        onClick={() => onSelect(r.id)}
        style={{ cursor: 'pointer' }}
      >
        #{r.id} – {new Date(r.createdAt).toLocaleString()}
      </li>
    ))}
  </ul>
);

export default ResponseList;
