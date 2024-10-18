import CreateCampaign from '@/components/Campaign page/Create Campaign/Createcampaign'
import Footer from '@/components/Footer/Footer'
import { Header } from '@/components/Header/Header'
import React from 'react'

const page = () => {
  return (
    <div>
      <Header/>
      <CreateCampaign/>
      <Footer/>
    </div>
  )
}

export default page