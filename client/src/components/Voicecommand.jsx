import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import CameraFeed from './Camerafeed';
import api from '../api';

const VoiceCommand = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [detectedObject, setDetectedObject] = useState('');
  const [error, setError] = useState(null);

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  // ✅ Only one definition of handleVoiceDetected
  const handleVoiceDetected = async (object) => {
    console.log('✅ Detected voice command for:', object);

    // 🔔 Log to backend
    try {
      await api.post('/', {
        object: object,  // Dynamically pass the object detected
        status: 'Missing',
      });
      console.log('✅ Object status logged successfully.');
    } catch (err) {
      console.error('🚫 Error logging to backend:', err);
      setError('Failed to log object status');
    }

    // 📢 Notify and open camera
    alert(`📢 ${object} is missing! Opening camera...`);
    setDetectedObject(object);
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
    
    // Update for multiple object detection (Bottle and Key)
    if (
      lower.includes('bottle is missing') ||
      lower.includes('i lost the bottle') ||
      lower.includes('bottle lost')
    ) {
      handleVoiceDetected('Bottle');
    } else if (
      lower.includes('key is missing') ||
      lower.includes('i lost the key') ||
      lower.includes('key lost')
    ) {
      handleVoiceDetected('Key');
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

      {showCamera && <CameraFeed detectedObject={detectedObject} />}
    </div>
  );
};

export default VoiceCommand;
