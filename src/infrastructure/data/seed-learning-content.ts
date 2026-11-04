import { learningItemId } from '../../domain/learning/item-id.ts';
import { Flashcard, type FlashcardProps } from '../../domain/learning/flashcard.entity.ts';
import { MultipleChoiceQuestion, type MultipleChoiceQuestionProps } from '../../domain/learning/question.entity.ts';
import { DragDropPair, type DragDropPairProps } from '../../domain/learning/dragdrop-pair.entity.ts';

type FlashcardSeed = Omit<FlashcardProps, 'id'> & { id: string };
type QuestionSeed = Omit<MultipleChoiceQuestionProps, 'id'> & { id: string };
type PairSeed = Omit<DragDropPairProps, 'id'> & { id: string };

const flashcardSeeds: FlashcardSeed[] = [
  { id: 'fc-1', front: 'Which direction may source-code dependencies point in Clean Architecture?', back: 'Only inward — from outer layers toward the inner circles.', category: 'clean-architecture', hint: 'Think about circles.' },
  { id: 'fc-2', front: 'Name the four Clean Architecture layers from inside to outside.', back: 'Entities, Use Cases, Interface Adapters, Frameworks & Drivers.', category: 'clean-architecture' },
  { id: 'fc-3', front: 'What lives in the innermost layer of Clean Architecture?', back: 'Entities — enterprise-wide business rules that know nothing about frameworks or UI.', category: 'clean-architecture' },
  { id: 'fc-4', front: 'What is a use case in Clean Architecture?', back: 'An application-specific business rule that orchestrates entities — one operation the system supports.', category: 'clean-architecture' },
  { id: 'fc-5', front: 'What is the role of the interface adapter layer?', back: 'To convert data between the format used by use cases/entities and the format used by external agents (UI, database).', category: 'clean-architecture' },
  { id: 'fc-6', front: 'What is the Ubiquitous Language in DDD?', back: 'One shared, precise vocabulary used in speech, models, tests and code by the whole team.', category: 'ddd' },
  { id: 'fc-7', front: 'What is a Bounded Context?', back: 'An explicit boundary within which a domain model and its language have one consistent meaning.', category: 'ddd' },
  { id: 'fc-8', front: 'What is an Aggregate and what is its root?', back: 'A cluster of domain objects treated as one unit; the aggregate root is the single entry point that enforces the invariants.', category: 'ddd' },
  { id: 'fc-9', front: 'Entity vs Value Object — how do you tell them apart?', back: 'Entities have identity and equality by identity; value objects have no identity and equality by attributes.', category: 'ddd' },
  { id: 'fc-10', front: 'Who defines the repository interface in DDD — domain or infrastructure?', back: 'The domain defines it; infrastructure implements it (a driven port).', category: 'ddd' },
  { id: 'fc-11', front: 'How should a Domain Event be named?', back: 'In the past tense, as an immutable fact — e.g. OrderPlaced.', category: 'ddd' },
  { id: 'fc-12', front: 'What do Clean Architecture and DDD share at their root?', back: 'Hexagonal architecture: the domain core talks to the world only through ports and adapters.', category: 'both' },
];

export const seedFlashcards: Flashcard[] = flashcardSeeds.map((c) =>
  Flashcard.restore({ ...c, id: learningItemId(c.id) }),
);

