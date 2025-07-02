// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import config from '../config/appConfig';

export default function Footer() {
  const legalLinks = config.LEGAL;
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-900 text-center py-6 border-t border-gray-200 dark:border-gray-700 mt-10 transition-colors duration-300">
      <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-300">
        <Link to="/about" className="hover:underline">About Us</Link>
        <Link to="/how-it-works" className="hover:underline">How It Works</Link>
        <Link to={legalLinks.TERMS} className="hover:underline">Terms & Conditions</Link>
        <Link to={legalLinks.PRIVACY_POLICY} className="hover:underline">Privacy Policy</Link>
        <Link to={legalLinks.REFUND_POLICY} className="hover:underline">Refund Policy</Link>
        <Link to="/contact" className="hover:underline">Contact Us</Link>
      </div>
      <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
        &copy; {new Date().getFullYear()} {config.APP_NAME}. All rights reserved. | 
        Version {config.APP_VERSION}
      </p>
      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
        Made with ❤️ by {config.APP_AUTHOR}
      </p>
    </footer>
  );
}
