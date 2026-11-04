import { Container } from '../../core/di.ts';
import type { ConceptRepository } from '../../domain/knowledge/concept.repository.ts';
import type { SessionRepository } from '../../domain/learning/session.repository.ts';
import type { LearningContentRepository } from '../../domain/learning/learning-content.repository.ts';
import { InMemoryConceptRepository } from '../persistence/in-memory-concept.repository.ts';
import { InMemoryLearningContentRepository } from '../persistence/in-memory-learning-content.repository.ts';
import { LocalStorageSessionRepository } from '../persistence/local-storage-session.repository.ts';
import { SearchConceptsUseCase } from '../../application/knowledge/search-concepts.use-case.ts';
import { GetTableOfContentsUseCase } from '../../application/knowledge/get-table-of-contents.use-case.ts';
import { GetConceptUseCase } from '../../application/knowledge/get-concept.use-case.ts';
import { GetMenuOptionsUseCase } from '../../application/learning/get-menu-options.use-case.ts';
import { StartSessionUseCase } from '../../application/learning/start-session.use-case.ts';
import { GetSessionContentUseCase } from '../../application/learning/get-session-content.use-case.ts';
import { SubmitAnswerUseCase } from '../../application/learning/submit-answer.use-case.ts';
import { GetSessionProgressUseCase } from '../../application/learning/get-session-progress.use-case.ts';

export const TOKENS = {
  ConceptRepository: Symbol('ConceptRepository'),
  SessionRepository: Symbol('SessionRepository'),
  LearningContentRepository: Symbol('LearningContentRepository'),
  SearchConceptsUseCase: Symbol('SearchConceptsUseCase'),
  GetTableOfContentsUseCase: Symbol('GetTableOfContentsUseCase'),
  GetConceptUseCase: Symbol('GetConceptUseCase'),
  GetMenuOptionsUseCase: Symbol('GetMenuOptionsUseCase'),
  StartSessionUseCase: Symbol('StartSessionUseCase'),
  GetSessionContentUseCase: Symbol('GetSessionContentUseCase'),
  SubmitAnswerUseCase: Symbol('SubmitAnswerUseCase'),
  GetSessionProgressUseCase: Symbol('GetSessionProgressUseCase'),
} as const;

export type AppContainer = Container;

export const createContainer = (): Container => {
  const container = new Container();

  container.registerSingleton(TOKENS.ConceptRepository, () => new InMemoryConceptRepository());
  container.registerSingleton(TOKENS.LearningContentRepository, () => new InMemoryLearningContentRepository());
  container.registerSingleton(TOKENS.SessionRepository, () => new LocalStorageSessionRepository());

  container.register(TOKENS.SearchConceptsUseCase, () => new SearchConceptsUseCase(container.resolve<ConceptRepository>(TOKENS.ConceptRepository)));
  container.register(TOKENS.GetTableOfContentsUseCase, () => new GetTableOfContentsUseCase(container.resolve<ConceptRepository>(TOKENS.ConceptRepository)));
  container.register(TOKENS.GetConceptUseCase, () => new GetConceptUseCase(container.resolve<ConceptRepository>(TOKENS.ConceptRepository)));
  container.register(TOKENS.GetMenuOptionsUseCase, () => new GetMenuOptionsUseCase(container.resolve<LearningContentRepository>(TOKENS.LearningContentRepository)));
  container.register(TOKENS.StartSessionUseCase, () =>
    new StartSessionUseCase(
      container.resolve<LearningContentRepository>(TOKENS.LearningContentRepository),
      container.resolve<SessionRepository>(TOKENS.SessionRepository),
    ),
  );
  container.register(TOKENS.GetSessionContentUseCase, () =>
    new GetSessionContentUseCase(
      container.resolve<SessionRepository>(TOKENS.SessionRepository),
      container.resolve<LearningContentRepository>(TOKENS.LearningContentRepository),
    ),
  );
  container.register(TOKENS.SubmitAnswerUseCase, () =>
    new SubmitAnswerUseCase(
      container.resolve<SessionRepository>(TOKENS.SessionRepository),
      container.resolve<LearningContentRepository>(TOKENS.LearningContentRepository),
    ),
  );
  container.register(TOKENS.GetSessionProgressUseCase, () =>
    new GetSessionProgressUseCase(container.resolve<SessionRepository>(TOKENS.SessionRepository)),
  );

  return container;
};
