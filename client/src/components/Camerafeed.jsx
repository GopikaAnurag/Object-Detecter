import React, { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const CameraFeed = () => {
  const videoRef = useRef(null);
  const [isObjectDetected, setIsObjectDetected] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [cameraPaused, setCameraPaused] = useState(false); // To track if detection is paused
  const timerRef = useRef(null);
  const [timerExpired, setTimerExpired] = useState(false);

  const detectionTime = 20000; // 20 seconds
  const [detectedObjects, setDetectedObjects] = useState({
    bottle: false,
    key: false,
  });

  useEffect(() => {
    let model;

    const startCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log('📸 Available Devices:', devices);

        // Filter for video input devices (cameras)
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');
        console.log('🎥 Video Devices:', videoDevices);

        if (videoDevices.length === 0) {
          throw new Error('No video input devices found');
        }

        let stream = null;

        try {
          // Try environment camera (mobile)
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: 640, height: 480 },
          });
        } catch (err) {
          console.warn('🌐 Environment camera failed, trying default:', err);
          // Fallback: try default front camera
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        videoRef.current.onloadedmetadata = async () => {
          await videoRef.current.play();
          console.log('✅ Camera started, loading model...');
          model = await cocoSsd.load();
          console.log('✅ Model loaded!');
          detectObjects(model);
        };
      } catch (error) {
        console.error('🚫 Camera error:', error);
        setCameraError(error.message || 'Camera access failed');
      }
    };

    const detectObjects = (model) => {
      const detect = async () => {
        if (timerExpired || cameraPaused) return; // Skip detection if paused

        try {
          if (
            videoRef.current.readyState >= 2 &&
            videoRef.current.videoWidth > 0 &&
            videoRef.current.videoHeight > 0
          ) {
            const predictions = await model.detect(videoRef.current);
            console.log('🎯 Predictions:', predictions);

            // Reset detected object states
            const newDetectedObjects = { bottle: false, key: false };

            predictions.forEach((prediction) => {
              if (prediction.class.toLowerCase() === 'bottle') {
                newDetectedObjects.bottle = true;
                console.log('✅ Bottle detected!');
              }
              if (prediction.class.toLowerCase() === 'key') {
                newDetectedObjects.key = true;
                console.log('✅ Key detected!');
              }
            });

            // Update detectedObjects state only if there’s a change
            if (
              newDetectedObjects.bottle !== detectedObjects.bottle ||
              newDetectedObjects.key !== detectedObjects.key
            ) {
              setDetectedObjects(newDetectedObjects);

              if (newDetectedObjects.bottle && !isObjectDetected) {
                setIsObjectDetected('bottle');
                const audio = new Audio('/beep-07a.mp3');
                audio.play().catch((err) => console.warn('🔇 Beep error:', err));
              } else if (newDetectedObjects.key && !isObjectDetected) {
                setIsObjectDetected('key');
                const audio = new Audio('/beep-07a.mp3');
                audio.play().catch((err) => console.warn('🔇 Beep error:', err));
              }
            }
          }
        } catch (error) {
          console.error('🚫 Detection error:', error);
        }

        requestAnimationFrame(detect);
      };

      detect();
    };

    startCamera();

    timerRef.current = setTimeout(() => {
      console.log('⏰ Detection timeout.');
      setTimerExpired(true);
    }, detectionTime);

    return () => {
      clearTimeout(timerRef.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isObjectDetected, timerExpired, cameraPaused, detectedObjects]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'p' || event.key === 'P') {
        // Toggle pause/resume detection on 'P' key press
        setCameraPaused((prevState) => !prevState);
      }

      if (event.key === 's' || event.key === 'S') {
        // Stop the camera on 'S' key press
        if (videoRef.current?.srcObject) {
          videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
          setCameraError('Camera stopped by user');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <h4>📷 Camera Feed</h4>
      {cameraError && <p style={{ color: 'red' }}>🚫 Camera Error: {cameraError}</p>}
      <video ref={videoRef} autoPlay playsInline width="100%" height="auto" />
      {isObjectDetected && (
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '2em',
            fontWeight: 'bold',
            color: 'red',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: '10px',
            borderRadius: '10px',
            zIndex: 10,
          }}
        >
          ✅ {isObjectDetected.charAt(0).toUpperCase() + isObjectDetected.slice(1)} Detected
        </div>
      )}
      {timerExpired && !isObjectDetected && <p>⏰ Detection stopped after timeout.</p>}
      {cameraPaused && <p style={{ color: 'orange' }}>⏸️ Detection Paused. Press 'P' to resume.</p>}
    </div>
  );
};

export default CameraFeed;
