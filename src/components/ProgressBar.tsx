import { useState, useEffect } from "react";

export default function ProgressBar({ timer }) {
  //state variable to manage the progress bar

  const [remainingTime, setRemainingTime] = useState(timer);

  useEffect(() => {
    //execute a function on X time
    // creates infitine loop without useEffect
    const interval = setInterval(() => {
      console.log("interval");

      setRemainingTime((prevTime) => prevTime - 10);
    }, 10);
    // need the clear interval function so the interval will stop
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <progress value={remainingTime} max={timer} />;
}

//this interval runs every 10ms, so we have it as a separate component to run only when the component get's re rendered
