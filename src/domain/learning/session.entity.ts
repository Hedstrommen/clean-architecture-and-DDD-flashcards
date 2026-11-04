import { err, ok, type Result } from '../../core/result.ts';
import { SessionStateFailure } from '../../core/failures.ts';
import { Answer } from './answer.value-object.ts';
import type { LearningItemId } from './item-id.ts';
import type { LearningMode } from './learning-mode.ts';
import type { SessionId } from './session-id.ts';

export interface SessionProps {
  id: SessionId;
  mode: LearningMode;
  itemIds: readonly LearningItemId[];
  answers: readonly Answer[];
  startedAt: Date;
  completedAt: Date | null;
}

export class LearningSession {
  private constructor(private props: SessionProps) {}

  static start(id: SessionId, mode: LearningMode, itemIds: readonly LearningItemId[], now = new Date()): LearningSession {
    if (itemIds.length === 0) {
      throw new SessionStateFailure('A learning session needs at least one item.');
    }
    return new LearningSession({ id, mode, itemIds, answers: [], startedAt: now, completedAt: null });
  }

  static restore(props: SessionProps): LearningSession {
    return new LearningSession({ ...props });
  }

  get id(): SessionId {
    return this.props.id;
  }

  get mode(): LearningMode {
    return this.props.mode;
  }

  get itemIds(): readonly LearningItemId[] {
    return this.props.itemIds;
  }

  get answers(): readonly Answer[] {
    return this.props.answers;
  }

  get startedAt(): Date {
    return this.props.startedAt;
  }

  get completedAt(): Date | null {
    return this.props.completedAt;
  }

  get isComplete(): boolean {
    return this.props.completedAt !== null;
  }

  get totalCount(): number {
    return this.props.itemIds.length;
  }

  get answeredCount(): number {
    return this.props.answers.length;
  }

  get correctCount(): number {
    return this.props.answers.filter((a) => a.correct).length;
  }

  get score(): number {
    if (this.totalCount === 0) return 0;
    return Math.round((this.correctCount / this.totalCount) * 100);
  }

  get progress(): number {
    if (this.totalCount === 0) return 0;
    return Math.round((this.answeredCount / this.totalCount) * 100);
  }

  hasAnswered(itemId: LearningItemId): boolean {
    return this.props.answers.some((a) => a.itemId === itemId);
  }

  answerFor(itemId: LearningItemId): Answer | undefined {
    return this.props.answers.find((a) => a.itemId === itemId);
  }

  recordAnswer(itemId: LearningItemId, selectedIndex: number, correct: boolean, now = new Date()): Result<Answer, SessionStateFailure> {
    if (this.isComplete) {
      return err(new SessionStateFailure('The session is already completed.'));
    }
    if (!this.props.itemIds.includes(itemId)) {
      return err(new SessionStateFailure(`Item ${itemId} does not belong to this session.`));
    }
    if (this.hasAnswered(itemId)) {
      return err(new SessionStateFailure(`Item ${itemId} has already been answered.`));
    }
    const answer = Answer.create({ itemId, selectedIndex, correct, answeredAt: now });
    this.props = { ...this.props, answers: [...this.props.answers, answer] };
    return ok(answer);
  }

  complete(now = new Date()): Result<LearningSession, SessionStateFailure> {
    if (this.isComplete) {
      return err(new SessionStateFailure('The session is already completed.'));
    }
    if (this.answeredCount !== this.totalCount) {
      return err(new SessionStateFailure('Cannot complete a session before all items are answered.'));
    }
    this.props = { ...this.props, completedAt: now };
    return ok(this);
  }
}
