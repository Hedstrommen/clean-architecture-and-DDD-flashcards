import { describe, expect, it } from 'vitest';
import { InMemoryConceptRepository } from '../../infrastructure/persistence/in-memory-concept.repository.ts';
import { InMemoryLearningContentRepository } from '../../infrastructure/persistence/in-memory-learning-content.repository.ts';
import { LocalStorageSessionRepository } from '../../infrastructure/persistence/local-storage-session.repository.ts';
import { SearchConceptsUseCase } from '../knowledge/search-concepts.use-case.ts';
import { GetTableOfContentsUseCase } from '../knowledge/get-table-of-contents.use-case.ts';
import { StartSessionUseCase } from './start-session.use-case.ts';
import { GetSessionContentUseCase } from './get-session-content.use-case.ts';
import { SubmitAnswerUseCase } from './submit-answer.use-case.ts';

const makeRepos = () => {
  const concepts = new InMemoryConceptRepository();
  const content = new InMemoryLearningContentRepository();
  const sessions = new LocalStorageSessionRepository();
  return { concepts, content, sessions };
};

describe('knowledge application services', () => {
  it('searches concepts case-insensitively and returns them ordered', async () => {
    const { concepts } = makeRepos();
    const useCase = new SearchConceptsUseCase(concepts);
    const all = await useCase.execute('');
    expect(all.length).toBeGreaterThan(10);
    const orders = all.map((c) => c.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));

    const dddResults = await useCase.execute('bounded context');
    expect(dddResults.some((c) => c.id === 'ddd-bounded-context')).toBe(true);
  });

  it('builds a table of contents with category info', async () => {
    const { concepts } = makeRepos();
    const useCase = new GetTableOfContentsUseCase(concepts);
    const toc = await useCase.execute();
    expect(toc.length).toBeGreaterThan(10);
    expect(toc.every((t) => t.id && t.title && t.category)).toBe(true);
  });
});

describe('learning application services', () => {
  it('runs a full multiple-choice session end to end', async () => {
    const { content, sessions } = makeRepos();
    const start = new StartSessionUseCase(content, sessions);
    const getContent = new GetSessionContentUseCase(sessions, content);
    const submit = new SubmitAnswerUseCase(sessions, content);

    const sessionResult = await start.execute('multiple-choice', () => 'test-session-1');
    expect(sessionResult.ok).toBe(true);
    if (!sessionResult.ok) return;
    const session = sessionResult.value;

    const loaded = await getContent.execute(session.id);
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    expect(loaded.value.items.length).toBe(session.totalCount);
    expect(loaded.value.items.every((i) => i.kind === 'question')).toBe(true);

    for (const item of loaded.value.items) {
      if (item.kind !== 'question') continue;
      const answer = await submit.execute({ sessionId: session.id, itemId: item.id, selectedIndex: 0 });
      expect(answer.ok).toBe(true);
    }

    const after = await getContent.execute(session.id);
    expect(after.ok && after.value.session.isComplete).toBe(true);
    expect(after.ok && after.value.session.answeredCount).toBe(session.totalCount);
  });

  it('grades drag-and-drop answers by matched pair id', async () => {
    const { content, sessions } = makeRepos();
    const start = new StartSessionUseCase(content, sessions);
    const submit = new SubmitAnswerUseCase(sessions, content);

    const sessionResult = await start.execute('drag-and-drop', () => 'test-session-2');
    if (!sessionResult.ok) throw new Error('session failed');
    const session = sessionResult.value;

    const right = await submit.execute({ sessionId: session.id, itemId: session.itemIds[0], selectedIndex: 0, matchedItemId: session.itemIds[0] });
    expect(right.ok && right.value.correct).toBe(true);

    const wrong = await submit.execute({ sessionId: session.id, itemId: session.itemIds[1], selectedIndex: 0, matchedItemId: session.itemIds[0] });
    expect(wrong.ok && wrong.value.correct).toBe(false);
  });

  it('rejects unknown modes', async () => {
    const { content, sessions } = makeRepos();
    const start = new StartSessionUseCase(content, sessions);
    const result = await start.execute('not-a-mode');
    expect(result.ok).toBe(false);
  });
});
