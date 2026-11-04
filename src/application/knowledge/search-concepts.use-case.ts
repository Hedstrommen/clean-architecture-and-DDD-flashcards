import type { ConceptRepository } from '../../domain/knowledge/concept.repository.ts';
import { toConceptDto, type ConceptDto } from './dto/concept.dto.ts';

export class SearchConceptsUseCase {
  constructor(private readonly concepts: ConceptRepository) {}

  async execute(query: string): Promise<ConceptDto[]> {
    const matches = await this.concepts.search(query);
    return matches
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(toConceptDto);
  }
}
