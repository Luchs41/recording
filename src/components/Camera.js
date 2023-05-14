import React, { useEffect, useRef, useState } from 'react';
import styles from './Camera.module.css';

function CameraComponent() {
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [stream, setStream] = useState(null);
  //사용자 디바이스에 카메라가 없다면, 카메라가 없다는 메시지를 보여줌

  // 사용자가 카메라 접근 허용을 했는지 확인
  // 만약 허용을 안했다면, 허용을 요청
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        setHasPermission(true);
        setStream(stream);
      })
      .catch((err) => {
        setHasPermission(false);
        console.log(err);
      });
  }, []);
  // 카메라 접근 허용을 했다면, videoRef에 stream을 넣어줌
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [hasPermission, stream]);
  // 3초마다 video 화면을 이미지로 캡쳐해서 서버로 보냄
  // useEffect(() => {
  //   if (videoRef.current && stream) {
  //     setInterval(() => {
  //       const canvas = document.createElement('canvas');
  //       canvas.width = videoRef.current.videoWidth;
  //       canvas.height = videoRef.current.videoHeight;
  //       canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
  //       const data = canvas.toDataURL('image/png');
  //       // 전송 전 이미지를 압축
  //       const compressedData = canvas.toDataURL('image/jpeg', 0.20);

  //       // socket.send(data);
  //       console.log(compressedData);
  //     }, 3000);
  //   }
  // }, [videoRef, stream]);

  // 카메라 접근 허용을 했다면, videoRef를 보여줌
  if (hasPermission === null) {
    return <div />;
  }
  // 카메라 접근 허용을 하지 않았다면, 허용을 요청하는 버튼 보여줌
  if (hasPermission === false) {
    return <div>카메라 접근을 허용해주세요<button onClick={() => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          setHasPermission(true);
          setStream(stream);
        })
        .catch((err) => {
          setHasPermission(false);
          console.log(err);
        });
    }}>허용</button></div>;
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return <div>카메라가 없습니다.</div>;
  }

  return (

    <video autoPlay ref={videoRef} className={styles.camera} />



  );
};

export default CameraComponent;
