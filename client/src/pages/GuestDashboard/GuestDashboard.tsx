import React, { useState, useEffect } from 'react';
import axios from '../../axiosInstance';

interface FormData {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

const GuestDashboard: React.FC = () => {
  const [forms, setForms] = useState<FormData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('forms')
      .then(res => setForms(res.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to fetch forms'));
  }, []);

  return (
    <div>
      <h1>All Forms</h1>
      {error && <p>{error}</p>}
      {forms.length > 0 ? (
        <ul>
          {forms.map(form => (
            <li key={form.id}>
              <p>{form.title} (Created: {new Date(form.createdAt).toLocaleString()})</p>
              <p>{form.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No forms available</p>
      )}
    </div>
  );
};

export default GuestDashboard;