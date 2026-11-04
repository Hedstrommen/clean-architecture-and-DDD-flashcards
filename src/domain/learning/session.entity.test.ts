import { describe, expect, it } from 'vitest';
import { LearningSession } from './session.entity.ts';
import { sessionId } from './session-id.ts';
import { learningItemId } from './item-id.ts';

const items = [learningItemId('a'), learningItemId('b'), learningItemId('c')];

describe('LearningSession aggregate', () => {
  it('starts with zero answers and 0% progress', () => {
    const session = LearningSession.start(sessionId('s1'), 'mixed', items);
    expect(session.answeredCount).toBe(0);
    expect(session.progress).toBe(0);
    expect(session.isComplete).toBe(false);
  });

  it('rejects an empty item list', () => {
    expect(() => LearningSession.start(sessionId('s1'), 'mixed', [])).toThrow();
  });

  it('records answers and computes score and progress', () => {
    const session = LearningSession.start(sessionId('s1'), 'mixed', items);
    expect(session.recordAnswer(items[0], 1, true).ok).toBe(true);
    expect(session.recordAnswer(items[1], 0, false).ok).toBe(true);
    expect(session.answeredCount).toBe(2);
    expect(session.correctCount).toBe(1);
    expect(session.progress).toBe(67);
    expect(session.score).toBe(33);
  });

  it('refuses to answer the same item twice', () => {
    const session = LearningSession.start(sessionId('s1'), 'mixed', items);
    session.recordAnswer(items[0], 1, true);
    const second = session.recordAnswer(items[0], 0, false);
    expect(second.ok).toBe(false);
  });

  it('refuses items that do not belong to the session', () => {
    const session = LearningSession.start(sessionId('s1'), 'mixed', items);
    const result = session.recordAnswer(learningItemId('zzz'), 0, false);
    expect(result.ok).toBe(false);
  });

  it('cannot complete before all items are answered', () => {
    const session = LearningSession.start(sessionId('s1'), 'mixed', items);
    session.recordAnswer(items[0], 1, true);
    expect(session.complete().ok).toBe(false);
  });

  it('completes when all items are answered and then locks', () => {
    const session = LearningSession.start(sessionId('s1'), 'mixed', items);
    session.recordAnswer(items[0], 1, true);
    session.recordAnswer(items[1], 1, true);
    session.recordAnswer(items[2], 0, false);
    expect(session.complete().ok).toBe(true);
    expect(session.isComplete).toBe(true);
    expect(session.score).toBe(67);
    expect(session.recordAnswer(items[0], 0, false).ok).toBe(false);
    expect(session.complete().ok).toBe(false);
  });
});
