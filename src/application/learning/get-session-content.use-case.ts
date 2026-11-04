import type { Result } from '../../core/result.ts';
import type { NotFoundFailure } from '../../core/failures.ts';
import type { LearningContentRepository } from '../../domain/learning/learning-content.repository.ts';
import type { SessionRepository } from '../../domain/learning/session.repository.ts';
import { sessionId } from '../../domain/learning/session-id.ts';
import type { LearningItemDto, SessionContentDto } from './dto/session.dto.ts';
import { toSessionDto } from './dto/session.dto.ts';

export class GetSessionContentUseCase {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly content: LearningContentRepository,
  ) {}

  async execute(id: string): Promise<Result<SessionContentDto, NotFoundFailure>> {
    const sessionResult = await this.sessions.findById(sessionId(id));
    if (!sessionResult.ok) return sessionResult;
    const session = sessionResult.value;

    const [flashcards, questions, pairs] = await Promise.all([
      this.content.getFlashcards(),
      this.content.getQuestions(),
      this.content.getDragDropPairs(),
    ]);
    const byId = new Map<string, LearningItemDto>();
    for (const f of flashcards) {
      byId.set(f.id, {
        kind: 'flashcard',
        id: f.id,
        front: f.front,
        back: f.back,
        hint: f.hint,
        category: f.category,
      });
    }
    for (const q of questions) {
      byId.set(q.id, {
        kind: 'question',
        id: q.id,
        prompt: q.prompt,
        options: [...q.options],
        explanation: q.explanation,
        category: q.category,
      });
    }
    for (const p of pairs) {
      byId.set(p.id, {
        kind: 'dragdrop',
        id: p.id,
        term: p.term,
        definition: p.definition,
        category: p.category,
      });
    }

    const items: LearningItemDto[] = [];
    for (const itemId of session.itemIds) {
      const item = byId.get(itemId);
      if (item) items.push(item);
    }
    return { ok: true, value: { session: toSessionDto(session), items } };
  }
}
