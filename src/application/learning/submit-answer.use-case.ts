import { err, type Result } from '../../core/result.ts';
import { NotFoundFailure, type AppFailure } from '../../core/failures.ts';
import type { LearningContentRepository } from '../../domain/learning/learning-content.repository.ts';
import type { SessionRepository } from '../../domain/learning/session.repository.ts';
import { sessionId } from '../../domain/learning/session-id.ts';
import { learningItemId, type LearningItemId } from '../../domain/learning/item-id.ts';
import type { AnswerResultDto } from './dto/session.dto.ts';
import { toSessionDto } from './dto/session.dto.ts';

export interface SubmitAnswerInput {
  sessionId: string;
  itemId: string;
  selectedIndex: number;
  matchedItemId?: string;
}

type ContentItem =
  | { kind: 'flashcard'; correct: (selectedIndex: number) => boolean; explanation?: string; correctOption?: string }
  | { kind: 'question'; correct: (selectedIndex: number) => boolean; explanation?: string; correctOption?: string }
  | { kind: 'dragdrop'; correct: (matchedItemId?: string) => boolean; explanation?: string; correctOption?: string };

export class SubmitAnswerUseCase {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly content: LearningContentRepository,
  ) {}

  async execute(input: SubmitAnswerInput): Promise<Result<AnswerResultDto, AppFailure>> {
    const sessionResult = await this.sessions.findById(sessionId(input.sessionId));
    if (!sessionResult.ok) return sessionResult;
    const session = sessionResult.value;

    const itemId = learningItemId(input.itemId);
    const item = await this.findItem(itemId);
    if (!item) return err(new NotFoundFailure('learning item', input.itemId));

    const correct = this.grade(item, input);
    const explanation = item.explanation;
    const correctOption = item.correctOption;
    const answerResult = session.recordAnswer(itemId, input.selectedIndex, correct);
    if (!answerResult.ok) return err(answerResult.error);

    if (session.answeredCount === session.totalCount) {
      const completed = session.complete();
      if (!completed.ok) return err(completed.error);
    }

    const saved = await this.sessions.save(session);
    if (!saved.ok) return err(saved.error);

    return {
      ok: true,
      value: {
        itemId: input.itemId,
        selectedIndex: input.selectedIndex,
        correct,
        explanation,
        correctOption,
        session: toSessionDto(saved.value),
      },
    };
  }

  private async findItem(itemId: LearningItemId): Promise<ContentItem | undefined> {
    const [flashcards, questions, pairs] = await Promise.all([
      this.content.getFlashcards(),
      this.content.getQuestions(),
      this.content.getDragDropPairs(),
    ]);
    const flashcard = flashcards.find((f) => f.id === itemId);
    if (flashcard) {
      return { kind: 'flashcard', correct: (selectedIndex) => selectedIndex === 1 };
    }
    const question = questions.find((q) => q.id === itemId);
    if (question) {
      return {
        kind: 'question',
        correct: (selectedIndex) => question.isCorrect(selectedIndex),
        explanation: question.explanation,
        correctOption: question.correctOption,
      };
    }
    const pair = pairs.find((p) => p.id === itemId);
    if (pair) {
      return {
        kind: 'dragdrop',
        correct: (matchedItemId) => matchedItemId === pair.id,
      };
    }
    return undefined;
  }

  private grade(item: ContentItem, input: SubmitAnswerInput): boolean {
    if (item.kind === 'dragdrop') return item.correct(input.matchedItemId);
    return item.correct(input.selectedIndex);
  }
}
