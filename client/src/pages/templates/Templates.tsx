import React, { useState, useEffect } from 'react';
import axios from '../../axiosInstance';
import { Link } from 'react-router-dom';

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('templates')
      .then(res => setTemplates(res.data))
      .catch(err => setError('Failed to load templates'));
  }, []);

  return (
    <div>
      <h1>Templates</h1>
      {error && <p>{error}</p>}
      {templates.length > 0 ? (
        <ul>
          {templates.map(template => (
            <li key={template.id}>
              <Link to={`/templates/${template.id}`}>{template.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No templates found</p>
      )}
    </div>
  );
};

export default Templates;