import React from 'react';
import { useTranslation } from 'react-i18next';
import './TemplateCard.scss';

interface Props {
  title: string;
  description: string;
  topic: string;
  onClick: () => void;
}

export const TemplateCard: React.FC<Props> = ({
  title,
  description,
  topic,
  onClick,
}) => {
  const { t } = useTranslation();
  return (
    <div className="template-card" onClick={onClick}>
      <small className="template-card__topic">
        {t('templateCard.topic')}: {topic}
      </small>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default TemplateCard;
