import type { JSX } from 'react';

export type DiagramKind = 'clean-architecture' | 'ddd' | 'combined';

const CleanArchitectureDiagram = () => (
  <div>
    <div className="layer-box ca-1">
      Entities
      <small>Enterprise business rules</small>
    </div>
    <div className="arrow-note">↑ dependencies point inward only</div>
    <div className="layer-box ca-2">
      Use Cases
      <small>Application business rules</small>
    </div>
    <div className="layer-box ca-3">
      Interface Adapters
      <small>Controllers · Presenters · Gateways</small>
    </div>
    <div className="layer-box ca-4">
      Frameworks &amp; Drivers
      <small>Web · DB · UI · devices</small>
    </div>
  </div>
);

const DddDiagram = () => (
  <div>
    <div className="layer-box ddd-strategic">
      Strategic Design
      <small>Bounded Contexts · Context Map · Ubiquitous Language</small>
    </div>
    <div className="layer-box ddd-tactical">
      Tactical Design — inside each Bounded Context
      <small>Aggregates · Aggregate Roots</small>
    </div>
    <div className="layer-box ddd-items">
      Entities · Value Objects · Domain Services · Repositories · Domain Events
    </div>
  </div>
);

const CombinedDiagram = () => (
  <div>
    <div className="ctx-box">
      <div className="ctx-title">Bounded Context: e.g. "Ordering"</div>
      <div className="layer-box ca-1">
        Entities = Aggregates, Entities, Value Objects
      </div>
      <div className="layer-box ca-2">Use Cases = Application Services</div>
      <div className="layer-box ca-3">Interface Adapters = Controllers, Gateways</div>
      <div className="layer-box ca-4">Frameworks &amp; Drivers</div>
    </div>
    <div className="ctx-box">
      <div className="ctx-title">Bounded Context: e.g. "Billing" (own layers)</div>
    </div>
    <div className="arrow-note">Contexts integrate via Domain Events / Context Map — never by sharing inner layers</div>
  </div>
);

const DIAGRAMS: Record<DiagramKind, { title: string; sub: string; body: () => JSX.Element }> = {
  'clean-architecture': {
    title: 'Clean Architecture only',
    sub: 'Concentric layers; dependencies point inward.',
    body: CleanArchitectureDiagram,
  },
  ddd: {
    title: 'DDD only',
    sub: 'Strategic design sets boundaries; tactical patterns fill each context.',
    body: DddDiagram,
  },
  combined: {
    title: 'Clean Architecture + DDD',
    sub: 'Each bounded context contains its own CA layers.',
    body: CombinedDiagram,
  },
};

export const ProjectStructureDiagram = ({ kind }: { kind: DiagramKind }) => {
  const diagram = DIAGRAMS[kind];
  const Body = diagram.body;
  return (
    <div className="diagram">
      <h3>{diagram.title}</h3>
      <div className="sub">{diagram.sub}</div>
      <Body />
    </div>
  );
};

export const ProjectStructureDiagrams = () => (
  <div className="diagram-grid">
    <ProjectStructureDiagram kind="clean-architecture" />
    <ProjectStructureDiagram kind="ddd" />
    <ProjectStructureDiagram kind="combined" />
  </div>
);
