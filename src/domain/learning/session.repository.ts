import type { Result } from '../../core/result.ts';
import type { NotFoundFailure, PersistenceFailure } from '../../core/failures.ts';
import type { LearningSession } from './session.entity.ts';
import type { SessionId } from './session-id.ts';

export interface SessionRepository {
  save(session: LearningSession): Promise<Result<LearningSession, PersistenceFailure>>;
  findById(id: SessionId): Promise<Result<LearningSession, NotFoundFailure>>;
  findLatest(): Promise<Result<LearningSession, NotFoundFailure>>;
}
