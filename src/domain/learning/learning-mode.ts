export const LEARNING_MODES = ['flashcards', 'multiple-choice', 'drag-and-drop', 'mixed'] as const;

export type LearningMode = (typeof LEARNING_MODES)[number];

export const isLearningMode = (value: string): value is LearningMode =>
  (LEARNING_MODES as readonly string[]).includes(value);

export const learningModeLabel: Record<LearningMode, string> = {
  flashcards: 'Flashcards',
  'multiple-choice': 'Multiple Choice',
  'drag-and-drop': 'Drag & Drop',
  mixed: 'Mixed Mode',
};
