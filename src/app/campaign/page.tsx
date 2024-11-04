"use client";
import CampaignDetails from "@/components/Campaign page/Campaign Details/CampaignDetails";
import CampaignBanner from "@/components/Campaign page/Campaigns/Campaign";
import Footer from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

const page = () => {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("azure-ad-b2c", { callbackUrl: "/" });
    }
   
    
    console.log("status", status);
    console.log("session", session);
  }, [status, session]);
  const idToken = session?.idToken || "";
  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#000000" }}>
      <Header />
      <CampaignBanner idToken={idToken}/>
      <Footer />
    </div>
  );
};

export default page;
