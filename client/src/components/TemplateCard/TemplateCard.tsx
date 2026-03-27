import React from 'react';
import './TemplateCard.scss';

interface Props {
  title: string;
  description: string;
  topic: string;
  onClick: () => void;
}

const TemplateCard: React.FC<Props> = ({ title, description, topic, onClick }) => (
  <div className="template-card" onClick={onClick}>
    <h3>{title}</h3>
    <p>{description}</p>
    <small>Topic: {topic}</small>
  </div>
);

export default TemplateCard;