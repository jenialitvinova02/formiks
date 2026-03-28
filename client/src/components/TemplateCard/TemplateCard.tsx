import React from 'react';
import { useTranslation } from 'react-i18next';
import './TemplateCard.scss';

interface Props {
  title: string;
  description: string;
  topic: string;
  onClick: () => void;
}

const TemplateCard: React.FC<Props> = ({ title, description, topic, onClick }) => {
  const { t } = useTranslation();
  return (
    <div className="template-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{description}</p>
      <small>{t('templateCard.topic')}: {topic}</small>
    </div>
  );
};

export default TemplateCard;