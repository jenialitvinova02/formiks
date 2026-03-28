import { useState, useEffect } from 'react';
import axios from '../axiosInstance';

export interface TemplateData {
  id: string;
  name: string;
  description: string;
}

export function usePublicTemplates() {
  const [data, setData] = useState<TemplateData[]>([]);
  useEffect(() => {
    axios
      .get('templates?public=true')
      .then((r) => setData(r.data))
      .catch(() => {
        /*…*/
      });
  }, []);
  return data;
}
