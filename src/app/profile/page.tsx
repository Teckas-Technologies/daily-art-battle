import { FooterMenu } from '@/components/FooterMenu/FooterMenu'
import { Header } from '@/components/Header/Header'
import ConnectWallet from '@/components/Profile Page/Connect Wallet/ConnectWallet'
import React from 'react'

const page = () => {
  return (
    <div>
      <Header/>
        <ConnectWallet/>
        <FooterMenu/>
    </div>
  )
}

export default page