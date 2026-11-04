import { useEffect, useMemo, useState } from 'react';
import { TOKENS } from '../../infrastructure/di/composition-root.ts';
import type { SearchConceptsUseCase } from '../../application/knowledge/search-concepts.use-case.ts';
import type { GetTableOfContentsUseCase } from '../../application/knowledge/get-table-of-contents.use-case.ts';
import type { ConceptDto, TocEntryDto } from '../../application/knowledge/dto/concept.dto.ts';
import { CATEGORY_COLORS } from '../theme/theme.ts';
import { useApp } from '../hooks/useApp.ts';
import { CategoryBadge } from '../components/CategoryBadge.tsx';
import { ProjectStructureDiagrams } from '../components/ProjectStructureDiagram.tsx';

export const ReferencePage = () => {
  const app = useApp();
  const [query, setQuery] = useState('');
  const [toc, setToc] = useState<TocEntryDto[]>([]);
  const [results, setResults] = useState<ConceptDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tocUseCase = app.resolve<GetTableOfContentsUseCase>(TOKENS.GetTableOfContentsUseCase);
    tocUseCase
      .execute()
      .then(setToc)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load table of contents.'));
  }, [app]);

  useEffect(() => {
    const searchUseCase = app.resolve<SearchConceptsUseCase>(TOKENS.SearchConceptsUseCase);
    searchUseCase
      .execute(query)
      .then(setResults)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Search failed.'));
  }, [app, query]);

  const tocById = useMemo(() => new Map(toc.map((t) => [t.id, t])), [toc]);

  return (
    <main>
      <h2 className="section-title">Reference: Clean Architecture &amp; DDD</h2>
      <input
        className="search-input"
        type="search"
        placeholder={'Search concepts, e.g. "aggregate", "dependency rule", "repository"…'}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search reference"
      />
      {error && <p className="feedback bad">{error}</p>}

      <h3 className="section-title">How a project can be structured</h3>
      <ProjectStructureDiagrams />

      <h3 className="section-title">Table of contents</h3>
      <div className="reference-layout">
        <aside className="toc">
          <h2>Contents</h2>
          <ul>
            {toc.map((entry) => (
              <li key={entry.id}>
                <a href={`#/reference#${entry.id}`}>
                  <span className="dot" style={{ background: CATEGORY_COLORS[entry.category].main }} />
                  {entry.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <section>
          {results.length === 0 && <p className="empty-state">No concepts match your search.</p>}
          {results.map((concept) => (
            <article key={concept.id} id={concept.id} className="card concept-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <h2>{concept.title}</h2>
                <CategoryBadge category={concept.category} />
              </div>
              <p className="summary">{concept.summary}</p>
              <p className="body">{concept.body}</p>
              <div className="tags">
                {concept.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              {tocById.get(concept.id) && (
                <p style={{ marginBottom: 0 }}>
                  <a href={`#/reference#${concept.id}`}>Permalink to this section</a>
                </p>
              )}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};
