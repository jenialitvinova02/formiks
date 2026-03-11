import React, { useState } from 'react';
import axios from '../../axiosInstance';

const CreateTemplate: React.FC = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    topic: '',
    tags: '',
    isPublic: true,
    questionsCount: 0, 
  });
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Array<{ title: string; description: string; type: string }>>([]);

  const handleCreate = () => {
    const { questionsCount, ...templateData } = form;
    axios.post('templates', templateData)
      .then(res => {
        console.log('Template created:', res.data);
      })
      .catch(err => {
        console.error('Error while creating template:', err.response?.data);
        setError(err.response?.data?.error || 'Failed to create template');
      });
  };

  const handleQuestionsCountChange = (count: number) => {
    const newQuestions = Array.from({ length: count }, (_, i) => questions[i] || { title: '', description: '', type: 'text' });
    setQuestions(newQuestions);
  };

  return (
    <div>
      <h1>Create Template</h1>
      {error && <p>{error}</p>}
      <input 
        type="text" 
        placeholder="Title" 
        value={form.title} 
        onChange={e => setForm({...form, title: e.target.value})}
      />
      <textarea 
        placeholder="Description" 
        value={form.description} 
        onChange={e => setForm({...form, description: e.target.value})}
      />
      <input 
        type="text" 
        placeholder="Topic" 
        value={form.topic} 
        onChange={e => setForm({...form, topic: e.target.value})}
      />
      <input 
        type="text" 
        placeholder="Tags" 
        value={form.tags} 
        onChange={e => setForm({...form, tags: e.target.value})}
      />
      <label>
        <input 
          type="checkbox" 
          checked={form.isPublic} 
          onChange={e => setForm({...form, isPublic: e.target.checked})}
        />
        Public
      </label>
      <hr />
      <input 
        type="number" 
        placeholder="Number of Questions" 
        value={form.questionsCount} 
        onChange={e => {
          setForm({...form, questionsCount: Number(e.target.value)});
          handleQuestionsCountChange(Number(e.target.value));
        }}
      />
      {questions.map((q, index) => (
        <div key={index}>
          <input 
            placeholder={`Question ${index + 1} Title`} 
            value={q.title} 
            onChange={e => {
              const newQuestions = [...questions];
              newQuestions[index].title = e.target.value;
              setQuestions(newQuestions);
            }} 
          />
          <input 
            placeholder={`Question ${index + 1} Description`} 
            value={q.description} 
            onChange={e => {
              const newQuestions = [...questions];
              newQuestions[index].description = e.target.value;
              setQuestions(newQuestions);
            }} 
          />
          <select
            value={q.type}
            onChange={e => {
              const newQuestions = [...questions];
              newQuestions[index].type = e.target.value;
              setQuestions(newQuestions);
            }}
          >
            <option value="single-line">Single-line</option>
            <option value="multi-line">Multi-line</option>
            <option value="integer">Integer</option>
            <option value="checkbox">Checkbox</option>
          </select>
        </div>
      ))}
      <button onClick={handleCreate}>Create Template</button>
    </div>
  );
};

export default CreateTemplate;