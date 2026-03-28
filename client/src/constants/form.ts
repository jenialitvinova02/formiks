export const QUESTION_TYPES = [
    { label: 'Single-line', value: 'single-line' },
    { label: 'Multi-line',  value: 'multi-line'  },
    { label: 'Integer',     value: 'integer'     },
    { label: 'Checkbox',    value: 'checkbox'    },
  ];
  export const DEFAULT_QUESTION = {
  title: '',
  description: '',
  type: 'text',
} as const;