import {useRef,useEffect} from 'react'
import './Face.css'
import * as faceapi from 'face-api.js'
import { useNavigate } from 'react-router-dom'



function Face(){
  const videoRef = useRef()
  const canvasRef = useRef()
  const navigate = useNavigate();

  useEffect(()=>{
    startVideo()
    videoRef && loadModels()

  },[])



  // OPEN YOU FACE WEBCAM
  const startVideo = ()=>{
    navigator.mediaDevices.getUserMedia({video:true})
    .then((currentStream)=>{
      videoRef.current.srcObject = currentStream
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  // LOAD MODELS FROM FACE API

  const loadModels = ()=>{
    Promise.all([
      // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models")

      ]).then(()=>{
      faceMyDetect()
    })
  }

  const faceMyDetect = ()=>{
    setInterval(async()=>{
      const detections = await faceapi.detectAllFaces(videoRef.current,
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

      // DRAW YOU FACE IN WEBCAM
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current)
      faceapi.matchDimensions(canvasRef.current,{
        width:940,
        height:650
      })

      const resized = faceapi.resizeResults(detections,{
         width:940,
        height:650
      })

      faceapi.draw.drawDetections(canvasRef.current,resized)
      faceapi.draw.drawFaceLandmarks(canvasRef.current,resized)
      faceapi.draw.drawFaceExpressions(canvasRef.current,resized)

      if (detections.length > 0) {
        // Check if the face is frontal or not
        const face = detections[0];
        if (face && face.landmarks && face.landmarks._positions) {
          const nose = face.landmarks._positions[33]; // Assuming nose landmark is at index 33
          const leftEye = face.landmarks._positions[0]; // Assuming left eye landmark is at index 0
          const rightEye = face.landmarks._positions[16]; // Assuming right eye landmark is at index 16
  
          // Calculate the angle between eyes and nose
          const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) - Math.atan2(nose.y - leftEye.y, nose.x - leftEye.x);
          const angleDeg = Math.abs(angle * 180 / Math.PI);
  
          if (angleDeg < 30) {
              navigate('/home');
          } 
        }
      } 
    },1000)
  }

  return (
    <div className="myapp">
    <h1>Face Detection</h1>
      <div className="appvide">
        
      <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
      </div>
      <canvas ref={canvasRef} width="940" height="650"
      className="appcanvas"/>
    </div>
    )

}

export default Face;