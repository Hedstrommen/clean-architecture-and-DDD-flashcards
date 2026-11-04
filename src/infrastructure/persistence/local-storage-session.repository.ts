import { err, ok, type Result } from '../../core/result.ts';
import { NotFoundFailure, PersistenceFailure } from '../../core/failures.ts';
import type { SessionRepository } from '../../domain/learning/session.repository.ts';
import { LearningSession } from '../../domain/learning/session.entity.ts';
import { sessionId } from '../../domain/learning/session-id.ts';
import type { SessionId } from '../../domain/learning/session-id.ts';
import { Answer } from '../../domain/learning/answer.value-object.ts';
import { learningItemId } from '../../domain/learning/item-id.ts';

const STORAGE_KEY = 'ca-ddd-lab:sessions';

interface StoredAnswer {
  itemId: string;
  selectedIndex: number;
  correct: boolean;
  answeredAt: string;
}

interface StoredSession {
  id: string;
  mode: string;
  itemIds: string[];
  answers: StoredAnswer[];
  startedAt: string;
  completedAt: string | null;
}

const serialize = (session: LearningSession): StoredSession => ({
  id: session.id,
  mode: session.mode,
  itemIds: [...session.itemIds],
  answers: session.answers.map((a) => ({
    itemId: a.itemId,
    selectedIndex: a.selectedIndex,
    correct: a.correct,
    answeredAt: a.answeredAt.toISOString(),
  })),
  startedAt: session.startedAt.toISOString(),
  completedAt: session.completedAt?.toISOString() ?? null,
});

const deserialize = (raw: StoredSession): LearningSession =>
  LearningSession.restore({
    id: sessionId(raw.id),
    mode: raw.mode as LearningSession['mode'],
    itemIds: raw.itemIds.map(learningItemId),
    answers: raw.answers.map((a) =>
      Answer.create({
        itemId: learningItemId(a.itemId),
        selectedIndex: a.selectedIndex,
        correct: a.correct,
        answeredAt: new Date(a.answeredAt),
      }),
    ),
    startedAt: new Date(raw.startedAt),
    completedAt: raw.completedAt ? new Date(raw.completedAt) : null,
  });

export class LocalStorageSessionRepository implements SessionRepository {
  private readAll(): StoredSession[] {
    try {
      const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredSession[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(sessions: StoredSession[]): Result<StoredSession[], PersistenceFailure> {
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(sessions));
      return ok(sessions);
    } catch (e) {
      return err(new PersistenceFailure(e instanceof Error ? e.message : 'Failed to persist session.'));
    }
  }

  async save(session: LearningSession): Promise<Result<LearningSession, PersistenceFailure>> {
    const stored = serialize(session);
    const all = this.readAll().filter((s) => s.id !== stored.id);
    const writeResult = this.writeAll([...all, stored]);
    return writeResult.ok ? ok(session) : err(writeResult.error);
  }

  async findById(id: SessionId): Promise<Result<LearningSession, NotFoundFailure>> {
    const found = this.readAll().find((s) => s.id === id);
    return found ? ok(deserialize(found)) : err(new NotFoundFailure('session', id));
  }

  async findLatest(): Promise<Result<LearningSession, NotFoundFailure>> {
    const all = this.readAll().sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    const latest = all[0];
    return latest ? ok(deserialize(latest)) : err(new NotFoundFailure('session', 'latest'));
  }
}
