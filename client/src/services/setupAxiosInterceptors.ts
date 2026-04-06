import { AxiosError } from 'axios';
import { Store } from '@reduxjs/toolkit';
import axios from '../axiosInstance';
import { clearSession, pushNotification } from '../store';

function getErrorMessage(error: AxiosError<{ error?: string }>) {
  return error.response?.data?.error || error.message || 'Request failed';
}

export function setupAxiosInterceptors(store: Store) {
  axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ error?: string }>) => {
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        store.dispatch(clearSession());
      }

      store.dispatch(
        pushNotification({
          type: 'error',
          message: getErrorMessage(error),
        }),
      );

      return Promise.reject(error);
    },
  );
}
