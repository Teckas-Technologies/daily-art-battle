import React from "react";
import "./NoPage.css";
const NoPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#000000] text-center">
      <div>
        <div className="flex items-center justify-center mb-4">
          <img src="/images/logo.png" alt="Logo" className="w-[130px] md:w-[180px]" />
        </div>

        <h1 className="text-[#00FF00] text-7xl md:text-9xl font-bold flex items-end justify-center gap-2">
          404 <span className="text-[#00FF00] text-sm md:text-xl item-end">Error</span>
        </h1>

        <p className="text-white text-lg md:text-xl mt-4">
          OOPS!, Sorry we cannot find that page
        </p>
      </div>
    </div>
  );
};

export default NoPage;
