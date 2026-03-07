import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance';

interface FormData {
    id: number;
    userId: number;
    templateId: number;
    createdAt: string;
    updatedAt: string;
}

const Dashboard: React.FC = () => {
    const [forms, setForms] = useState<FormData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.get('forms/user');
                setForms(response.data);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to fetch forms');
            } finally {
                setLoading(false);
            }
        };

        fetchForms();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Привет! Вы успешно авторизованы.</p>
            <h2>Мои формы</h2>
            {forms.length > 0 ? (
                <ul>
                    {forms.map(form => (
                        <li key={form.id}>
                            Form ID: {form.id}, Template ID: {form.templateId}, Created At: {form.createdAt}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>У вас ещё нет заполненных форм.</p>
            )}
        </div>
    );
};

export default Dashboard;