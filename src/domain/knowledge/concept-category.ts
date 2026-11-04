export const CONCEPT_CATEGORIES = ['clean-architecture', 'ddd', 'both'] as const;

export type ConceptCategory = (typeof CONCEPT_CATEGORIES)[number];

export const isConceptCategory = (value: string): value is ConceptCategory =>
  (CONCEPT_CATEGORIES as readonly string[]).includes(value);
