import type { ConceptCategory } from '../../domain/knowledge/concept-category.ts';

export const CATEGORY_COLORS: Record<ConceptCategory, { main: string; soft: string; label: string }> = {
  'clean-architecture': { main: '#2563eb', soft: '#dbeafe', label: 'Clean Architecture' },
  ddd: { main: '#7c3aed', soft: '#ede9fe', label: 'DDD' },
  both: { main: '#0d9488', soft: '#ccfbf1', label: 'Both' },
};

export const CATEGORY_LABELS: Record<ConceptCategory, string> = {
  'clean-architecture': 'Clean Architecture',
  ddd: 'Domain-Driven Design',
  both: 'Clean Architecture + DDD',
};
