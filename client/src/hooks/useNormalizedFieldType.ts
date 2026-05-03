import { useMemo } from 'react';

export function useNormalizedFieldType(
  type: string,
): 'number' | 'text' | 'textarea' | 'checkbox' | 'single-choice' | 'multiple-choice' | 'unknown' {
  return useMemo(() => {
    const norm = type.toLowerCase().trim();
    if (['integer', 'number', 'int'].includes(norm)) return 'number';
    if (['single-line', 'single line', 'text'].includes(norm)) return 'text';
    if (['multi-line', 'multi line', 'multiline'].includes(norm))
      return 'textarea';
    if (norm === 'checkbox') return 'checkbox';
    if (norm === 'single-choice') return 'single-choice';
    if (norm === 'multiple-choice') return 'multiple-choice';
    return 'unknown';
  }, [type]);
}
