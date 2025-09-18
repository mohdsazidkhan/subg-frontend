import UnifiedNavbar from '../src/components/UnifiedNavbar.jsx';
import UnifiedFooter from '../src/components/UnifiedFooter.jsx';
import dynamic from 'next/dynamic';
import { MemoryRouter } from 'react-router-dom';
import Head from 'next/head';

export async function getServerSideProps() { return { props: {} }; }

export default function Home() {
  const LandingPage = dynamic(() => import('../src/pages/LandingPage.jsx'), { ssr: false });
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


