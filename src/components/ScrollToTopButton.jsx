import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  console.log('ScrollToTopButton component rendered, isVisible:', isVisible);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
        console.log('Scroll to top button should be visible');
      } else {
        setIsVisible(false);
        console.log('Scroll to top button should be hidden');
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top-btn"
          aria-label="Scroll to top"
          title="Scroll to top"
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            zIndex: 1000,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px'
          }}
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
