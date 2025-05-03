// Header.jsx
import React from 'react';
import './Header.css'; // Optional styling for the header

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="header">
      <h1>🧠 Object Detection System</h1>
      <button className="toggle-btn" onClick={toggleDarkMode}>
        {darkMode ? '🌞' : '🌙'}
      </button>
    </header>
  );
};

export default Header;
