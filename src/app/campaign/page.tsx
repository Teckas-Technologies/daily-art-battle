import CampaignDetails from '@/components/Campaign page/Campaign Details/CampaignDetails'
import CampaignBanner from '@/components/Campaign page/Campaigns/Campaign'
import Footer from '@/components/Footer/Footer'
import { Header } from '@/components/Header/Header'
import React from 'react'

const page = () => {
  return (
    <div style={{width:"100%",minHeight:"100vh",background:"#000000"}}>
      <Header/>
        <CampaignBanner/>
   <Footer/>
    </div>
  )
}

export default page