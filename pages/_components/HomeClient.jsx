import React from 'react';
import Head from 'next/head';
import { MemoryRouter } from 'react-router-dom';
import UnifiedNavbar from '../../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../../src/components/UnifiedFooter.jsx';
import LandingPage from '../../src/pages/LandingPage.jsx';

export default function HomeClient() {
  return (
    <>
      <Head>
        <title>SUBG Quiz</title>
        <meta name="description" content="Practice quizzes, levels, rewards, and more on SUBG." />
      </Head>
      <UnifiedNavbar isLandingPage={true} />
      <MemoryRouter initialEntries={["/"]}>
        <LandingPage />
      </MemoryRouter>
      <UnifiedFooter isLandingPage={true} />
    </>
  );
}


