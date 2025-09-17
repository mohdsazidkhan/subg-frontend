import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import ReactGA from 'react-ga4';

if (typeof window !== 'undefined' && process.env.REACT_APP_GA4) {
	ReactGA.initialize(process.env.REACT_APP_GA4);
}

const container = document.getElementById('root');

if (container && container.hasChildNodes()) {
	hydrateRoot(
		container,
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
} else {
	const root = createRoot(container);
	root.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
}
