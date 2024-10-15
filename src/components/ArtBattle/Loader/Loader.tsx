import React, { useEffect, useState } from "react";
import "./Loader.css"; 

const Loader = () => {
  const [count, setCount] = useState(0);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const duration = 10000; 
    const intervalTime = 500; 

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
       
        const randomIncrement = Math.floor(Math.random() * 20) + 1; 
        const newProgress = Math.min(prevProgress + randomIncrement, 100); 
        return newProgress;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCount(progress);
  }, [progress]);

  return (
    <div className="loader-container">
      <div className="logo">
        <img src="/images/logo.png" alt="Logo" className="logo-image" />
      </div>
      <div className="count-progress-wrapper">
        <div className="progress-count">{count < 10 ? `0${count}` : count}</div>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;