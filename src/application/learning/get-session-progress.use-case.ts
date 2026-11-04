import type { Result } from '../../core/result.ts';
import type { NotFoundFailure } from '../../core/failures.ts';
import type { SessionRepository } from '../../domain/learning/session.repository.ts';
import { sessionId } from '../../domain/learning/session-id.ts';
import type { SessionDto } from './dto/session.dto.ts';
import { toSessionDto } from './dto/session.dto.ts';

export class GetSessionProgressUseCase {
  constructor(private readonly sessions: SessionRepository) {}

  async execute(id: string): Promise<Result<SessionDto, NotFoundFailure>> {
    const result = await this.sessions.findById(sessionId(id));
    return result.ok ? { ok: true, value: toSessionDto(result.value) } : result;
  }
}
