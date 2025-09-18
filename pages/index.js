export async function getServerSideProps() { return { props: {} }; }

export default function Home() {
  if (typeof window === 'undefined') {
    // Avoid rendering client-only app on server to prevent runtime errors
    return null;
  }
  const HomeClient = require('../src/next/HomeClient.jsx').default;
  return <HomeClient />;
}


