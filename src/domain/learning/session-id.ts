import { brandId, type Branded } from '../../core/ids.ts';

export type SessionId = Branded<string, 'SessionId'>;

export const sessionId = (value: string): SessionId => brandId<'SessionId'>(value);
