import { useEffect, useState } from 'react';
import axios from '../axiosInstance';
import { RealtimeAnalyticsSnapshot } from '../types/realtimeAnalytics';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export function useRealtimeAnalytics(token: string | null) {
  const [snapshot, setSnapshot] = useState<RealtimeAnalyticsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      setSnapshot(null);
      setLoading(false);
      setConnected(false);
      setError('Authentication is required to view live analytics.');
      return;
    }

    let isMounted = true;
    const eventSource = new EventSource(
      `${API_BASE_URL}/analytics/realtime/stream?token=${encodeURIComponent(token)}`,
    );

    const loadSnapshot = async () => {
      try {
        const { data } = await axios.get<RealtimeAnalyticsSnapshot>(
          'analytics/realtime/snapshot',
        );
        if (!isMounted) return;
        setSnapshot(data);
        setError('');
      } catch (err: any) {
        if (!isMounted) return;
        setError(err.response?.data?.error || err.message || 'Failed to load analytics.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSnapshot();

    eventSource.addEventListener('open', () => {
      if (!isMounted) return;
      setConnected(true);
    });

    eventSource.addEventListener('analytics:update', (event) => {
      if (!isMounted) return;
      const payload = JSON.parse((event as MessageEvent).data) as RealtimeAnalyticsSnapshot;
      setSnapshot(payload);
      setConnected(true);
      setLoading(false);
      setError('');
    });

    eventSource.onerror = () => {
      if (!isMounted) return;
      setConnected(false);
      setLoading(false);
    };

    return () => {
      isMounted = false;
      eventSource.close();
    };
  }, [token]);

  return {
    snapshot,
    loading,
    error,
    connected,
  };
}
