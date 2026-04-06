import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';
import { store } from '../store';

describe('ProtectedRoute', () => {
  it('redirects guests to login', () => {
    localStorage.removeItem('token');

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route path="/login" element={<div>Login page</div>} />
            <Route
              path="/private"
              element={
                <ProtectedRoute>
                  <div>Private content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });
});
