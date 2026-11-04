import { brandId, type Branded } from '../../core/ids.ts';

export type ConceptId = Branded<string, 'ConceptId'>;

export const conceptId = (value: string): ConceptId => brandId<'ConceptId'>(value);
