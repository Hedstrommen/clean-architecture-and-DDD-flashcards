import type { DragDropPair } from './dragdrop-pair.entity.ts';
import type { Flashcard } from './flashcard.entity.ts';
import type { MultipleChoiceQuestion } from './question.entity.ts';

export interface LearningContentRepository {
  getFlashcards(): Promise<Flashcard[]>;
  getQuestions(): Promise<MultipleChoiceQuestion[]>;
  getDragDropPairs(): Promise<DragDropPair[]>;
}
