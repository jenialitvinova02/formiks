import axios from '../axiosInstance';
import { clearSession, setSession, store } from '../store';
import { setupAxiosInterceptors } from '../services/setupAxiosInterceptors';

describe('setupAxiosInterceptors', () => {
  it('clears session on 401 responses', async () => {
    store.dispatch(setSession('header.payload.signature'));
    setupAxiosInterceptors(store);

    const handlers = (axios.interceptors.response as any).handlers as Array<{
      rejected?: (error: unknown) => Promise<unknown>;
    }>;
    const rejected = handlers[handlers.length - 1]?.rejected;

    await expect(
      rejected?.({
        response: { status: 401, data: { error: 'Unauthorized' } },
        message: 'Unauthorized',
      }),
    ).rejects.toBeTruthy();

    expect(store.getState().session.token).toBeNull();
    store.dispatch(clearSession());
  });
});
