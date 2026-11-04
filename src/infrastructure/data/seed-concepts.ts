import { conceptId } from '../../domain/knowledge/concept-id.ts';
import { Concept } from '../../domain/knowledge/concept.entity.ts';
import { ConceptTitle } from '../../domain/knowledge/concept-title.value-object.ts';

interface SeedConcept {
  id: string;
  title: string;
  category: 'clean-architecture' | 'ddd' | 'both';
  summary: string;
  body: string;
  tags: string[];
  order: number;
}

const SEED: SeedConcept[] = [
  {
    id: 'ca-dependency-rule',
    title: 'The Dependency Rule',
    category: 'clean-architecture',
    summary:
      'Source code dependencies may only point inward. Inner circles know nothing about outer circles.',
    body: `The Dependency Rule is the backbone of Clean Architecture: dependencies in source code can only point inward, toward higher-level policies.

Anything declared in an outer circle must not be referenced by an inner circle. Names, classes, functions and modules in outer layers are invisible to inner layers.

The usual escape hatch is the Dependency Inversion Principle: inner layers define interfaces (ports) and outer layers implement them (adapters), so the dependency still points inward at the source-code level.`,
    tags: ['dependency rule', 'inward', 'DIP', 'layers'],
    order: 1,
  },
  {
    id: 'ca-layers',
    title: 'The Four Layers',
    category: 'clean-architecture',
    summary:
      'Entities, Use Cases, Interface Adapters and Frameworks & Drivers — each with a single responsibility.',
    body: `Clean Architecture organizes code into concentric layers:

1. Entities — enterprise-wide business rules, the most stable code.
2. Use Cases — application-specific business rules that orchestrate entities.
3. Interface Adapters — controllers, presenters and gateways that convert data between use cases and external formats.
4. Frameworks & Drivers — web frameworks, databases, UI and other details that are kept at the outside.

Each layer may only depend on the layers inside it.`,
    tags: ['layers', 'entities', 'use cases', 'adapters', 'frameworks'],
    order: 2,
  },
  {
    id: 'ca-entities',
    title: 'Entities',
    category: 'clean-architecture',
    summary:
      'Enterprise business rules: objects with identity and lifecycle that encapsulate the most general rules.',
    body: `Entities encapsulate Enterprise Business Rules — the rules that would exist even if the application did not.

An entity has an identity that persists across state changes and often a lifecycle. In Clean Architecture, entities sit in the innermost circle and must not depend on any framework, database or UI concern.

They can be plain objects, classes or modules — what matters is that they contain the highest-level rules and know nothing about the outside world.`,
    tags: ['entities', 'enterprise rules', 'innermost layer'],
    order: 3,
  },
  {
    id: 'ca-use-cases',
    title: 'Use Cases',
    category: 'clean-architecture',
    summary:
      'Application business rules that orchestrate entities and define the operations the system supports.',
    body: `A use case represents a single application-specific business rule: one thing the user can do with the system, such as "place an order" or "register a student".

Use cases orchestrate the flow of data to and from entities and direct entities to use their enterprise rules. They live in the second layer and depend only on the entity layer.

Use cases communicate with outer layers exclusively through interfaces they define themselves, so the use case layer never depends on a controller, presenter or database.`,
    tags: ['use cases', 'application rules', 'orchestration'],
    order: 4,
  },
  {
    id: 'ca-interface-adapters',
    title: 'Interface Adapters',
    category: 'clean-architecture',
    summary:
      'Controllers, presenters and gateways that convert data between use-case format and external format.',
    body: `The interface adapter layer converts data from the format most convenient for use cases and entities into the format most convenient for external agents such as a database or the web.

It contains:
- Controllers that take input from the UI and hand it to use cases.
- Presenters that format use-case output for the UI.
- Gateways that implement the repository interfaces defined by the inner layers.

No code from the inner layers leaks into this layer; all conversion happens here.`,
    tags: ['controllers', 'presenters', 'gateways', 'conversion'],
    order: 5,
  },
  {
    id: 'ca-frameworks-drivers',
    title: 'Frameworks & Drivers',
    category: 'clean-architecture',
    summary:
      'The outermost layer: databases, web frameworks, UI and devices. Details that you can swap out.',
    body: `The outermost circle contains frameworks and drivers: the database, the web framework, the UI toolkit, external devices and APIs.

This is where most of the glue code lives, and it is the least important part of the system from a business perspective. The goal is to keep these details out of the inner circles so they can be replaced without touching business rules.

Typically very little code is written here — mostly code that passes data to the next circle inward.`,
    tags: ['frameworks', 'drivers', 'outermost layer', 'details'],
    order: 6,
  },
  {
    id: 'ddd-ubiquitous-language',
    title: 'Ubiquitous Language',
    category: 'ddd',
    summary:
      'A shared, precise vocabulary used by developers and domain experts in code, speech and models.',
    body: `Ubiquitous Language is the practice of building one rigorous vocabulary shared by everyone on the project — developers, domain experts, testers and stakeholders.

The same terms appear in conversations, diagrams, tests and source code. When the code says Order.cancel() and the business also says "cancel an order", there is no translation loss.

The language is not imposed top-down; it emerges from collaboration and is refined continuously as the domain understanding deepens.`,
    tags: ['ubiquitous language', 'vocabulary', 'communication', 'strategic'],
    order: 7,
  },
  {
    id: 'ddd-bounded-context',
    title: 'Bounded Context',
    category: 'ddd',
    summary:
      'An explicit boundary within which a domain model and its ubiquitous language are consistent.',
    body: `A Bounded Context defines the boundary within which a particular domain model applies. Inside the boundary, every term of the ubiquitous language has one unambiguous meaning.

The same word can mean different things in different contexts — a "Customer" in Sales is not the same model as a "Customer" in Support. Each meaning gets its own bounded context.

Bounded contexts are connected through a Context Map, which documents the relationships and integration patterns between them.`,
    tags: ['bounded context', 'context map', 'strategic design', 'boundaries'],
    order: 8,
  },
  {
    id: 'ddd-aggregate',
    title: 'Aggregates',
    category: 'ddd',
    summary:
      'A cluster of domain objects treated as one unit, guarded by a single aggregate root.',
    body: `An Aggregate is a cluster of entities and value objects that are treated as a single unit for data changes. Each aggregate has one root — the only member that outside objects are allowed to hold references to.

The aggregate root enforces all invariants of the cluster: no change to any object inside the aggregate may violate the business rules, and this guarantee is the responsibility of the root.

Aggregates should be small. References between aggregates go through identifiers, not object references, which keeps boundaries clean and transactions simple.`,
    tags: ['aggregate', 'aggregate root', 'invariants', 'consistency boundary'],
    order: 9,
  },
  {
    id: 'ddd-entity-vs-value-object',
    title: 'Entities vs Value Objects',
    category: 'ddd',
    summary:
      'Entities have identity and a lifecycle; value objects are defined only by their attributes.',
    body: `An Entity is an object with a unique identity that runs through its lifecycle. Two entities with the same attribute values are still different objects if their identities differ — equality is by identity.

A Value Object has no identity; it is defined entirely by its attributes. Two value objects with the same values are equal and interchangeable — think of Money, Address or DateRange.

Value objects should be immutable and encapsulate the validation and behavior related to their values. Prefer value objects over entities whenever identity is not needed.`,
    tags: ['entity', 'value object', 'identity', 'equality', 'immutability'],
    order: 10,
  },
  {
    id: 'ddd-repository',
    title: 'Repositories',
    category: 'ddd',
    summary:
      'A domain-level abstraction for storing and retrieving aggregates, hiding persistence details.',
    body: `A Repository mediates between the domain and the data-mapping layers using a collection-like interface for accessing domain objects.

From the domain's perspective, a repository is just a place where aggregates can be saved and retrieved — as if they were an in-memory collection. The domain defines the interface; infrastructure provides the implementation.

Repositories work on aggregates: you fetch and store whole aggregate roots, never individual inner objects, which keeps invariants intact.`,
    tags: ['repository', 'persistence', 'aggregate', 'port'],
    order: 11,
  },
  {
    id: 'ddd-domain-events',
    title: 'Domain Events',
    category: 'ddd',
    summary:
      'Something that happened in the domain that other parts may need to react to, captured as a fact.',
    body: `A Domain Event records something that happened in the domain that other parts of the system may care about — for example OrderPlaced or PaymentReceived.

Events are named in the past tense, are immutable facts, and carry the data needed by interested parties. They let bounded contexts react to each other without direct coupling.

Publishing domain events decouples the side effects from the business operation and makes the flow of the domain explicit and traceable.`,
    tags: ['domain events', 'event-driven', 'decoupling', 'integration'],
    order: 12,
  },
  {
    id: 'both-hexagonal',
    title: 'Hexagonal Architecture (Ports & Adapters)',
    category: 'both',
    summary:
      'The shared root of Clean Architecture and DDD: the domain core talks to the world through ports.',
    body: `Hexagonal Architecture — also called Ports and Adapters — puts the application core in the center and connects it to the outside world through ports (interfaces) and adapters (implementations).

Driving adapters (e.g. a web UI or a test) call ports on the inside; driven adapters (e.g. a database or an external API) implement ports defined by the inside.

Clean Architecture is essentially hexagonal architecture with explicit layering inside the core, and DDD supplies the modeling language for what goes into that core. The Dependency Rule and the ports idea are the same principle seen from two angles.`,
    tags: ['hexagonal', 'ports and adapters', 'architecture', 'shared foundation'],
    order: 13,
  },
  {
    id: 'both-ca-ddd-combined',
    title: 'Clean Architecture + DDD Combined',
    category: 'both',
    summary:
      'DDD inside each Clean Architecture layer: bounded contexts as modules, aggregates as entities and use cases.',
    body: `Combining both approaches: each Bounded Context becomes a module that contains its own Clean Architecture layers.

Typical mapping:
- Entities layer → Aggregates, Entities and Value Objects of the domain.
- Use Cases layer → Application services that orchestrate one bounded context.
- Interface Adapters layer → Controllers, presenters and repository adapters.
- Frameworks & Drivers layer → Database, web and messaging infrastructure.

The result: business rules modeled with DDD concepts sit in the protected inner circles, while all technical details stay outside — and each bounded context can evolve independently.`,
    tags: ['combination', 'bounded context', 'mapping', 'modular monolith'],
    order: 14,
  },
];

export const seedConcepts: Concept[] = SEED.map((c) => {
  const title = ConceptTitle.create(c.title);
  if (!title.ok) throw new Error(title.error.message);
  return Concept.restore({
    id: conceptId(c.id),
    title: title.value,
    category: c.category,
    summary: c.summary,
    body: c.body,
    tags: c.tags,
    order: c.order,
  });
});
