import type { ConceptCategory } from '../knowledge/concept-category.ts';
import type { LearningItemId } from './item-id.ts';

export interface FlashcardProps {
  id: LearningItemId;
  front: string;
  back: string;
  category: ConceptCategory;
  hint?: string;
}

export class Flashcard {
  private constructor(private readonly props: FlashcardProps) {}

  static restore(props: FlashcardProps): Flashcard {
    return new Flashcard(props);
  }

  get id(): LearningItemId {
    return this.props.id;
  }

  get front(): string {
    return this.props.front;
  }

  get back(): string {
    return this.props.back;
  }

  get category(): ConceptCategory {
    return this.props.category;
  }

  get hint(): string | undefined {
    return this.props.hint;
  }
}
