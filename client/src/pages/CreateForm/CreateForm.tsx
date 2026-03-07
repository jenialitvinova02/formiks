import React, { useState } from 'react';
import axios from '../../axiosInstance';

interface Question {
    title: string;
    type: 'text' | 'number' | 'checkbox'; 
}

const CreateForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questionsCount, setQuestionsCount] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleQuestionsCountChange = (count: number) => {
        const newQuestions = Array.from({ length: count }, (_, i) => questions[i] || { title: '', type: 'text' });
        setQuestions(newQuestions);
        setQuestionsCount(count);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = { title, description, questions };
            const response = await axios.post('forms', data);
            console.log('Form created:', response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Form creation failed');
        }
    };

    return (
        <div>
            <h1>Create Form</h1>
            {error && <p>{error}</p>}
            <input type="text" placeholder="Form Title" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <input
                type="number"
                placeholder="Number of Questions"
                value={questionsCount}
                onChange={e => handleQuestionsCountChange(Number(e.target.value))}
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
                    <select
                        value={q.type}
                        onChange={e => {
                            const newQuestions = [...questions];
                            newQuestions[index].type = e.target.value as 'text' | 'number' | 'checkbox';
                            setQuestions(newQuestions);
                        }}
                    >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="checkbox">Checkbox</option>
                    </select>
                </div>
            ))}
            <button onClick={handleSubmit}>Create Form</button>
        </div>
    );
};

export default CreateForm;