"use client";
import CampaignDetails from "@/components/Campaign page/Campaign Details/CampaignDetails";
import CampaignBanner from "@/components/Campaign page/Campaigns/Campaign";
import Footer from "@/components/Footer/Footer";
import { FooterMenu } from "@/components/FooterMenu/FooterMenu";
import { Header } from "@/components/Header/Header";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { setAuthToken } from "../../../utils/authToken";

const page = () => {
  const { data: session, status } = useSession();
  const [openNav, setOpenNav] = useState(false);
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Redirect to login if not authenticated
      signIn('azure-ad-b2c', { callbackUrl: '/' });
    } else if (status === 'authenticated' && session) {
      // Set the idToken for all API requests
      setAuthToken(session?.idToken || "");
      console.log('Token set for API requests', session);
    }
  }, [status, session]);
  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#000000" }}>
      <Header openNav={openNav} setOpenNav={setOpenNav}  />
      <CampaignBanner />
      <FooterMenu />
    </div>
  );
};

export default page;
