"use client";
import "./Spinner.css";
import Loader from "../../Loader/Loader";

interface SpinnerProps {
  spinnerUrl: string | undefined;
}

export const Spinner: React.FC<SpinnerProps> = ({ spinnerUrl }) => {
  return (
    <div className="flex w-full justify-center mt-5">
      <div className="spinner-img relative w-full md:max-w-[26.5rem] max-w-[17rem] rounded-2xl aspect-square m-auto overflow-hidden select-none">
        {!spinnerUrl ? (
          <Loader md="24.5" sm="15" />
        ) : (
          <img
            alt="spinner"
            draggable={false}
            src={spinnerUrl}
            className="w-full h-full object-cover rounded-2xl"
          />
        )}
      </div>
    </div>
  );
};
