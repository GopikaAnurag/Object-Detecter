import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import CameraFeed from './Camerafeed';
import api from '../api';

const VoiceCommand = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState(null);

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  // ✅ Only one definition of handleVoiceDetected
  const handleVoiceDetected = async () => {
    console.log('✅ Detected voice command!');

    // 🔔 Log to backend
    try {
      await api.post('/', {
        object: 'Bottle', // 👈 This should match the object detected in CameraFeed
        status: 'Missing',
      });
      console.log('✅ Object status logged successfully.');
    } catch (err) {
      console.error('🚫 Error logging to backend:', err);
      setError('Failed to log object status');
    }

    // 📢 Notify and open camera
    alert('📢 Bottle is missing! Opening camera...');
    setShowCamera(true);

    // 🔄 Reset transcript
    resetTranscript();
  };

  useEffect(() => {
    console.log('🎧 Starting speech recognition...');
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      alert('🚫 Your browser doesn’t support speech recognition.');
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    const lower = transcript.toLowerCase();
    console.log('📝 Transcript:', transcript);
    console.log('🔍 Lowercase:', lower);
    if (
      lower.includes('bottle is missing') ||
      lower.includes('i lost the bottle') ||
      lower.includes('bottle lost')
    ) {
      handleVoiceDetected();
    }
  }, [transcript]);

  return (
    <div className="voice-command-container">
      <h3>🎙️ Voice Command</h3>
      <p className="voice-status">
        <strong>Status:</strong> {listening ? '🎧 Listening...' : '❌ Not listening'}
      </p>
      <p><strong>Transcript:</strong></p>
      <div className="transcript-box">{transcript || '🎤 Waiting for voice input...'}</div>

      {error && <p className="error-message">{error}</p>}

      {showCamera && <CameraFeed />}
    </div>
  );
};

export default VoiceCommand;
