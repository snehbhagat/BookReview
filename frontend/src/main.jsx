import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@/styles/theme.css'; // ADD: dark/light + skeleton
import '@/styles/goodreads.css'; // if previously added
import './index.css'; // existing tailwind base (if present)

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);