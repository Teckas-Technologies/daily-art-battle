import React, { useEffect, useState } from "react";
import "./Loader.css";

interface Props {
  md: string;
  sm: string;
}

const Loader: React.FC<Props> = ({ md, sm }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Clean up listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const size = isMobile ? sm : md;

  return (
    <div className="new-loading flex w-full justify-center">
      <div
        style={{
          width: `${size}rem`,
          height: `${size}rem`,
        }}
        className={`loader-gif`}
      >
        <img src="/images/gfxvs_loader.gif" alt="loader" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Loader;