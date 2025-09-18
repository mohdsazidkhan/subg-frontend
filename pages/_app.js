import '../src/index.css';
import '../src/App.css';
import '../src/mobile-app.css';
import { Provider } from 'react-redux';
import store from '../src/store';
import GlobalErrorProvider from '../src/contexts/GlobalErrorContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactGA from 'react-ga4';
import { useEffect } from 'react';

function AnalyticsInit() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GA4) {
      ReactGA.initialize(process.env.NEXT_PUBLIC_GA4);
    }
  }, []);
  return null;
}

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
        <GlobalErrorProvider>
          <AnalyticsInit />
          <Component {...pageProps} />
        </GlobalErrorProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}


