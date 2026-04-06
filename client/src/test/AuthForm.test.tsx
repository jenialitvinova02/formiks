import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthForm } from '../components';
import { store } from '../store';

const loginMock = vi.fn();
const registerMock = vi.fn();

vi.mock('../hooks', async () => {
  const actual = await vi.importActual<typeof import('../hooks')>('../hooks');

  return {
    ...actual,
    useAuth: () => ({
      login: loginMock,
      register: registerMock,
      error: null,
      loading: false,
      logout: vi.fn(),
    }),
    useTheme: () => ({
      theme: 'dark',
      toggleTheme: vi.fn(),
    }),
    useLanguage: () => ({
      currentLanguage: 'en',
      changeLanguage: vi.fn(),
    }),
  };
});

describe('AuthForm', () => {
  it('shows local validation error for short password', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthForm mode="login" onSuccess={vi.fn()} />
        </MemoryRouter>
      </Provider>,
    );

    await user.type(screen.getByPlaceholderText(/email/i), 'demo@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), '123');
    await user.click(screen.getByRole('button', { name: 'authForm.login' }));

    expect(
      screen.getByText('Password must be at least 6 characters long.'),
    ).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });
});
