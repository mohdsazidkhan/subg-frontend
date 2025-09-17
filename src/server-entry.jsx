import React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import ReactGA from 'react-ga4';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from './store';
import GlobalErrorProvider from './contexts/GlobalErrorContext';
import { AppLayout } from './App';

// Server-side root renderer
export function render(url, context = {}) {
	// Avoid GA on server
	const GA_ID = process.env.REACT_APP_GA4;
	const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id';

	const app = (
		<Provider store={store}>
			<GoogleOAuthProvider clientId={googleClientId}>
				<GlobalErrorProvider>
					<StaticRouter location={url} context={context}>
						<AppLayout />
					</StaticRouter>
				</GlobalErrorProvider>
			</GoogleOAuthProvider>
		</Provider>
	);

	return app;
}
