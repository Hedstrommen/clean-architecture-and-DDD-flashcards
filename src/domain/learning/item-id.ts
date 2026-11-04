import { brandId, type Branded } from '../../core/ids.ts';

export type LearningItemId = Branded<string, 'LearningItemId'>;

export const learningItemId = (value: string): LearningItemId => brandId<'LearningItemId'>(value);
