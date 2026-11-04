export interface DomainEvent {
  readonly occurredAt: Date;
}

export class ConceptRead implements DomainEvent {
  readonly occurredAt = new Date();
  constructor(readonly conceptId: string) {}
}
