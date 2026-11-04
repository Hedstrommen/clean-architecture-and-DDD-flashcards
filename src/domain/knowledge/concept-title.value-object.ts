import { err, ok, type Result } from '../../core/result.ts';
import { ValidationFailure } from '../../core/failures.ts';

export class ConceptTitle {
  private constructor(readonly value: string) {}

  static create(raw: string): Result<ConceptTitle, ValidationFailure> {
    const value = raw.trim();
    if (value.length < 3) {
      return err(new ValidationFailure('title', 'A concept title needs at least 3 characters.'));
    }
    if (value.length > 120) {
      return err(new ValidationFailure('title', 'A concept title may not exceed 120 characters.'));
    }
    return ok(new ConceptTitle(value));
  }
}
