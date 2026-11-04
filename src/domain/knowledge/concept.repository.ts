import type { Result } from '../../core/result.ts';
import type { NotFoundFailure } from '../../core/failures.ts';
import type { Concept } from './concept.entity.ts';
import type { ConceptId } from './concept-id.ts';

export interface ConceptRepository {
  findAll(): Promise<Concept[]>;
  findById(id: ConceptId): Promise<Result<Concept, NotFoundFailure>>;
  search(query: string): Promise<Concept[]>;
}
