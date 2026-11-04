import type { ConceptCategory } from '../knowledge/concept-category.ts';
import type { LearningItemId } from './item-id.ts';

export interface MultipleChoiceQuestionProps {
  id: LearningItemId;
  prompt: string;
  options: readonly string[];
  correctIndex: number;
  explanation: string;
  category: ConceptCategory;
}

export class MultipleChoiceQuestion {
  private constructor(private readonly props: MultipleChoiceQuestionProps) {}

  static restore(props: MultipleChoiceQuestionProps): MultipleChoiceQuestion {
    if (props.correctIndex < 0 || props.correctIndex >= props.options.length) {
      throw new Error(`correctIndex ${props.correctIndex} out of range for question ${props.id}`);
    }
    return new MultipleChoiceQuestion(props);
  }

  get id(): LearningItemId {
    return this.props.id;
  }

  get prompt(): string {
    return this.props.prompt;
  }

  get options(): readonly string[] {
    return this.props.options;
  }

  get explanation(): string {
    return this.props.explanation;
  }

  get category(): ConceptCategory {
    return this.props.category;
  }

  isCorrect(optionIndex: number): boolean {
    return optionIndex === this.props.correctIndex;
  }

  get correctOption(): string {
    return this.props.options[this.props.correctIndex];
  }
}
