"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import "@near-wallet-selector/modal-ui/styles.css";
import "../styles.css";

import { MintbaseWalletContextProvider } from "@mintbase-js/react";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const getCallbackUrl = () => {
  let callbackUrl = "";

  if (typeof window !== "undefined") {
    callbackUrl =
      window?.location?.host.includes("localhost")
        ? `http://${window?.location.host}`
        : `https://${window?.location.host}`;
  }

  return callbackUrl;
};

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
    <SessionProvider>
      <MintbaseWalletContextProvider {...MintbaseWalletSetup}>
        <AuthProvider>
          <html lang="en">
            <body className={inter.className}>
              <div className="flex flex-1 flex-col min-h-screen text-gray-500 gradient w-full h-full flex justify-center items-center bold text-white">
                {children}
              </div>
            </body>
          </html>
        </AuthProvider>
      </MintbaseWalletContextProvider>
    </SessionProvider>
  );
}
