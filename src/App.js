import React from 'react';
import { useEffect, useState, useRef } from 'react';
import style from './App.css';
import CameraComponent from './components/Camera';


function App() {
  // socket 연결
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:3000');
    setSocket(newSocket);
    console.log('connected');
    return () => {
      console.log('.');
    }
  }, []);
  // // socket 연결이 되었다면, socket에 메시지를 보냄
  // useEffect(() => {
  //   if (socket) {
  //     socket.send('Hello!');
  //   }
  // }, [socket]);
  // // socket 연결이 되었다면, socket에서 메시지를 받음
  // useEffect(() => {
  //   if (socket) {
  //     socket.onmessage = (message) => {
  //       console.log(message);
  //     };
  //   }
  // }, [socket]);

  return (
    <div className={style.container}>
      <CameraComponent />
      <div className={style.test}>hi</div>
    </div>
  );
}

export default App;
