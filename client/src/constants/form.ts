export const QUESTION_TYPES = [
  { label: 'Single-line', value: 'single-line' },
  { label: 'Multi-line', value: 'multi-line' },
  { label: 'Integer', value: 'integer' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Single choice', value: 'single-choice' },
  { label: 'Multiple choice', value: 'multiple-choice' },
];
export const DEFAULT_QUESTION = {
  title: '',
  description: '',
  type: 'single-line',
  options: [],
  correctAnswer: '',
} as const;
