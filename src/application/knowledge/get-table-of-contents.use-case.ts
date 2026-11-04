import type { ConceptRepository } from '../../domain/knowledge/concept.repository.ts';
import { toTocEntryDto, type TocEntryDto } from './dto/concept.dto.ts';

export class GetTableOfContentsUseCase {
  constructor(private readonly concepts: ConceptRepository) {}

  async execute(): Promise<TocEntryDto[]> {
    const all = await this.concepts.findAll();
    return all
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(toTocEntryDto);
  }
}
