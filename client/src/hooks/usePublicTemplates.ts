import { useState, useEffect } from 'react';
import axios from '../axiosInstance';

export interface TemplateData {
  id: string;
  title: string;
  description: string;
}

export function usePublicTemplates(): TemplateData[] {
  const [data, setData] = useState<TemplateData[]>([]);

  useEffect(() => {
    axios
      .get<TemplateData[]>('/public/templates')
      .then((r) => {
        console.log('usePublicTemplates: received data:', r.data);
        setData(r.data);
      })
      .catch((e) => {
        console.error('usePublicTemplates: error:', e);
        setData([]);
      });
  }, []);

  return data;
}
