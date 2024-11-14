import React from 'react'
import InlineSVG from 'react-inlinesvg'

const ProfilePath = () => {
  return (
    <div className="flex gap-0 md:gap-3 items-center mt-[100px] md:mt-[140px] mb-[16px] md:mb-[20px]">
      <button className="text-sm md:text-base">GFXvs</button>
      <InlineSVG
        src="/icons/green-arrow.svg"
        className="fill-current text-green-500 w-4 h-4 md:w-6 md:h-6"
      />
      <h3 className="text-[#00FF00] spartan-medium underline cursor-pointer text-xs md:text-lg">
        My Profile
      </h3>
    </div>
  )
}

export default ProfilePath
