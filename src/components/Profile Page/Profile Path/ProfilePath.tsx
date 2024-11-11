import React from 'react'
import InlineSVG from 'react-inlinesvg'

const ProfilePath = () => {
  return (
    <div className="flex gap-1 items-center camapign-path md:mb-10 pt-20">
    <button className="camapign-path-button">GFXvs</button>
    <InlineSVG
      src="/icons/green-arrow.svg"
      className="fill-current text-green-500"
    />
    <h3 className="text-green-500 spartan-semibold underline cursor-pointer">
      My Profile
    </h3>
  </div>
  )
}

export default ProfilePath