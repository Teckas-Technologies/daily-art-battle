import React from "react";
import "./PreviousPath.css";
import InlineSVG from "react-inlinesvg";
const PreviousPath = () => {
  return (
    <div className="flex justify-center flex-row items-center bg-black py-[40px]">
      <a
        href="/previous"
        target="_blank"
        className="flex items-center justify-center text-[#00FF00] text-2xl font-semibold underline"
      >
        Go to previous battles <InlineSVG src="/icons/green-rightarrow.svg" className="w-[30px] h-[30px] mt-[6px]"/>
      </a>
    </div>
  );
};

export default PreviousPath;
