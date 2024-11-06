import CampaignSuccess from '@/components/Campaign page/Campaign Success/CampaignSuccess'
import Footer from '@/components/Footer/Footer'
import { FooterMenu } from '@/components/FooterMenu/FooterMenu'
import { Header } from '@/components/Header/Header'
import React from 'react'

const page = () => {
  return (
    <div>
        <Header/>
        <CampaignSuccess/>
        <FooterMenu/>
    </div>
  )
}

export default page