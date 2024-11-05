"use client"
import React, { useState,useRef, useEffect } from 'react';
import { ArtData } from "../hooks/artHooks";
import { useMbWallet } from "@mintbase-js/react";
import {Vote } from "../hooks/useRaffleTickets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
interface OverlayProps {
    art: ArtData;
    onClose: () => void;
    onVote: (id: string) => Promise<void>;
    votes:Vote[]
  }
export const Overlay: React.FC<OverlayProps> = ({ art, onClose ,onVote ,votes}) => {  
    const overlayRef = useRef<HTMLDivElement>(null);
    const [url, setUrl] = useState('');
    const [message, setMessage] = useState('Check out this art and put your votes');
    const { isConnected, selector, connect, activeAccountId } = useMbWallet();

    useEffect(() => {    
      function handleClickOutside(event: MouseEvent) {
        if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
          onClose();
        }
      }
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [onClose]);

    useEffect(() => {
      setUrl(window.location.href)
     }, [art]);
    

  return (
    <div className="navbar fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{ width: '100vw' }}>
      <div className="bg-white p-4 rounded-lg" style={{ backgroundColor: '#101011f0',maxWidth: '500px', border: '2px dotted #3deb34', height: 'auto' , position: 'relative', maxHeight: '95vh', overflow: 'scroll', scrollbarWidth: 'none' }}>
  
       <div
        ref={overlayRef}
        className="bg-white text-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full relative"
      >
            <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
         <svg className='w-6 h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#000000" d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>
        </button>
          <img className="mt-5 rounded-t-lg" src={art?.colouredArt} alt="" />
        <h5 className="sm:text-xs mt-2 lg:text-xl font-bold mb-2">Title: <span className='break-all'>{art?.arttitle}</span></h5>
        <p className="sm:text-xs lg:text-xl mb-2">Artist Id:<span className='break-all'> {art?.artistId}</span></p>
        <p className="sm:text-xs lg:text-xl mb-4">Up Votes: {`${art?.upVotes}`}</p>
        <button
                  onClick={() => onVote(art._id)}
                  className={`
   bottom-0 right-1 mb-2 text-white text-md sm:text-xl md:text-2xl h-6 right-0
    ${
      votes.some(
        (vote) =>
          vote.artId === art._id && vote.participantId === activeAccountId
      )
        ? "bg-green-800"
        : "bg-blue-700 hover:bg-blue-400"
    }
    text-white rounded-md px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm md:px-5 md:py-2 md:text-base sm:h-12 md:h-15
  `}
                  disabled={votes.some(
                    (vote) =>
                      vote.artId === art._id &&
                      vote.participantId === activeAccountId
                  )}
                ><div className="flex items-center">
                <FontAwesomeIcon
                  icon={faArrowUp}
                  className="text-white mr-1 flex-shrink-0"
                />
                <h2 className="text-white text-md sm:text-xl md:text-xl flex-shrink-0">{`${art.upVotes}`}</h2>
              </div></button>
        <div className="flex justify-center space-x-4">
          <a href={`https://twitter.com/intent/tweet?url=%20${url}%2F&via=mintbase&text=${message}`} target="_blank" rel="noopener noreferrer">
            <svg className="w-6 h-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="currentColor" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
            </svg>
          </a>
          <a href={`https://telegram.me/share/url?url=${url}&text=${message}`} target="_blank" rel="noopener noreferrer">
            <svg className="w-6 h-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
              <path fill="currentColor" d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z"/>
            </svg>
          </a>
          <a href={`https://api.whatsapp.com/send?text=${message}%20${url}`} target="_blank" rel="noopener noreferrer">
            <svg className="w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
          </a>
        </div>
      </div>
      </div>
      
    </div>
  );
};

export default Overlay;