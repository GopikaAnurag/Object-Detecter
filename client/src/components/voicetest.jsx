import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceTest = () => {
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("🚫 Your browser doesn't support speech recognition.");
      return;
    }

    console.log("✅ Browser supports speech recognition");

    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });

    return () => {
      SpeechRecognition.stopListening();
    };
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    console.log("🎙️ Transcript:", transcript);
  }, [transcript]);

  return (
    <div>
      <h1>🎙️ Voice Test</h1>
      <p><strong>Status:</strong> {listening ? '🎧 Listening...' : '❌ Not listening'}</p>
      <p><strong>Transcript:</strong> {transcript}</p>
    </div>
  );
};

export default VoiceTest;
