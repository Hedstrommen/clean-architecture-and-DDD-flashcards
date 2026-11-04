import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TOKENS } from '../../infrastructure/di/composition-root.ts';
import type { GetSessionContentUseCase } from '../../application/learning/get-session-content.use-case.ts';
import type { SubmitAnswerUseCase } from '../../application/learning/submit-answer.use-case.ts';
import type { AnswerResultDto, LearningItemDto, SessionContentDto } from '../../application/learning/dto/session.dto.ts';
import { learningModeLabel } from '../../domain/learning/learning-mode.ts';
import { useApp } from '../hooks/useApp.ts';
import { CategoryBadge } from '../components/CategoryBadge.tsx';

interface Feedback {
  result: AnswerResultDto;
  item: LearningItemDto;
}

export const SessionPage = () => {
  const { sessionId = '' } = useParams();
  const app = useApp();
  const [content, setContent] = useState<SessionContentDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [definitionOrder, setDefinitionOrder] = useState<string[]>([]);

  useEffect(() => {
    const useCase = app.resolve<GetSessionContentUseCase>(TOKENS.GetSessionContentUseCase);
    useCase
      .execute(sessionId)
      .then((result) => {
        if (result.ok) setContent(result.value);
        else setError(result.error.message);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load session.'));
  }, [app, sessionId]);

  const item = content?.items[index] ?? null;

  useEffect(() => {
    setFlipped(false);
    setFeedback(null);
    if (item?.kind === 'dragdrop' && content) {
      const ids = content.items
        .filter((i) => i.kind === 'dragdrop')
        .map((i) => i.id);
      const shuffled = [...ids].sort(() => Math.random() - 0.5);
      setDefinitionOrder(shuffled);
    }
  }, [index, item, content]);

  const submit = useCallback(
    async (selectedIndex: number, matchedItemId?: string) => {
      if (!item || feedback) return;
      const useCase = app.resolve<SubmitAnswerUseCase>(TOKENS.SubmitAnswerUseCase);
      const result = await useCase.execute({ sessionId, itemId: item.id, selectedIndex, matchedItemId });
      if (result.ok) {
        setFeedback({ result: result.value, item });
        setContent((prev) => (prev ? { ...prev, session: result.value.session } : prev));
      } else {
        setError(result.error.message);
      }
    },
    [app, sessionId, item, feedback],
  );

  const next = () => {
    setIndex((i) => i + 1);
  };

  const definitions = useMemo(() => {
    if (!content) return [];
    return definitionOrder
      .map((id) => content.items.find((i) => i.id === id))
      .filter((i): i is Extract<LearningItemDto, { kind: 'dragdrop' }> => i?.kind === 'dragdrop');
  }, [content, definitionOrder]);

  if (error) {
    return (
      <main>
        <p className="feedback bad">{error}</p>
        <Link to="/">Back to menu</Link>
      </main>
    );
  }

  if (!content || !item) {
    return <main><p>Loading session…</p></main>;
  }

  const { session } = content;
  const finished = session.isComplete;

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{learningModeLabel[session.mode]}</strong>
        <span style={{ color: 'var(--ink-soft)', fontSize: '0.85rem' }}>
          {session.answeredCount}/{session.totalCount} answered · score {session.score}%
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${session.progress}%` }} />
      </div>

      {finished ? (
        <div className="card results">
          <h2>Session complete</h2>
          <div className="score">{session.score}%</div>
          <p>
            You answered {session.correctCount} of {session.totalCount} correctly.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <Link className="btn" to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Back to menu
            </Link>
            <Link className="btn secondary" to="/reference" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Review the reference
            </Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--ink-soft)', fontSize: '0.85rem' }}>
              Item {index + 1} of {session.totalCount}
            </span>
            <CategoryBadge category={item.category} />
          </div>

          {item.kind === 'flashcard' && (
            <div>
              <div className="flashcard" onClick={() => setFlipped((f) => !f)}>
                {flipped ? (
                  <>
                    <div className="back">{item.back}</div>
                    {item.hint && <div className="flip-hint">Hint: {item.hint}</div>}
                  </>
                ) : (
                  <>
                    <div className="front">{item.front}</div>
                    <div className="flip-hint">Click to reveal the answer</div>
                  </>
                )}
              </div>
              <div className="btn-row">
                <button className="btn" disabled={!flipped || feedback !== null} onClick={() => void submit(1)}>
                  I knew it
                </button>
                <button className="btn secondary" disabled={!flipped || feedback !== null} onClick={() => void submit(0)}>
                  Didn't know
                </button>
              </div>
            </div>
          )}

          {item.kind === 'question' && (
            <div>
              <h3 style={{ marginBottom: 0 }}>{item.prompt}</h3>
              <div className="option-list">
                {item.options.map((option, i) => {
                  const isSelected = feedback?.result.itemId === item.id && feedback.result.selectedIndex === i;
                  const cls = !feedback
                    ? ''
                    : option === feedback.result.correctOption
                      ? 'correct'
                      : isSelected
                        ? 'wrong'
                        : '';
                  return (
                    <button
                      key={i}
                      className={`option-btn ${cls}`}
                      disabled={feedback !== null}
                      onClick={() => void submit(i)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {item.kind === 'dragdrop' && (
            <div>
              <span className="drag-term">{item.term}</span>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
                Drag or click the matching definition:
              </p>
              <div className="drop-list">
                {definitions.map((def) => {
                  const answered = feedback?.result.itemId === item.id;
                  const isSelected = answered && feedback.result.selectedIndex === definitions.indexOf(def);
                  const cls = !feedback
                    ? ''
                    : def.id === item.id
                      ? 'correct'
                      : isSelected
                        ? 'wrong'
                        : '';
                  return (
                    <button
                      key={def.id}
                      className={`drop-target ${cls}`}
                      disabled={answered}
                      draggable={!answered}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        void submit(definitions.indexOf(def), def.id);
                      }}
                      onClick={() => void submit(definitions.indexOf(def), def.id)}
                    >
                      {def.definition}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {feedback && (
            <div>
              <div className={`feedback ${feedback.result.correct ? 'ok' : 'bad'}`}>
                {feedback.result.correct ? 'Correct!' : 'Not quite.'}{' '}
                {feedback.result.explanation && <span>{feedback.result.explanation}</span>}
              </div>
              <div className="btn-row">
                <button className="btn" onClick={next}>
                  {index + 1 >= session.totalCount ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};
