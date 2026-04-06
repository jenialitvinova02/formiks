import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axiosInstance';
import { useTranslation } from 'react-i18next';
import { InlineAlert, LoadingSkeleton, QuestionItem } from '../../components';
import { useTemplateForm } from '../../hooks';
import { pushNotification, useAppDispatch } from '../../store';
import './CreateTemplatePage.scss';

export const CreateTemplatePage: React.FC = () => {
  const { t } = useTranslation();
  const { templateId } = useParams<{ templateId?: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    isEditMode,
    meta,
    questions,
    handleMetaChange,
    handleQuestionChange,
    addQuestion,
    loading,
    error,
  } = useTemplateForm(templateId);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...meta, questions };
    try {
      if (isEditMode && templateId) {
        await axios.put(`templates/${templateId}`, payload);
        dispatch(
          pushNotification({
            type: 'success',
            message: 'Template updated successfully.',
          }),
        );
        navigate('/templates');
      } else {
        const created = await axios.post('templates', payload);
        dispatch(
          pushNotification({
            type: 'success',
            message: 'Template created successfully.',
          }),
        );
        navigate(`/fill-template/${created.data.id}`);
      }
    } catch {
      dispatch(
        pushNotification({
          type: 'error',
          message: 'Failed to save the template.',
        }),
      );
    }
  };

  if (isEditMode && loading) {
    return (
      <div className="createTemplate">
        <div className="createTemplate__container">
          <LoadingSkeleton rows={4} />
        </div>
      </div>
    );
  }
  if (isEditMode && error)
    return (
      <InlineAlert
        title="Failed to load template"
        message={t('createTemplate.error', { error })}
      />
    );

  return (
    <form className="createTemplate" onSubmit={onSubmit}>
      <div className="page-title">
        <h1>
          {isEditMode
            ? t('createTemplate.editTemplate')
            : t('createTemplate.createTemplate')}
        </h1>
        <p>Set template metadata, design question flows and prepare a cleaner form experience.</p>
      </div>
      <div className="createTemplate__container">
        <input
          placeholder={t('createTemplate.title')}
          value={meta.title}
          onChange={(e) => handleMetaChange('title', e.target.value)}
          required
        />
        <textarea
          placeholder={t('createTemplate.description')}
          value={meta.description}
          onChange={(e) => handleMetaChange('description', e.target.value)}
        />
        <input
          placeholder={t('createTemplate.topic')}
          value={meta.topic}
          onChange={(e) => handleMetaChange('topic', e.target.value)}
        />
        <input
          placeholder={t('createTemplate.tags')}
          value={meta.tags}
          onChange={(e) => handleMetaChange('tags', e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={meta.isPublic}
            onChange={(e) => handleMetaChange('isPublic', e.target.checked)}
          />
          {t('createTemplate.public')}
        </label>
      </div>

      <hr />
      <div className="createTemplate__block">
        <div className="page-title">
          <h2>{t('createTemplate.questionsTitle')}</h2>
        </div>
        <div className="createTemplate__block--buttons">
          <button type="button" onClick={addQuestion}>
            {t('createTemplate.addQuestion')}
          </button>
          <button type="submit">
            {isEditMode
              ? t('createTemplate.saveChanges')
              : t('createTemplate.createTemplateButton')}
          </button>
        </div>

        <div className="createTemplate__block--items">
          {questions.map((q, i) => (
            <QuestionItem
              key={i}
              index={i}
              title={q.title}
              description={q.description}
              type={q.type}
              onChange={(field, val) => handleQuestionChange(i, field, val)}
            />
          ))}
        </div>
      </div>
    </form>
  );
};

export default CreateTemplatePage;
