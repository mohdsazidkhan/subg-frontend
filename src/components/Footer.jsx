// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import config from '../config/appConfig';

export default function Footer() {
  const legalLinks = config.LEGAL;
  return (
    <>
    <footer className="w-full bg-transparent text-center p-4 md:py-6 border-t dark:border-gray-500 transition-colors duration-300">
      <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-sm text-gray-600 dark:text-gray-300">
        <Link to="/about" className="hover:underline">About Us</Link>
        <Link to="/how-it-works" className="hover:underline">How It Works</Link>
        <Link to={legalLinks.TERMS} className="hover:underline">Terms & Conditions</Link>
        <Link to={legalLinks.PRIVACY_POLICY} className="hover:underline">Privacy Policy</Link>
        <Link to={legalLinks.REFUND_POLICY} className="hover:underline">Refund Policy</Link>
        <Link to="/contact" className="hover:underline">Contact Us</Link>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} {config.APP_NAME}. All rights reserved. | 
        Version {config.APP_VERSION}
      </p>
      <p className="mt-1 text-xs text-gray-400">
        Made with ❤️ by {config.APP_AUTHOR}
      </p>
    </footer>
    <div className="fixed bottom-0 left-0 w-full bg-red-600 text-white text-sm sm:text-base font-medium text-center py-1 z-50 shadow-lg">
  💡 <span className="font-semibold">Note:</span> Payment options are not live yet. You can currently play <span className="font-bold">Levels 0 to 3</span> for free!
</div>
    </>
  );
}
