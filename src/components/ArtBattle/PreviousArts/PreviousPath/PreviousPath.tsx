import React from "react";
import './PreviousPath.css'
const PreviousPath = () => {
  return (
    <div className="flex justify-center items-center bg-black py-[40px]">
      <a
        href="/previous" target="_blank"
        className="text-[#00FF00] text-xl font-semibold underline"
      >
        Go to previous battles &gt;
      </a>
    </div>
  );
};

export default PreviousPath;
