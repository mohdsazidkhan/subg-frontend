import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ReactGA from 'react-ga4';

ReactGA.initialize(process.env.REACT_APP_GA4);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
