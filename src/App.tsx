import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';
import { MenuPage } from './presentation/pages/MenuPage.tsx';
import { SessionPage } from './presentation/pages/SessionPage.tsx';
import { ReferencePage } from './presentation/pages/ReferencePage.tsx';
import { Legend } from './presentation/components/Legend.tsx';

export const App = () => (
  <HashRouter>
    <div className="container">
      <header className="app-header">
        <h1>
          <span className="ca">Clean Architecture</span> &amp; <span className="ddd">DDD</span> Learning Lab
        </h1>
        <nav className="nav-links">
          <NavLink to="/" end>Menu</NavLink>
          <NavLink to="/reference">Reference</NavLink>
          <Legend />
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/session/:sessionId" element={<SessionPage />} />
        <Route path="/reference" element={<ReferencePage />} />
      </Routes>
    </div>
  </HashRouter>
);
