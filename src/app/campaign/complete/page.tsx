import CampaignDetails from '@/components/Campaign page/Campaign Details/CampaignDetails'
import { Header } from '@/components/Header/Header'
import React from 'react'

const page = () => {
  return (
    <div style={{width:"100%",minHeight:"100vh",background:"#000000"}}>
        <Header/>
        <CampaignDetails/>
    </div>
  )
}

export default page