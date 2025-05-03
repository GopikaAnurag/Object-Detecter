import React from 'react';
import VoiceCommand from '../components/Voicecommand';
import LogList from '../components/Loglist';

const Home = () => {
  return (
    <div>
      <h1>🧠 Object Detection System</h1>
      <VoiceCommand />
      <LogList/>
    </div>
  );
};

export default Home;
