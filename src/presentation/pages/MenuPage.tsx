import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOKENS } from '../../infrastructure/di/composition-root.ts';
import type { GetMenuOptionsUseCase } from '../../application/learning/get-menu-options.use-case.ts';
import type { StartSessionUseCase } from '../../application/learning/start-session.use-case.ts';
import type { MenuOptionDto } from '../../application/learning/dto/session.dto.ts';
import type { LearningMode } from '../../domain/learning/learning-mode.ts';
import { useApp } from '../hooks/useApp.ts';

export const MenuPage = () => {
  const app = useApp();
  const navigate = useNavigate();
  const [options, setOptions] = useState<MenuOptionDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState<LearningMode | null>(null);

  useEffect(() => {
    const useCase = app.resolve<GetMenuOptionsUseCase>(TOKENS.GetMenuOptionsUseCase);
    useCase
      .execute()
      .then(setOptions)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load menu.'));
  }, [app]);

  const start = async (mode: LearningMode) => {
    setStarting(mode);
    setError(null);
    try {
      const useCase = app.resolve<StartSessionUseCase>(TOKENS.StartSessionUseCase);
      const result = await useCase.execute(mode);
      if (result.ok) {
        navigate(`/session/${result.value.id}`);
      } else {
        setError(result.error.message);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start session.');
    } finally {
      setStarting(null);
    }
  };

  return (
    <main>
      <h2 className="section-title">Choose how you want to learn</h2>
      <p style={{ color: 'var(--ink-soft)' }}>
        Pick a single learning mode or a mixed session that combines all of them. Blue topics are
        Clean Architecture, purple topics are Domain-Driven Design.
      </p>
      {error && <p className="feedback bad">{error}</p>}
      <div className="menu-grid">
        {options.map((option) => (
          <button
            key={option.mode}
            className="mode-card"
            onClick={() => void start(option.mode)}
            disabled={starting !== null}
          >
            <h3>{starting === option.mode ? 'Starting…' : option.label}</h3>
            <p>{option.description}</p>
            <span className="count">{option.itemCount} items</span>
          </button>
        ))}
      </div>
      <h2 className="section-title">Or study the theory</h2>
      <p style={{ color: 'var(--ink-soft)' }}>
        Browse the <a href="#/reference">searchable reference</a> with a table of contents and visual
        project structures for Clean Architecture, DDD and both combined.
      </p>
    </main>
  );
};
