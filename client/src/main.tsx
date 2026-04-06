import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { ErrorBoundary, NotificationCenter } from './components';
import { setupAxiosInterceptors } from './services/setupAxiosInterceptors';
import { store } from './store';
import './styles/style.scss';
import './i18n';

setupAxiosInterceptors(store);

ReactDOM.createRoot(document.querySelector<HTMLDivElement>('#app')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <NotificationCenter />
        <App />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>,
);
