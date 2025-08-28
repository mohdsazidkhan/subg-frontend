// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import config from '../config/appConfig';

export default function Footer() {
  const legalLinks = config.LEGAL;
  return (
    <>
    <footer className="w-full bg-transparent text-center p-4 md:py-6 border-t dark:border-gray-500 transition-colors duration-300">
      <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-sm text-gray-800 dark:text-gray-400">
        <Link to="/about" className="hover:underline">About Us</Link>
        <Link to="/how-it-works" className="hover:underline">How It Works</Link>
        <Link to={legalLinks.TERMS} className="hover:underline">Terms & Conditions</Link>
        <Link to={legalLinks.PRIVACY_POLICY} className="hover:underline">Privacy Policy</Link>
        <Link to={legalLinks.REFUND_POLICY} className="hover:underline">Refund Policy</Link>
        <Link to="/contact" className="hover:underline">Contact Us</Link>
      </div>
      <p className="mt-2 text-xs text-gray-800 dark:text-gray-400">
        &copy; {new Date().getFullYear()} {config.APP_NAME}. All rights reserved. | 
        Version {config.APP_VERSION}
      </p>
      <p className="mt-1 text-xs text-gray-800 dark:text-gray-400">
        Designed & Developed by <a target='_blank' rel='noreferrer' href='https://mohdsazidkhan.com'>{config.APP_AUTHOR}</a>
      </p>
    </footer>

    </>
  );
}
