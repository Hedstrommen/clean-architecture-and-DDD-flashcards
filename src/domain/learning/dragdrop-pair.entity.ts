import type { ConceptCategory } from '../knowledge/concept-category.ts';
import type { LearningItemId } from './item-id.ts';

export interface DragDropPairProps {
  id: LearningItemId;
  term: string;
  definition: string;
  category: ConceptCategory;
}

export class DragDropPair {
  private constructor(private readonly props: DragDropPairProps) {}

  static restore(props: DragDropPairProps): DragDropPair {
    return new DragDropPair(props);
  }

  get id(): LearningItemId {
    return this.props.id;
  }

  get term(): string {
    return this.props.term;
  }

  get definition(): string {
    return this.props.definition;
  }

  get category(): ConceptCategory {
    return this.props.category;
  }
}
