import { createContext, useContext } from 'react';
import type { Container } from '../../core/di.ts';
import { createContainer } from '../../infrastructure/di/composition-root.ts';

const AppContext = createContext<Container>(createContainer());

export const useApp = (): Container => useContext(AppContext);
