export abstract class AppFailure extends Error {
  abstract readonly code: string;
  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundFailure extends AppFailure {
  readonly code = 'NOT_FOUND';
  constructor(readonly resource: string, readonly id: string) {
    super(`${resource} with id "${id}" was not found.`);
  }
}

export class ValidationFailure extends AppFailure {
  readonly code = 'VALIDATION';
  constructor(readonly field: string, message: string) {
    super(`${field}: ${message}`);
  }
}

export class PersistenceFailure extends AppFailure {
  readonly code = 'PERSISTENCE';
  constructor(message: string) {
    super(message);
  }
}

export class SessionStateFailure extends AppFailure {
  readonly code = 'SESSION_STATE';
  constructor(message: string) {
    super(message);
  }
}
