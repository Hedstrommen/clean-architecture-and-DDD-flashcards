import { err, ok, type Result } from '../../core/result.ts';
import { NotFoundFailure } from '../../core/failures.ts';
import type { ConceptRepository } from '../../domain/knowledge/concept.repository.ts';
import type { Concept } from '../../domain/knowledge/concept.entity.ts';
import type { ConceptId } from '../../domain/knowledge/concept-id.ts';
import { seedConcepts } from '../data/seed-concepts.ts';

export class InMemoryConceptRepository implements ConceptRepository {
  private readonly store: Concept[];

  constructor(seed: Concept[] = seedConcepts) {
    this.store = [...seed];
  }

  async findAll(): Promise<Concept[]> {
    return [...this.store];
  }

  async findById(id: ConceptId): Promise<Result<Concept, NotFoundFailure>> {
    const found = this.store.find((c) => c.id === id);
    return found ? ok(found) : err(new NotFoundFailure('concept', id));
  }

  async search(query: string): Promise<Concept[]> {
    return this.store.filter((c) => c.matchesQuery(query));
  }
}
