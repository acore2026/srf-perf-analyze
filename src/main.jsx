import React from 'react';
import { createRoot } from 'react-dom/client';
import SRFCalculator from './SRFCalculator.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SRFCalculator />
  </React.StrictMode>
);
