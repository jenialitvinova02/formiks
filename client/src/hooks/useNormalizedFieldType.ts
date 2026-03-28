import { useMemo } from 'react';

export function useNormalizedFieldType(type: string): 'number' | 'text' | 'textarea' | 'checkbox' | 'unknown' {
  return useMemo(() => {
    const norm = type.toLowerCase().trim();
    if (['integer', 'number', 'int'].includes(norm)) return 'number';
    if (['single-line', 'single line', 'text'].includes(norm)) return 'text';
    if (['multi-line', 'multi line', 'multiline'].includes(norm)) return 'textarea';
    if (norm === 'checkbox') return 'checkbox';
    return 'unknown';
  }, [type]);
}