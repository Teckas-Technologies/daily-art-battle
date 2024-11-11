"use client";
import "./Spinner.css";
import { useState } from "react";
import Loader from "../../Loader/Loader";

interface SpinnerProps {
  spinnerUrl: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ spinnerUrl }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const handleImageLoad = () => setLoading(false);

  return (
    <div className="flex w-full justify-center mt-5">
      <div className="spinner-img relative w-full md:max-w-[26.5rem] max-w-[17rem] rounded-2xl aspect-square m-auto overflow-hidden select-none">
        {loading || !spinnerUrl ? (
          <Loader />
        ) : (
          <img
            alt="spinner"
            draggable={false}
            src={spinnerUrl}
            onLoad={handleImageLoad}
            onError={() => setLoading(true)}
            className="w-full h-full object-cover rounded-2xl"
          />
        )}
      </div>
    </div>
  );
};
