import React from 'react'
import InlineSVG from 'react-inlinesvg'

const ProfilePath = () => {
  return (
    <div className="flex gap-0 md:gap-1 items-center mt-[120px] md:mt-[100px] md:mt-[140px] mb-[16px] md:mb-[20px]">
      <button className="camapign-path-button text-sm md:text-base">GFXvs</button>
      <InlineSVG
        src="/icons/green-arrow.svg"
        className="w-4 h-4 md:w-5 md:h-5"
      />
      <h3 className="text-[#00FF00] spartan-medium underline cursor-pointer text-xs md:text-sm">
        My Profile
      </h3>
    </div>
  )
}

export default ProfilePath
