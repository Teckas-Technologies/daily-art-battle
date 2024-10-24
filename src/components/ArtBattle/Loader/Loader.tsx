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
      <img src="/images/loader.gif" alt="Loading..." className="loader-gif" />
    </div>
  );
};

export default Loader;