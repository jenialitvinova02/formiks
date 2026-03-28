import React, { useState } from 'react';
import { useCreateTemplate, TemplateForm, NewQuestion } from '../../hooks/useCreateTemplate';
import QuestionItem from '../../components/QuestionItem/QuestionItem';
import './CreateTemplatePage.scss';

const CreateTemplatePage: React.FC = () => {
  const [meta, setMeta] = useState<Omit<TemplateForm, 'questions'>>({
    title: '',
    description: '',
    topic: '',
    tags: '',
    isPublic: true,
  });
  const [questions, setQuestions] = useState<NewQuestion[]>([]);
  const { create, loading, error } = useCreateTemplate();

  const handleMetaChange = (field: keyof typeof meta, value: string | boolean) => {
    setMeta(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (
    idx: number,
    field: keyof NewQuestion,
    value: string
  ) => {
    const qs = [...questions];
    qs[idx] = { ...qs[idx], [field]: value };
    setQuestions(qs);
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, { title: '', description: '', type: 'single-line' }]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create({ ...meta, questions });
    } catch {  }
  };

  return (
    <form className="createTemplate" onSubmit={onSubmit}>
      <h1>Create Template</h1>
      {error && <p className="error">{error}</p>}
      <div className="createTemplate__container">

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
      <button type="submit" disabled={loading}>
        {loading ? 'Creating…' : 'Create Template'}
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