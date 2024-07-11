
import React, { useEffect, useState } from "react";
import Timer from "react-timer-wrapper";
import Timecode from "react-timecode";
import './timecode.css';

const KeyTimeCode = () => {
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(false);

  const onTimerStart = () => {
    setStart(true);
  };

  useEffect(() => {
    let interval = null;

    if (start) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [start]);

  return (
    <>
      <h1>
       <Timer active={start} duration={null}>
        <Timecode format="HH:mm:ss.SSS" time={time} 
         className="keytime"
        style={{ FontFamily: "Kode Mono", cursor: "default"}} onClick={() => setStart(true)}
        />
       </Timer>
      </h1>
    </>
  );
};

export default KeyTimeCode;