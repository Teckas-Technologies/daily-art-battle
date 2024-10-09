"use client";
import InlineSVG from 'react-inlinesvg';
import './Slider.css';

import { useState } from "react";

interface Props {
    artA: any,
    artB: any
}

export const Slider: React.FC<Props> = ({ artA, artB }) => {
    const [popupA, setPopUpA] = useState(false);
    const [popupB, setPopUpB] = useState(false);

    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const handleMove = (event: any) => {
        if (!isDragging) return;

        let clientX;
        if (event.type === "touchmove") {
            clientX = event.touches[0].clientX;
        } else {
            clientX = event.clientX;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));

        setSliderPosition(percent);
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = () => {
        setIsDragging(true);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handlePopUpB = () => {
        setPopUpB(true);
    }
    const closePopUpB = () => {
        setPopUpB(false);
    }

    const handlePopUpA = () => {
        setPopUpA(true);
    }
    const closePopUpA = () => {
        setPopUpA(false);
    }
    return (
        <>
            {/* Slider battle starts */}
            <div className="flex w-full justify-center mt-5">
                <div
                    className="w-full relative"
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="slider-img relative w-full md:max-w-[26.5rem] max-w-[17rem] rounded-2xl aspect-square m-auto overflow-hidden select-none"
                        onMouseMove={handleMove}
                        onMouseDown={handleMouseDown}
                        onTouchMove={handleMove}
                        onTouchStart={handleTouchStart}
                    >
                        <div className="relative w-full h-full">
                            <img
                                alt={artB?.title}
                                draggable={false}
                                src={artB?.imageUrl}
                                className="w-full h-full object-cover rounded-2xl"
                            />
                            <h2 className='absolute bottom-7 left-7 spartan-bold font-bold'>Art B</h2>
                        </div>
                        <div
                            className="slider-img absolute top-0 left-0 right-0 w-full md:max-w-[26.5rem] max-w-[17rem] rounded-2xl aspect-square m-auto overflow-hidden select-none"
                            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                        >
                            <div className="relative w-full h-full">
                                <img
                                    draggable={false}
                                    alt={artA?.title}
                                    src={artA?.imageUrl}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                                <h2 className='absolute bottom-7 left-7 spartan-bold font-bold'>Art A</h2>
                            </div>
                        </div>
                        <div
                            className="absolute top-0 bottom-0 w-1 cursor-ew-resize"
                            style={{
                                left: `calc(${sliderPosition}% - 1px)`,
                                backgroundColor: "#ffffff",
                            }}
                        >
                            <div
                                className="absolute flex items-center justify-center"
                                style={{
                                    top: "calc(50% - 12px)",
                                    transform: "translateX(-50%)",
                                }}
                            >
                                <div className="ml-1">
                                    <InlineSVG
                                        src="/icons/slider-arrow.svg"
                                        className="fill-curren h-11 w-11"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Slider battle ended */}
        </>
    )
}