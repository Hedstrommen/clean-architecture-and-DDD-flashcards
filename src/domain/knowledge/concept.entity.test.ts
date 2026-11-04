import { describe, expect, it } from 'vitest';
import { Concept } from './concept.entity.ts';
import { conceptId } from './concept-id.ts';
import { ConceptTitle } from './concept-title.value-object.ts';

const makeConcept = (body: string, tags: string[] = []) => {
  const title = ConceptTitle.create('Bounded Context');
  if (!title.ok) throw new Error('invalid title');
  return Concept.restore({
    id: conceptId('c1'),
    title: title.value,
    category: 'ddd',
    summary: 'A boundary for the model',
    body,
    tags,
    order: 1,
  });
};

describe('Concept entity', () => {
  it('matches queries against title, body and tags across all tokens', () => {
    const concept = makeConcept('Inside a bounded context the language is consistent.', ['strategic']);
    expect(concept.matchesQuery('bounded')).toBe(true);
    expect(concept.matchesQuery('strategic language')).toBe(true);
    expect(concept.matchesQuery('hexagonal')).toBe(false);
  });

  it('matches everything for an empty query', () => {
    expect(makeConcept('anything').matchesQuery('   ')).toBe(true);
  });
});

describe('ConceptTitle value object', () => {
  it('rejects too-short titles', () => {
    expect(ConceptTitle.create('ab').ok).toBe(false);
  });

  it('accepts and trims valid titles', () => {
    const result = ConceptTitle.create('  Aggregates  ');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.value).toBe('Aggregates');
  });
});
