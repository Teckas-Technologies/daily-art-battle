import React from "react";
import "./Loader.css";

interface Props {
  md: string;
  sm: string;
}

const Loader: React.FC<Props> = ({ md, sm }) => {
  return (
    <div className="new-loading flex w-full justify-center">
      <div className={`loader-gif md:w-[${md}rem] md:h-[${md}rem] w-[${sm}rem] h-[${sm}rem]`}>
        <img src="/images/gfxvs_loader.gif" alt="loader" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Loader;