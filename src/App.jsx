// src/App.js
import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import test from './assets/sunglass-test1.png';

const App = () => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const [eyePosition, setEyePosition] = useState({ left: 0, top: 0 });
  const [angle, setAngle] = useState(0);
  const [glassesWidth, setGlassesWidth] = useState(0);

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
        // console.log("left", video.getBoundingClientRect().left);

        // console.log("width", video.getBoundingClientRect().width);
        let scale = 600 / video.getBoundingClientRect().width
        // console.log("scale", scale);


        // console.log('x', detections[0].landmarks.getNose()[0].x);


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

        // console.log("asasas", detections[0].landmarks.getNose()[0].y);

        // console.log('sum', video.getBoundingClientRect().left + ((leftEye[0].x + rightEye[3].x) / 2 * scale) - 20);
        // console.log('sum', video.getBoundingClientRect().left + (detections[0].landmarks.getNose()[0].x / scale) - 20);

        setEyePosition({
          left: video.getBoundingClientRect().left + ((leftEye[0].x + rightEye[3].x) / (2 * scale)) - (15 / scale) - (glassesWidth / 2),
          top: (detections[0].landmarks.getNose()[0].y / scale) - (25 / scale),
        });



      }
    }
  };

  useEffect(() => {
    const interval = setInterval(detectFaces, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {loading ? (
        <p>Loading models...</p>
      ) : (
        <>
          <Webcam ref={webcamRef} style={{ width: '100%', maxWidth: '600px' }} />
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
        </>
      )}
    </div>
  );
};

export default App;



// import React, { useRef, useEffect, useState } from 'react';
// import Webcam from 'react-webcam';
// import * as faceapi from 'face-api.js';
// import test from './assets/sunglass-test1.png';

// const App = () => {
//   const webcamRef = useRef(null);
//   const [initialized, setInitialized] = useState(false);
//   const [eyePosition, setEyePosition] = useState({ left: 0, top: 0 });
//   const [angle, setAngle] = useState(0);
//   const [glassesWidth, setGlassesWidth] = useState(0);
//   const [isLoaded, setIsLoaded] = useState(false);

//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const loadModels = async () => {
//       const MODEL_URL = '/models';
//       await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//       await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
//       setInitialized(true);
//     };
//     loadModels();
//   }, []);



//   const detectFace = async () => {
//     if (initialized && webcamRef.current && webcamRef.current.video.readyState === 4) {
//       const video = webcamRef.current.video;

//       const displaySize = { width: video.videoWidth, height: video.videoHeight };
//       const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
//       const resizedDetections = faceapi.resizeResults(detections, displaySize);

//       if (resizedDetections.length > 0) {
//         const landmarks = resizedDetections[0].landmarks;
//         const leftEye = landmarks.getLeftEye();
//         const rightEye = landmarks.getRightEye();


//         const scaleX = window.innerWidth / video.videoWidth;
//         const scaleY = window.innerHeight / video.videoHeight;

//         const eyeDistance = (rightEye[3].x - leftEye[0].x) * scaleX

//         const glassesWidth = eyeDistance * 1.2;


//         // const glassesWidth = eyeDistance;
//         console.log("x", landmarks.getNose()[0].x);

//         console.log("x-eye", (rightEye[3].x + leftEye[0].x) / 2);
//         console.log("x_scale", landmarks.getNose()[0].x * scaleX);

//         // console.log("x_scale", landmarks.getNose()[0].x / scaleX);


//         console.log("scaleX", scaleX);
//         // console.log("scaleY", scaleY);
//         // console.log("x/Y", scaleX / scaleY);

//         // console.log("y", landmarks.getNose()[0].y);
//         // console.log("Y_scale", landmarks.getNose()[0].y * scaleY);


//         // console.log("eye", eyeDistance);

//         // console.log("eye_scale", eyeDistance * scaleX);
//         // console.log("width", glassesWidth);
//         // console.log("scalex", scaleX);

//         // console.log("13", document.getElementById("video").videoHeight);

//         // console.log("top", webcamRef.current.video.getBoundingClientRect());
//         // console.log("top2", video.videoHeight);
//         // console.log("top4", video.videoWidth);

//         // console.log("top3", (webcamRef.current.video.getBoundingClientRect().height - video.videoHeight) / 2);



//         const deltaX = rightEye[3].x - leftEye[0].x;
//         const deltaY = rightEye[3].y - leftEye[0].y;

//         const angleCl = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
//         setAngle(angleCl)

//         setEyePosition({
//           left: (landmarks.getNose()[0].x * scaleX) - (
//             eyeDistance * Math.cos(Math.atan2(deltaY, deltaX)) / 2),
//           top: (landmarks.getNose()[0].y),
//         });
//         setGlassesWidth(glassesWidth);
//         setIsLoaded(true);
//       }
//     }
//   };


//   useEffect(() => {
//     const interval = setInterval(detectFace, 5000);
//     return () => clearInterval(interval);
//   }, [initialized]);

//   return (
//     <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", width: 'auto', height: 'auto' }}>
//       <Webcam
//         ref={webcamRef}
//         audio={false}
//         screenshotFormat="image/jpeg"
//         videoConstraints={{
//           facingMode: "user",
//           width: { ideal: 640 },
//           height: { ideal: 360 },
//         }}
//         style={{
//           width: '100%',
//           height: "auto"
//         }}
//         id="video"
//       />
//       {isLoaded && (
//         <img
//           id='glasses'
//           src={test}
//           alt="Glasses"
//           style={{
//             position: 'absolute',
//             left: `${eyePosition.left}px`,
//             top: `${eyePosition.top}px`,
//             width: `${glassesWidth}px`,
//             transform: `rotate(${angle}deg)`,
//             pointerEvents: 'none',
//           }}
//         />
//       )}


//     </div>
//   );
// };

// export default App;