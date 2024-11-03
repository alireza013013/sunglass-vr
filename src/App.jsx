import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import test from './assets/sunglass-test1.png';
import "./App.css"

const App = () => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isFoundKeyPoint, setIsFoundKeyPoint] = useState(false);
  const [eyePosition, setEyePosition] = useState({ left: 0, top: 0 });
  const [angle, setAngle] = useState(0);
  const [glassesWidth, setGlassesWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      setLoading(false);
    };
    loadModels();
  }, []);

  const detectFaces = async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

      if (detections.length > 0) {
        setIsFoundKeyPoint(true)
        let scale = 600 / video.getBoundingClientRect().width
        const landmarks = detections[0].landmarks;
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const eyeDistance = (rightEye[3].x - leftEye[0].x)
        const glassesWidth = (eyeDistance * 1.6) / scale;
        setGlassesWidth(glassesWidth);
        const deltaX = rightEye[3].x - leftEye[0].x;
        const deltaY = rightEye[3].y - leftEye[0].y;
        const angleCl = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        setAngle(angleCl)
        setEyePosition({
          left: video.getBoundingClientRect().left + ((leftEye[0].x + rightEye[3].x) / (2 * scale)) - (glassesWidth / 2),
          top: (detections[0].landmarks.getNose()[0].y / scale) - (20 / scale) + 20,
        });

        // console.log("video from left", video.getBoundingClientRect().left);
        // console.log("video width", video.getBoundingClientRect().width);
        // console.log("video height", video.getBoundingClientRect().height);
        // console.log("scale for width", scale);
        // console.log("mean eye", (leftEye[0].x + rightEye[3].x) / 2);
        // console.log("mean eye scale", (leftEye[0].x + rightEye[3].x) / (2 * scale));
        // console.log('final', video.getBoundingClientRect().left + ((leftEye[0].x + rightEye[3].x) / (2 * scale)) - 20);
        // console.log("eye y heght", detections[0].landmarks.getNose()[0].y);
        // console.log("final y heght", (detections[0].landmarks.getNose()[0].y / scale) - (30 / scale));
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(detectFaces, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <span className='loading-text'>Loading...</span>
        </div>
      ) : (
        <>
          <Webcam ref={webcamRef}
            videoConstraints={{
              height: isMobile ?
                { ideal: 600, max: 600, min: 600 } : { ideal: 400, max: 400, min: 400 }
              ,
              width: isMobile ?
                { ideal: 500, max: 500, min: 500 } : { ideal: 600, max: 600, min: 600 }
            }}
            className='webcam'
          />
          <img
            id='glasses'
            src={test}
            alt="Glasses"
            style={{
              position: 'absolute',
              left: `${eyePosition.left}px`,
              top: `${eyePosition.top}px`,
              width: `${glassesWidth}px`,
              transform: `rotate(${angle}deg)`,
              pointerEvents: 'none',
            }}
          />
          {
            !isFoundKeyPoint && <span className='hint-text'>
              Finding key points
              <br />
              Please place your head in the middle of the frame
            </span>
          }
        </>
      )}
    </div>
  );
};

export default App;