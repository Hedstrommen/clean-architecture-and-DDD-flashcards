import type { Result } from '../../core/result.ts';
import type { NotFoundFailure } from '../../core/failures.ts';
import type { ConceptRepository } from '../../domain/knowledge/concept.repository.ts';
import { conceptId } from '../../domain/knowledge/concept-id.ts';
import { toConceptDto, type ConceptDto } from './dto/concept.dto.ts';

export class GetConceptUseCase {
  constructor(private readonly concepts: ConceptRepository) {}

  async execute(id: string): Promise<Result<ConceptDto, NotFoundFailure>> {
    const result = await this.concepts.findById(conceptId(id));
    return result.ok ? { ok: true, value: toConceptDto(result.value) } : result;
  }
}