const questionSeeds: QuestionSeed[] = [
  {
    id: 'q-1',
    prompt: 'An outer layer needs a capability from an inner layer. What is the Clean Architecture solution?',
    options: [
      'Import the inner class directly into the outer layer',
      'Define an interface in the inner layer and let the outer layer implement it (Dependency Inversion)',
      'Move the capability to the outermost layer',
      'Duplicate the code in both layers',
    ],
    correctIndex: 1,
    explanation: 'Inner layers define ports; outer layers provide adapters. The source-code dependency still points inward.',
    category: 'clean-architecture',
  },
  {
    id: 'q-2',
    prompt: 'Which layer contains controllers, presenters and gateways?',
    options: ['Entities', 'Use Cases', 'Interface Adapters', 'Frameworks & Drivers'],
    correctIndex: 2,
    explanation: 'Interface adapters convert data between the inner use-case format and external formats.',
    category: 'clean-architecture',
  },
  {
    id: 'q-3',
    prompt: 'Where should validation of a business invariant of an order aggregate live?',
    options: [
      'In the database constraints only',
      'In the web controller',
      'Inside the aggregate root of the order aggregate',
      'In the UI form',
    ],
    correctIndex: 2,
    explanation: 'The aggregate root enforces all invariants of its cluster, no matter how data arrives.',
    category: 'ddd',
  },
  {
    id: 'q-4',
    prompt: 'Two "Customer" models exist — one in Sales, one in Support. What DDD concept explains this?',
    options: ['Polymorphism', 'Bounded Context', 'Inheritance', 'Singleton'],
    correctIndex: 1,
    explanation: 'Each bounded context gives the term its own unambiguous meaning; a context map documents the relationships.',
    category: 'ddd',
  },
  {
    id: 'q-5',
    prompt: 'Which statement about Value Objects is true?',
    options: [
      'They have a unique identity',
      'They are compared by their attribute values',
      'They change state over time',
      'They must be stored in their own database table',
    ],
    correctIndex: 1,
    explanation: 'Value objects are immutable and equal when all attributes are equal.',
    category: 'ddd',
  },
  {
    id: 'q-6',
    prompt: 'In Clean Architecture, may a use case import a database client?',
    options: ['Yes, if it is convenient', 'No — only via an interface it defines itself', 'Only in the outermost layer', 'Yes, in tests only'],
    correctIndex: 1,
    explanation: 'Use cases depend on abstractions they own; the concrete database adapter lives in an outer layer.',
    category: 'clean-architecture',
  },
  {
    id: 'q-7',
    prompt: 'What is the main purpose of Domain Events?',
    options: [
      'To speed up the database',
      'To decouple parts of the domain by publishing facts others can react to',
      'To replace repositories',
      'To cache user input',
    ],
    correctIndex: 1,
    explanation: 'Events are immutable past-tense facts that let bounded contexts react without direct coupling.',
    category: 'ddd',
  },
  {
    id: 'q-8',
    prompt: 'In a Clean Architecture + DDD combination, what typically maps to the Entities layer?',
    options: [
      'The web framework',
      'Aggregates, entities and value objects of the bounded context',
      'The SQL schema',
      'The HTTP routes',
    ],
    correctIndex: 1,
    explanation: 'DDD domain models fill the inner circles; each bounded context can be a module with its own layers.',
    category: 'both',
  },
  {
    id: 'q-9',
    prompt: 'Repositories in DDD primarily operate on…',
    options: ['Individual rows', 'Whole aggregate roots', 'UI components', 'HTTP requests'],
    correctIndex: 1,
    explanation: 'You store and fetch whole aggregates so invariants stay intact.',
    category: 'ddd',
  },
  {
    id: 'q-10',
    prompt: 'Which of these belongs to the Frameworks & Drivers layer?',
    options: [
      'The pricing business rule',
      'The order aggregate',
      'The web framework and database',
      'The place-order use case',
    ],
    correctIndex: 2,
    explanation: 'Frameworks & Drivers is the outermost circle of replaceable technical details.',
    category: 'clean-architecture',
  },
];

export const seedQuestions: MultipleChoiceQuestion[] = questionSeeds.map((q) =>
  MultipleChoiceQuestion.restore({ ...q, id: learningItemId(q.id) }),
);

const pairSeeds: PairSeed[] = [
  { id: 'dd-1', term: 'Dependency Rule', definition: 'Dependencies may only point inward', category: 'clean-architecture' },
  { id: 'dd-2', term: 'Use Case', definition: 'Application-specific business rule', category: 'clean-architecture' },
  { id: 'dd-3', term: 'Interface Adapter', definition: 'Converts data between use cases and external formats', category: 'clean-architecture' },
  { id: 'dd-4', term: 'Ubiquitous Language', definition: 'Shared vocabulary used in code and speech', category: 'ddd' },
  { id: 'dd-5', term: 'Bounded Context', definition: 'Boundary where the domain model has one meaning', category: 'ddd' },
  { id: 'dd-6', term: 'Aggregate Root', definition: 'Single entry point enforcing the aggregate invariants', category: 'ddd' },
  { id: 'dd-7', term: 'Value Object', definition: 'Immutable object compared by its attributes', category: 'ddd' },
  { id: 'dd-8', term: 'Domain Event', definition: 'Immutable past-tense fact others can react to', category: 'ddd' },
  { id: 'dd-9', term: 'Repository', definition: 'Collection-like access to whole aggregates', category: 'ddd' },
  { id: 'dd-10', term: 'Port', definition: 'Interface defined by the inner core, implemented outside', category: 'both' },
];

export const seedDragDropPairs: DragDropPair[] = pairSeeds.map((p) =>
  DragDropPair.restore({ ...p, id: learningItemId(p.id) }),
);
