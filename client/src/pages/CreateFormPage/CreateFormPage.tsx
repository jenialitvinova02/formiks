import React, { useState } from 'react';
import axios from '../../axiosInstance';
import { useTranslation } from 'react-i18next';

interface Question {
    title: string;
    type: 'text' | 'number' | 'checkbox'; 
}

const CreateFormPage: React.FC = () => {
    const { t } = useTranslation();
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
            setError(err.response?.data?.error || t('createForm.creationError'));
        }
    };

    return (
        <div>
            <h1>{t('createForm.createFormTitle')}</h1>
            {error && <p>{error}</p>}
            <input 
                type="text" 
                placeholder={t('createForm.formTitlePlaceholder')} 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
            />
            <textarea 
                placeholder={t('createForm.descriptionPlaceholder')} 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
            />
            <input
                type="number"
                placeholder={t('createForm.questionsCountPlaceholder')}
                value={questionsCount}
                onChange={e => handleQuestionsCountChange(Number(e.target.value))}
            />
            {questions.map((q, index) => (
                <div key={index}>
                    <input
                        placeholder={t('createForm.questionTitlePlaceholder', { number: index + 1 })}
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
                        <option value="text">{t('createForm.optionText')}</option>
                        <option value="number">{t('createForm.optionNumber')}</option>
                        <option value="checkbox">{t('createForm.optionCheckbox')}</option>
                    </select>
                </div>
            ))}
            <button onClick={handleSubmit}>{t('createForm.submitButton')}</button>
        </div>
    );
};

export default CreateFormPage;