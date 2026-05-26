import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SRFCalculator from './SRFCalculator';
import './styles.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <SRFCalculator />
  </StrictMode>
);
