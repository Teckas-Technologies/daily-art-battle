"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import "@near-wallet-selector/modal-ui/styles.css";
import "../styles.css";


import { MintbaseWalletContextProvider } from "@mintbase-js/react";

const inter = Inter({ subsets: ["latin"] });
export const getCallbackUrl = () => {
  let callbackUrl = ''

  if (typeof window !== 'undefined') {
    callbackUrl =
        window?.location?.host.includes('localhost')
        ? `http://${window?.location.host}`
        : `}`
  }

  return callbackUrl
}

const MintbaseWalletSetup = {
  contractAddress: process.env.ART_BATTLE_CONTRACT,
  network: process.env.NEXT_PUBLIC_NETWORK as any,
  callbackUrl: getCallbackUrl(),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MintbaseWalletContextProvider {...MintbaseWalletSetup}>
      <html lang="en">
        <body className={inter.className}>
        <video autoPlay muted loop id="background-video" style={{ 
    position: 'fixed', 
    right: 0, 
    bottom: 0, 
    objectFit: 'cover', 
    minWidth: '100%', 
    minHeight: '100%', 
    zIndex: -1,
    filter: 'blur(5px) brightness(50%)'
}}>
    <source src="images/back.mp4" type="video/mp4" />
    Your browser does not support the video tag.
</video>
          <div className="flex flex-1 flex-col min-h-screen text-gray-500 gradient w-full  h-full flex justify-center items-center bold text-white">
          {children}
          </div>
        </body>
      </html>
    </MintbaseWalletContextProvider>
  );
}