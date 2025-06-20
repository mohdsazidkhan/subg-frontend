// src/components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-gray-100 dark:bg-gray-900 text-center py-6 border-t border-gray-200 dark:border-gray-700 mt-10 transition-colors duration-300">
      <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-300">
        <Link to="/about" className="hover:underline">About Us</Link>
        <Link to="/how-it-works" className="hover:underline">How It Works</Link>
        <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
        <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        <Link to="/refund" className="hover:underline">Refund Policy</Link>
        <Link to="/contact" className="hover:underline">Contact Us</Link>
      </div>
      <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
        &copy; {new Date().getFullYear()} SUBG QUIZ. All rights reserved.
      </p>
    </footer>
  );
}
