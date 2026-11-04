import { err, ok, type Result } from '../../core/result.ts';
import { ValidationFailure, type PersistenceFailure } from '../../core/failures.ts';
import type { LearningContentRepository } from '../../domain/learning/learning-content.repository.ts';
import type { SessionRepository } from '../../domain/learning/session.repository.ts';
import { LearningSession } from '../../domain/learning/session.entity.ts';
import { sessionId } from '../../domain/learning/session-id.ts';
import { learningItemId, type LearningItemId } from '../../domain/learning/item-id.ts';
import { isLearningMode, type LearningMode } from '../../domain/learning/learning-mode.ts';
import { toSessionDto, type SessionDto } from './dto/session.dto.ts';

const shuffle = <T>(items: readonly T[]): T[] => {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export class StartSessionUseCase {
  constructor(
    private readonly content: LearningContentRepository,
    private readonly sessions: SessionRepository,
  ) {}

  async execute(mode: string, idGenerator: () => string = () => crypto.randomUUID()): Promise<Result<SessionDto, ValidationFailure | PersistenceFailure>> {
    if (!isLearningMode(mode)) {
      return err(new ValidationFailure('mode', `Unknown learning mode "${mode}".`));
    }
    const itemIds = await this.collectItemIds(mode as LearningMode);
    if (itemIds.length === 0) {
      return err(new ValidationFailure('mode', `No learning content available for mode "${mode}".`));
    }
    const session = LearningSession.start(sessionId(idGenerator()), mode as LearningMode, itemIds);
    const saved = await this.sessions.save(session);
    if (!saved.ok) return err(saved.error);
    return ok(toSessionDto(saved.value));
  }

  private async collectItemIds(mode: LearningMode): Promise<LearningItemId[]> {
    const [flashcards, questions, pairs] = await Promise.all([
      this.content.getFlashcards(),
      this.content.getQuestions(),
      this.content.getDragDropPairs(),
    ]);
    const byMode: Record<LearningMode, LearningItemId[]> = {
      flashcards: flashcards.map((f) => f.id),
      'multiple-choice': questions.map((q) => q.id),
      'drag-and-drop': pairs.map((p) => p.id),
      mixed: shuffle([...flashcards, ...questions, ...pairs].map((item) => learningItemId(item.id))),
    };
    return mode === 'mixed' ? byMode.mixed : shuffle(byMode[mode]);
  }
}
