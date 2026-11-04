import type { ConceptCategory } from '../../domain/knowledge/concept-category.ts';
import { CATEGORY_LABELS } from '../theme/theme.ts';

const className: Record<ConceptCategory, string> = {
  'clean-architecture': 'ca',
  ddd: 'ddd',
  both: 'both',
};

export const CategoryBadge = ({ category }: { category: ConceptCategory }) => (
  <span className={`badge ${className[category]}`}>{CATEGORY_LABELS[category]}</span>
);
