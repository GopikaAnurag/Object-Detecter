import React, { useState, useEffect } from 'react';
import VoiceCommand from './components/Voicecommand';
import LogList from './components/Loglist';
import './index.css';

const App = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {  // Show the button after scrolling 300px
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scroll back to top
    });
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="container header-flex">
          <h1 className="logo" style={{ fontSize: '2em', padding: '10px 0', textAlign: 'center' }}>
            🧠 Object Detection System
          </h1>
        </div>
      </header>

      <main className="container main-section">
        <VoiceCommand />
        <LogList />
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2025 Object Detection System. All rights reserved.</p>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#00bcd4',
            color: 'white',
            padding: '6px 12px',  // Reduced padding for a smaller button
            fontSize: '0.8em', // Further reduced font size
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            transition: 'background-color 0.3s',
          }}
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default App;
