import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const App = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [initialized, setInitialized] = useState(false);

  // بارگذاری مدل‌های مورد نیاز face-api
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      setInitialized(true);
    };
    loadModels();
  }, []);

  // تابعی برای تشخیص چهره
  const detectFace = async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvasRef.current, displaySize);

      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvasRef.current.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
    }
  };

  // اجرای تشخیص چهره هر 100 میلی‌ثانیه
  useEffect(() => {
    if (initialized) {
      const interval = setInterval(detectFace, 500);
      return () => clearInterval(interval);
    }
  }, [initialized]);

  return (
    <div style={{ width: '100%', height: 'auto' }}>
      <Webcam
        ref={webcamRef}
        audio={false}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 'auto',
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 'auto',
        }}
      />
    </div>
  );
};

export default App;

// import React, { useRef, useEffect, useCallback } from 'react';
// import Webcam from 'react-webcam';
// import * as faceDetection from '@tensorflow-models/face-detection';
// import '@tensorflow/tfjs-backend-webgl';

// const App = () => {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const loadModelAndStartDetection = async () => {
//       // مدل را بارگذاری کنید
//       // const model = await faceDetection.load(faceDetection.SupportedModels.MediaPipeFaceDetector, {
//       //   runtime: 'tfjs',
//       // });
//       const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
//       const detectorConfig = {
//         runtime: 'tfjs', // or 'tfjs'
//       }
//       const detector = await faceDetection.createDetector(model, detectorConfig);

//       // شروع به تشخیص چهره کنید
//       detectFace(detector);
//     };

//     loadModelAndStartDetection();
//   }, []);

//   const detectFace = useCallback(async (model) => {
//     if (webcamRef.current && canvasRef.current) {
//       const video = webcamRef.current.video;
//       const canvas = canvasRef.current;
//       const context = canvas.getContext('2d');

//       const detectionLoop = async () => {
//         if (video.readyState === 4) {
//           const faces = await model.estimateFaces(video);

//           console.log(faces);

//           // بوم را پاکسازی کنید
//           // context.clearRect(0, 0, canvas.width, canvas.height);


//           // چهره‌ها را رسم کنید
//           // faces.forEach((face) => {
//           //   const { topLeft, bottomRight } = face.boundingBox;
//           //   context.strokeStyle = 'red';
//           //   context.lineWidth = 2;
//           //   context.strokeRect(topLeft[0], topLeft[1], bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]);
//           // });
//         }

//         requestAnimationFrame(detectionLoop);
//       };

//       detectionLoop();
//     }
//   }, []);

//   return (
//     <div>
//       <Webcam
//         ref={webcamRef}
//         // style={{ display: 'none' }}
//         audio={false}
//         screenshotFormat="image/jpeg"
//         videoConstraints={{ facingMode: 'user' }}
//       />
//       <canvas ref={canvasRef} width="640" height="480" />
//     </div>
//   );
// };

// export default App;



// // import React, { useRef, useEffect } from 'react';
// // import * as faceDetection from '@tensorflow-models/face-detection';
// // import '@tensorflow/tfjs-backend-webgl';
// // import Webcam from 'react-webcam';

// // const App = () => {
// //   const webcamRef = useRef(null);
// //   const canvasRef = useRef(null);

// //   useEffect(() => {
// //     const loadModelAndStartCamera = async () => {
// //       // مدل را بارگذاری کنید
// //       // const model = await faceDetection.load(faceDetection.SupportedModels.MediaPipeFaceDetector, {
// //       //   runtime: 'tfjs',
// //       // });
// //       const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
// //       const detectorConfig = {
// //         runtime: 'tfjs', // or 'tfjs'
// //       }
// //       const detector = await faceDetection.createDetector(model, detectorConfig);

// //       // دوربین را راه‌اندازی کنید
// //       const stream = await navigator.mediaDevices.getUserMedia({
// //         video: { facingMode: 'user' },
// //       });
// //       videoRef.current.srcObject = stream;

// //       videoRef.current.onloadeddata = () => {
// //         detectFace(detector);
// //       };
// //     };

// //     loadModelAndStartCamera();
// //   }, []);

// //   const detectFace = async (model) => {
// //     if (videoRef.current && canvasRef.current) {
// //       const video = videoRef.current;
// //       const canvas = canvasRef.current;
// //       const context = canvas.getContext('2d');

// //       const detectionLoop = async () => {
// //         const faces = await model.estimateFaces(video);
// //         context.clearRect(0, 0, canvas.width, canvas.height);

// //         console.log(faces);

// //         // faces.forEach((face) => {
// //         //   const { topLeft, bottomRight } = face.boundingBox;
// //         //   context.strokeStyle = 'red';
// //         //   context.lineWidth = 2;
// //         //   context.strokeRect(topLeft[0], topLeft[1], bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]);
// //         // });

// //         requestAnimationFrame(detectionLoop);
// //       };

// //       detectionLoop();
// //     }
// //   };

// //   return (
// //     <div>
// //       <Webcam
// //         ref={webcamRef}
// //         style={{ display: 'none' }}
// //         audio={false}
// //         screenshotFormat="image/jpeg"
// //         videoConstraints={{ facingMode: 'user' }}
// //       />
// //       <canvas ref={canvasRef} width="640" height="480" />
// //     </div>
// //   );
// // };

// // export default App;
