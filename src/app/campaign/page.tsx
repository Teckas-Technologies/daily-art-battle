import CampaignDetails from '@/components/Campaign page/Campaign Details/CampaignDetails'
import CampaignBanner from '@/components/Campaign page/Campaigns/Campaign'
import { Header } from '@/components/Header/Header'
import React from 'react'

const page = () => {
  return (
    <div style={{width:"100%",minHeight:"100vh",background:"#000000"}}>
      <Header/>
        <CampaignBanner/>
   
    </div>
  )
}

export default page