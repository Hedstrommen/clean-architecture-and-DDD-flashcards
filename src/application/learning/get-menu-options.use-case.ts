import type { LearningContentRepository } from '../../domain/learning/learning-content.repository.ts';
import { LEARNING_MODES, learningModeLabel, type LearningMode } from '../../domain/learning/learning-mode.ts';
import type { MenuOptionDto } from './dto/session.dto.ts';

const DESCRIPTIONS: Record<LearningMode, string> = {
  flashcards: 'Flip cards to test your recall of key terms and ideas.',
  'multiple-choice': 'Answer questions with instant feedback and explanations.',
  'drag-and-drop': 'Match terms to their definitions by dragging them into place.',
  mixed: 'A random mix of flashcards, questions and drag-and-drop pairs.',
};

export class GetMenuOptionsUseCase {
  constructor(private readonly content: LearningContentRepository) {}

  async execute(): Promise<MenuOptionDto[]> {
    const [flashcards, questions, pairs] = await Promise.all([
      this.content.getFlashcards(),
      this.content.getQuestions(),
      this.content.getDragDropPairs(),
    ]);
    const counts: Record<LearningMode, number> = {
      flashcards: flashcards.length,
      'multiple-choice': questions.length,
      'drag-and-drop': pairs.length,
      mixed: flashcards.length + questions.length + pairs.length,
    };
    return LEARNING_MODES.map((mode) => ({
      mode,
      label: learningModeLabel[mode],
      description: DESCRIPTIONS[mode],
      itemCount: counts[mode],
    }));
  }
}
