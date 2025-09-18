import React from 'react';
import Head from 'next/head';
import { MemoryRouter } from 'react-router-dom';
import UnifiedNavbar from '../components/UnifiedNavbar.jsx';
import UnifiedFooter from '../components/UnifiedFooter.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function HomeClient() {
  const [LandingPage, setLandingPage] = React.useState(null);
  React.useEffect(() => {
    let mounted = true;
    import('../pages/LandingPage.jsx')
      .then(mod => { if (mounted) setLandingPage(() => mod.default); })
      .catch(() => { /* noop - ErrorBoundary will handle */ });
    return () => { mounted = false; };
  }, []);
  return (
    <>
      <Head>
        <title>SUBG Quiz</title>
        <meta name="description" content="Practice quizzes, levels, rewards, and more on SUBG." />
      </Head>
      <UnifiedNavbar isLandingPage={true} />
      <ErrorBoundary>
        {LandingPage ? (
          <MemoryRouter initialEntries={["/"]}>
            <LandingPage />
          </MemoryRouter>
        ) : null}
      </ErrorBoundary>
      <UnifiedFooter isLandingPage={true} />
    </>
  );
}


