import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { TemplatesPage } from '../pages/TemplatesPage/TemplatesPage';
import { store } from '../store';

vi.mock('../hooks', async () => {
  const actual = await vi.importActual<typeof import('../hooks')>('../hooks');

  return {
    ...actual,
    useTemplates: () => ({
      data: [
        {
          id: 1,
          title: 'Alpha Survey',
          description: 'First template',
          topic: 'alpha',
          createdAt: '2026-03-29T10:00:00.000Z',
        },
        {
          id: 2,
          title: 'Beta Checklist',
          description: 'Second template',
          topic: 'beta',
          createdAt: '2026-03-30T10:00:00.000Z',
        },
      ],
      loading: false,
      error: null,
      refetch: vi.fn(),
    }),
    useIsAdmin: () => true,
    useFormAnswersActions: () => ({
      mode: 'normal',
      selectedDelete: [],
      selectedEdit: null,
      toggleDeleteSelection: vi.fn(),
      enterDeleteMode: vi.fn(),
      enterEditMode: vi.fn(),
      cancelAction: vi.fn(),
      setSelectedEdit: vi.fn(),
    }),
  };
});

describe('TemplatesPage integration', () => {
  it('filters templates by search input', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TemplatesPage />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Alpha Survey')).toBeInTheDocument();
    expect(screen.getByText('Beta Checklist')).toBeInTheDocument();

    await user.type(
      screen.getByLabelText('Search templates'),
      'beta',
    );

    expect(screen.queryByText('Alpha Survey')).not.toBeInTheDocument();
    expect(screen.getByText('Beta Checklist')).toBeInTheDocument();
  });
});
