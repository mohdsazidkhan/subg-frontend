import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaWhatsapp,
  FaDiscord,
  FaTelegramPlane
} from 'react-icons/fa';
import config from '../config/appConfig';

const UnifiedFooter = ({ isLandingPage = false }) => {
  const legalLinks = config.LEGAL;

  // Convert legal links object to array format for mapping
  const legalLinksArray = [
    { name: 'Privacy Policy', path: legalLinks.PRIVACY_POLICY },
    { name: 'Terms & Conditions', path: legalLinks.TERMS },
    { name: 'Refund Policy', path: legalLinks.REFUND_POLICY },
    { name: 'Halal Disclaimer', path: legalLinks.HALAL_DISCLAIMER }
  ];

  // Define social links from .env (same as contact page)
  const socialLinks = [
    { icon: <FaFacebookF />, url: process.env.REACT_APP_FACEBOOK_URL || "#" },
    { icon: <FaTwitter />, url: process.env.REACT_APP_TWITTER_URL || "#" },
    { icon: <FaInstagram />, url: process.env.REACT_APP_INSTAGRAM_URL || "#" },
    { icon: <FaYoutube />, url: process.env.REACT_APP_YOUTUBE_URL || "#" },
    { icon: <FaLinkedinIn />, url: process.env.REACT_APP_LINKEDIN_URL || "#" },
    { icon: <FaWhatsapp />, url: process.env.REACT_APP_WHATSAPP_URL || "#" },
    { icon: <FaDiscord />, url: process.env.REACT_APP_DISCORD_URL || "#" },
    { icon: <FaTelegramPlane />, url: process.env.REACT_APP_TELEGRAM_URL || "#" },
  ];

  if (isLandingPage) {
    // Landing page footer - more comprehensive
    return (
      <footer className="py-8 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-6">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img src="/logo.png" alt="SUBG QUIZ Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto md:mx-0">
                Empowering students with interactive learning experiences through comprehensive quizzes, 
                progressive levels, and rewarding achievements.
              </p>
                             <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                 {socialLinks.map((item, index) => (
                   <a
                     key={index}
                     href={item.url}
                     target="_blank"
                     rel="noopener noreferrer"
                     title={item.url !== "#" ? new URL(item.url).hostname : "Social Media"}
                     className="w-11 h-11 rounded-full text-white flex items-center justify-center text-xl 
                      shadow-lg transition-all duration-300 transform hover:scale-110 hover:rotate-3
                      bg-gradient-to-bl from-yellow-500 to-red-500 
                      dark:from-gray-700 dark:to-gray-900 hover:shadow-2xl"
                   >
                     {item.icon}
                   </a>
                 ))}
               </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: 'About Us', href: '/about' },
                  { name: 'How It Works', href: '/how-it-works' },
                  { name: 'Categories', href: '#categories' },
                  { name: 'Levels', href: '#levels' },
                  { name: 'Top Performers', href: '#performers' }
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Support</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Contact Us', href: '/contact' },
                  { name: 'Help Center', href: '/how-it-works' },
                  { name: 'Privacy Policy', href: '/privacy' },
                  { name: 'Terms of Service', href: '/terms' },
                  { name: 'Refund Policy', href: '/refund' }
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-400 dark:hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-center items-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                © 2025 SUBG QUIZ. All rights reserved. Developed by <a target='_blank' rel='noreferrer' href='https://mohdsazidkhan.com' className="hover:text-gray-900 dark:hover:text-white transition-colors">{config.APP_AUTHOR}</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Homepage footer - simpler version
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-800 text-center p-4 md:py-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-sm text-gray-600 dark:text-gray-300">
        <Link to="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">About Us</Link>
        <Link to="/how-it-works" className="hover:text-gray-900 dark:hover:text-white transition-colors">How It Works</Link>
        <Link to={legalLinks.TERMS} className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms & Conditions</Link>
        <Link to={legalLinks.PRIVACY_POLICY} className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
        <Link to={legalLinks.REFUND_POLICY} className="hover:text-gray-900 dark:hover:text-white transition-colors">Refund Policy</Link>
        <Link to="/contact" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact Us</Link>
      </div>
      
             {/* Social Icons */}
       <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
         {socialLinks.map((item, index) => (
           <a
             key={index}
             href={item.url}
             target="_blank"
             rel="noopener noreferrer"
             title={item.url !== "#" ? new URL(item.url).hostname : "Social Media"}
             className="w-9 h-9 rounded-full text-white flex items-center justify-center text-lg 
              shadow-lg transition-all duration-300 transform hover:scale-110 hover:rotate-3
              bg-gradient-to-bl from-yellow-500 to-red-500 
              hover:shadow-xl"
           >
             {item.icon}
           </a>
         ))}
       </div>
      
      <p className="mt-4 text-xs text-gray-600 dark:text-gray-300">
        &copy; {new Date().getFullYear()} {config.APP_NAME}. All rights reserved. | 
        Version {config.APP_VERSION}
      </p>
      <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
        Designed & Developed by <a target='_blank' rel='noreferrer' href='https://mohdsazidkhan.com' className="hover:text-gray-900 dark:hover:text-white transition-colors">{config.APP_AUTHOR}</a>
      </p>
    </footer>
  );
};

export default UnifiedFooter;
