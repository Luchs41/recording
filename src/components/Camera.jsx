import React, { useEffect, useRef, useState } from 'react';
import styles from './Camera.module.css';
import axios from 'axios';

function CameraComponent({ count, setCount, hasPermission, setHasPermission }) {
  const videoRef = useRef(null);
  //const [hasPermission, setHasPermission] = useState(null);
  const [stream, setStream] = useState(null);
  //사용자 디바이스에 카메라가 없다면, 카메라가 없다는 메시지를 보여줌

  // test용 값
  const user_id = 'test';
  const uuid = '123';
  const exercise_type = 'pushup-left-arm';

  // 사용자가 카메라 접근 허용을 했는지 확인
  // 만약 허용을 안했다면, 허용을 요청
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        setHasPermission(true);
        setStream(stream);
      })
      .catch(err => {
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

  // 카메라가 없다면, 카메라가 없다는 메시지를 보여줌
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return <div>카메라가 없습니다.</div>;
  }
  // 카메라 접근 허용을 했다면, videoRef를 보여줌
  if (hasPermission === null) {
    return <div />;
  }
  // 카메라 접근 허용을 하지 않았다면, 허용을 요청하는 버튼 보여줌
  if (hasPermission === false) {
    return (
      <div>
        카메라 접근을 허용해주세요
        <br />
        <button
          onClick={() => {
            navigator.mediaDevices
              .getUserMedia({ video: true })
              .then(stream => {
                setHasPermission(true);
                setStream(stream);
              })
              .catch(err => {
                setHasPermission(false);
                console.log(err);
              });
          }}>
          허용
        </button>
      </div>
    );
  }
  //카메라도 있고, 허용도 됐다면 socket 연결 후 카메라 보여줌
  // const socket = new WebSocket('ws://localhost:3000');
  // socket.onopen = () => {
  //   console.log('connected');
  // };
  // socket.onmessage = (message) => {
  //   console.log(message);
  // };
  // socket.onclose = () => {
  //   console.log('disconnected');
  // };
  // socket.onerror = (err) => {
  //   console.log(err);
  // };
  //소켓 연결에 성공했다면, 3초에 한번씩 카메라 이미지를 서버로 보냄
  // if (socket.readyState === WebSocket.OPEN) {
  //   setInterval(() => {
  //     const canvas = document.createElement('canvas');
  //     canvas.width = videoRef.current.videoWidth;
  //     canvas.height = videoRef.current.videoHeight;
  //     canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
  //     const data = canvas.toDataURL('image/png');
  //     // 전송 전 이미지를 압축
  //     const compressedData = canvas.toDataURL('image/jpeg', 0.20);
  // 전송함
  //     socket.send(data);
  //     console.log(compressedData);
  //   }, 3000);
  // }
  //서버에서 받은 카운트를 setCount 함수를 이용해서 상태를 변경
  // socket.onmessage = (message) => {
  //   console.log(message);
  //   setCount(message.data);
  // };
  // 카메라 화면을 1초마다 캡쳐해서 서버로 보냄
  // http 요청으로 보내며, 서버에서 받은 카운트를 setCount 함수를 이용해서 상태를 변경
  setInterval(() => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    // 전송 전 이미지를 압축
    // const compressedData = canvas.toDataURL('image/jpeg', 0.2);
    // console.log(compressedData);
    canvas.toBlob(
      blob => {
        const formData = new FormData();
        formData.append('file', blob, 'file.jpg', { type: 'image/jpeg' });
        console.log(formData);
        axios
          .post(
            `http://34.69.53.183:8090/inference/image/${user_id}/${uuid}/${exercise_type}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          )
          .then(res => {
            console.log(res.data);
            if (res.data > count) {
              setCount(res.data);
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      'image/jpeg',
      0.2,
    );
    // 전송함
    // http://34.69.53.183:8090/inference/image/{user_id}/{uuid}으로 요청
    // axios
    //   .post(
    //     `http://34.69.53.183:8090/inference/image/${user_id}/${uuid}/${exercise_type}`,
    //     {
    //       file: compressedData,
    //     },
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     },
    //   )
    //   .then(res => {
    //     console.log(res.data);
    //     if (res.data > count) {
    //       setCount(res.data);
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }, 3000);

  return (
    <video playsInline autoPlay ref={videoRef} className={styles.camera} />
  );
}

export default CameraComponent;
