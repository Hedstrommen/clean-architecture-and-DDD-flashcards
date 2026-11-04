import type { LearningSession } from '../../../domain/learning/session.entity.ts';
import type { LearningMode } from '../../../domain/learning/learning-mode.ts';
import type { ConceptCategory } from '../../../domain/knowledge/concept-category.ts';

export interface SessionDto {
  id: string;
  mode: LearningMode;
  itemIds: string[];
  answeredCount: number;
  totalCount: number;
  correctCount: number;
  score: number;
  progress: number;
  isComplete: boolean;
}

export type LearningItemDto =
  | {
      kind: 'flashcard';
      id: string;
      front: string;
      back: string;
      hint?: string;
      category: ConceptCategory;
    }
  | {
      kind: 'question';
      id: string;
      prompt: string;
      options: string[];
      explanation: string;
      category: ConceptCategory;
    }
  | {
      kind: 'dragdrop';
      id: string;
      term: string;
      definition: string;
      category: ConceptCategory;
    };

export interface SessionContentDto {
  session: SessionDto;
  items: LearningItemDto[];
}

export interface AnswerResultDto {
  itemId: string;
  selectedIndex: number;
  correct: boolean;
  explanation?: string;
  correctOption?: string;
  session: SessionDto;
}

export interface MenuOptionDto {
  mode: LearningMode;
  label: string;
  description: string;
  itemCount: number;
}

export const toSessionDto = (session: LearningSession): SessionDto => ({
  id: session.id,
  mode: session.mode,
  itemIds: [...session.itemIds],
  answeredCount: session.answeredCount,
  totalCount: session.totalCount,
  correctCount: session.correctCount,
  score: session.score,
  progress: session.progress,
  isComplete: session.isComplete,
});
