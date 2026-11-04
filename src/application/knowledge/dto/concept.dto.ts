import type { Concept } from '../../../domain/knowledge/concept.entity.ts';
import type { ConceptCategory } from '../../../domain/knowledge/concept-category.ts';

export interface ConceptDto {
  id: string;
  title: string;
  category: ConceptCategory;
  summary: string;
  body: string;
  tags: string[];
  order: number;
}

export interface TocEntryDto {
  id: string;
  title: string;
  category: ConceptCategory;
  order: number;
}

export const toConceptDto = (concept: Concept): ConceptDto => ({
  id: concept.id,
  title: concept.title,
  category: concept.category,
  summary: concept.summary,
  body: concept.body,
  tags: [...concept.tags],
  order: concept.order,
});

export const toTocEntryDto = (concept: Concept): TocEntryDto => ({
  id: concept.id,
  title: concept.title,
  category: concept.category,
  order: concept.order,
});
