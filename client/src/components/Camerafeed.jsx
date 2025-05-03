import React, { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const CameraFeed = () => {
  const videoRef = useRef(null);
  const [isBottleDetected, setIsBottleDetected] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const timerRef = useRef(null);

  const detectionTime = 20000; // 20 seconds

  useEffect(() => {
    const startCamera = async () => {
      try {
        // Access mobile camera or default video feed
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment' // Use the rear camera on mobile devices
          }
        });
        videoRef.current.srcObject = stream;
        console.log('🎥 Mobile camera started');
      } catch (error) {
        console.error('🚫 Camera error:', error);
      }
    };

    const loadModel = async () => {
      try {
        const model = await cocoSsd.load();
        console.log('✅ Model loaded!');
        detectObjects(model);
      } catch (error) {
        console.error('🚫 Model loading error:', error);
      }
    };

    const detectObjects = (model) => {
      const detect = async () => {
        if (timerExpired || isBottleDetected) {
          // Stop detection if the bottle is already detected or the timer expired
          return;
        }

        try {
          const predictions = await model.detect(videoRef.current);
          console.log('🎯 Predictions:', predictions);

          // Look for "bottle" in predictions (case-insensitive)
          const bottle = predictions.find((prediction) => prediction.class.toLowerCase() === 'bottle');

          if (bottle && !isBottleDetected) {
            setIsBottleDetected(true);
            console.log('🍼 Bottle detected!');
            const audio = new Audio('/beep-07a.mp3');
            audio.play().catch((err) => console.warn('🔇 Beep error:', err));
          }
        } catch (error) {
          console.error('🚫 Detection error:', error);
        }

        // Keep detecting objects
        requestAnimationFrame(detect);
      };

      detect();
    };

    loadModel();
    startCamera();

    timerRef.current = setTimeout(() => {
      console.log("⏰ Detection timeout.");
      setTimerExpired(true);
    }, detectionTime);

    return () => {
      clearTimeout(timerRef.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isBottleDetected, timerExpired]);

  return (
    <div style={{ position: 'relative' }}>
      <h4>📷 Camera Feed (Detecting: Bottle)</h4>
      <video ref={videoRef} autoPlay width="100%" height="auto" />
      {isBottleDetected && (
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
          🍼 Bottle Detected
        </div>
      )}
      {timerExpired && <p>⏰ Detection stopped after timeout.</p>}
    </div>
  );
};

export default CameraFeed;
