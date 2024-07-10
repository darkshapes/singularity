
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

  const milli = `0 ${(time / 59.94) % 1000}`.slice(-2);
  const seconds = `0 ${Math.floor((time / 1000) % 60)}`.slice(-2);
  const minutes = `0 ${Math.floor((time / 60000) % 60)}`.slice(-2);
  const hours = `0 ${Math.floor((time / 3600000) % 60)}`.slice(-2);

  const score = hours + minutes + seconds + milli;

  // console.log(score);

  // console.log(time);

  return (
    <>
      <h1>
       <Timer active={start} duration={null}>
        <Timecode format="HH:mm:ss.SSS" time={time} 
         className="keytime min-w-[14rem] w-ful top-9 ml-[87%]"
        style={{ position: "absolute", FontFace: "Kode Mono"}}
        />
       </Timer>
      </h1>
      <div>
        <button onClick={() => setStart(true)}>Start</button>
        <button onClick={() => setStart(false)}>Stop</button>
        <button
          onClick={() => {
            setTime(0);
            setStart(false);
          }}
        >
          Reset
        </button>
      </div>
    </>
  );
};

export default KeyTimeCode;