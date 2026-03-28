import React, { useState, useEffect } from 'react';
import { TemplateForm, NewQuestion } from '../../hooks/useCreateTemplate';
import { useTemplate } from '../../hooks/useTemplate';
import QuestionItem from '../../components/QuestionItem/QuestionItem';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axiosInstance';
import { useTranslation } from 'react-i18next';
import './CreateTemplatePage.scss';

const CreateTemplatePage: React.FC = () => {
  const { t } = useTranslation();
  const { templateId } = useParams<{ templateId?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(templateId);

  const [meta, setMeta] = useState<Omit<TemplateForm, 'questions'>>({
    title: '',
    description: '',
    topic: '',
    tags: '',
    isPublic: true,
  });
  const [questions, setQuestions] = useState<NewQuestion[]>([]);

  const { data: template, loading, error } = useTemplate(templateId);
  useEffect(() => {
    if (isEditMode && template) {
      setMeta({
        title: template.title,
        description: template.description,
        topic: (template as any).topic || '',
        tags: (template as any).tags || '',
        isPublic: (template as any).isPublic || false,
      });
      if (template.questions && Array.isArray(template.questions)) {
        setQuestions(
          template.questions.map((q: any) => ({
            title: q.title,
            description: q.description || '',
            type: q.type,
          }))
        );
      }
    }
  }, [isEditMode, template]);

  const handleMetaChange = (field: keyof typeof meta, value: string | boolean) => {
    setMeta(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (idx: number, field: keyof NewQuestion, value: string) => {
    const qs = [...questions];
    qs[idx] = { ...qs[idx], [field]: value };
    setQuestions(qs);
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, { title: '', description: '', type: 'single-line' }]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: TemplateForm = { ...meta, questions };
    try {
      if (isEditMode && templateId) {
        await axios.put(`templates/${templateId}`, payload);
        navigate('/templates');
      } else {
        const created = await axios.post('templates', payload);
        navigate(`/fill-template/${created.data.id}`);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  if (isEditMode && loading) return <p>{t('createTemplate.loading')}</p>;
  if (isEditMode && error) return <p>{t('createTemplate.error', { error })}</p>;

  return (
    <form className="createTemplate" onSubmit={onSubmit}>
      <h1>{isEditMode ? t('createTemplate.editTemplate') : t('createTemplate.createTemplate')}</h1>
      <div className="createTemplate__container container">
        <input
          placeholder={t('createTemplate.title')}
          value={meta.title}
          onChange={e => handleMetaChange('title', e.target.value)}
          required
        />
        <textarea
          placeholder={t('createTemplate.description')}
          value={meta.description}
          onChange={e => handleMetaChange('description', e.target.value)}
        />
        <input
          placeholder={t('createTemplate.topic')}
          value={meta.topic}
          onChange={e => handleMetaChange('topic', e.target.value)}
        />
        <input
          placeholder={t('createTemplate.tags')}
          value={meta.tags}
          onChange={e => handleMetaChange('tags', e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={meta.isPublic}
            onChange={e => handleMetaChange('isPublic', e.target.checked)}
          />
          {t('createTemplate.public')}
        </label>
      </div>

      <hr />
      <h2>{t('createTemplate.questionsTitle')}</h2>
      <div className="createTemplate__block">
        <div className="createTemplate__block--buttons">
          <button type="button" onClick={addQuestion}>
            {t('createTemplate.addQuestion')}
          </button>
          <button type="submit">
            {isEditMode ? t('createTemplate.saveChanges') : t('createTemplate.createTemplateButton')}
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