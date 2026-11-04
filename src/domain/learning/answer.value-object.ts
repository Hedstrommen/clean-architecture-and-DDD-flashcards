import type { LearningItemId } from './item-id.ts';

export interface AnswerProps {
  itemId: LearningItemId;
  selectedIndex: number;
  correct: boolean;
  answeredAt: Date;
}

export class Answer {
  private constructor(private readonly props: AnswerProps) {}

  static create(props: AnswerProps): Answer {
    return new Answer(props);
  }

  get itemId(): LearningItemId {
    return this.props.itemId;
  }

  get selectedIndex(): number {
    return this.props.selectedIndex;
  }

  get correct(): boolean {
    return this.props.correct;
  }

  get answeredAt(): Date {
    return this.props.answeredAt;
  }
}
