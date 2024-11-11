"use client"
import CampaignSuccess from '@/components/Campaign page/Campaign Success/CampaignSuccess'
import Footer from '@/components/Footer/Footer'
import { FooterMenu } from '@/components/FooterMenu/FooterMenu'
import { Header } from '@/components/Header/Header'
import React, { useState } from 'react'

const page = () => {
  const [openNav, setOpenNav] = useState(false);
  return (
    <div>
      <Header openNav={openNav} setOpenNav={setOpenNav} />
      <CampaignSuccess />
      <FooterMenu />
    </div>
  )
}

export default page