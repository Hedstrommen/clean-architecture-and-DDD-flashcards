import type { LearningContentRepository } from '../../domain/learning/learning-content.repository.ts';
import { seedDragDropPairs, seedFlashcards, seedQuestions } from '../data/seed-learning-content.ts';

export class InMemoryLearningContentRepository implements LearningContentRepository {
  async getFlashcards() {
    return [...seedFlashcards];
  }

  async getQuestions() {
    return [...seedQuestions];
  }

  async getDragDropPairs() {
    return [...seedDragDropPairs];
  }
}
