import type { ConceptCategory } from './concept-category.ts';
import type { ConceptId } from './concept-id.ts';
import type { ConceptTitle } from './concept-title.value-object.ts';

export interface ConceptProps {
  id: ConceptId;
  title: ConceptTitle;
  category: ConceptCategory;
  summary: string;
  body: string;
  tags: string[];
  order: number;
}

export class Concept {
  private constructor(private readonly props: ConceptProps) {}

  static restore(props: ConceptProps): Concept {
    return new Concept(props);
  }

  get id(): ConceptId {
    return this.props.id;
  }

  get title(): string {
    return this.props.title.value;
  }

  get category(): ConceptCategory {
    return this.props.category;
  }

  get summary(): string {
    return this.props.summary;
  }

  get body(): string {
    return this.props.body;
  }

  get tags(): readonly string[] {
    return this.props.tags;
  }

  get order(): number {
    return this.props.order;
  }

  matchesQuery(query: string): boolean {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return true;
    const haystack = [this.title, this.summary, this.body, ...this.tags]
      .join('\n')
      .toLowerCase();
    return q.split(/\s+/).every((token) => haystack.includes(token));
  }
}
