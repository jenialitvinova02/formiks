import React, { useState, useEffect } from 'react';
import { useCreateTemplate, TemplateForm, NewQuestion } from '../../hooks/useCreateTemplate';
import { useTemplate } from '../../hooks/useTemplate';
import QuestionItem from '../../components/QuestionItem/QuestionItem';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axiosInstance';
import './CreateTemplatePage.scss';

const CreateTemplatePage: React.FC = () => {
  const { templateId } = useParams<{ templateId?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(templateId);

  // Состояние для метаданных шаблона
  const [meta, setMeta] = useState<Omit<TemplateForm, 'questions'>>({
    title: '',
    description: '',
    topic: '',
    tags: '',
    isPublic: true,
  });
  // Состояние для вопросов
  const [questions, setQuestions] = useState<NewQuestion[]>([]);

  // Если режим редактирования – загружаем существующий шаблон
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
        // Режим редактирования – обновление существующего шаблона
        await axios.put(`templates/${templateId}`, payload);
        navigate('/templates');
      } else {
        // Режим создания нового шаблона
        const created = await axios.post('templates', payload);
        navigate(`/fill-template/${created.data.id}`);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  if (isEditMode && loading) return <p>Loading…</p>;
  if (isEditMode && error) return <p>Error: {error}</p>;

  return (
    <form className="createTemplate" onSubmit={onSubmit}>
      <h1>{isEditMode ? 'Edit Template' : 'Create Template'}</h1>
      <div className="createTemplate__container container">
        <input
          placeholder="Title"
          value={meta.title}
          onChange={e => handleMetaChange('title', e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={meta.description}
          onChange={e => handleMetaChange('description', e.target.value)}
        />
        <input
          placeholder="Topic"
          value={meta.topic}
          onChange={e => handleMetaChange('topic', e.target.value)}
        />
        <input
          placeholder="Tags (comma separated)"
          value={meta.tags}
          onChange={e => handleMetaChange('tags', e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={meta.isPublic}
            onChange={e => handleMetaChange('isPublic', e.target.checked)}
          />
          Public
        </label>
      </div>

      <hr />
      <h2>Questions</h2>
      <div className="createTemplate__block">
        <div className="createTemplate__block--buttons">
          <button type="button" onClick={addQuestion}>
            + Add Question
          </button>
          <button type="submit">
            {isEditMode ? 'Save Changes' : 'Create Template'}
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