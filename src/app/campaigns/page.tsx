"use client"
import React, { useState,useEffect } from "react";
import { CampaignData,useFetchCampaignByTitle } from "@/hooks/campaignHooks";
import { NearWalletConnector } from "@/components/NearWalletConnector";
import Image from "next/image";
const CampaignTable: React.FC = () => {
 const[campaigns,setCampaign] = useState<CampaignData[]>([]);
 const {fetchAllCampaign} = useFetchCampaignByTitle();
 const [hasnext, setHasNext] = useState(false);
 const [page, setPage] = useState(1);

 const fetchCampaign=async(val:any)=>{
 const res =  await fetchAllCampaign(val);
 console.log(res);
 if (page > res.totalPages - 1) {
  setHasNext(true);
} else {
  setHasNext(false);
}
  setCampaign(res.campaigns);
 }

 useEffect(() => {
  fetchCampaign(page);
 }, [page])

 const handleNext = () => {
  setPage((prevPage) => prevPage + 1);
};

const handlePrevious = () => {
  if (page > 1) {
    setPage((prevPage) => prevPage - 1);
  }
};
 

  return (
    <div>
       <NearWalletConnector />
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
<section id="campaigns">
    <div className="battle-table mt-8  md:ml-8 md:mr-8 lg:ml-20 lg:mr-20 my-12 flex flex-col items-center">
      <h2 className="mt-10 text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center">
       Campaigns
      </h2>
      <p className="battle-table1 w-full overflow-x-auto text-center text-white font-mono mt-5 sm:font-thin md:text-lg">
       
      Explore the list of active campaigns below. By clicking on the provided URLs, you can join and contribute to these exciting initiatives. Don't miss your chance to participate and make a difference!
      </p>
      <div className=" pb-10 w-full overflow-x-auto">
        <div className="flex items-center justify-between">
          <div className="px-5 w-full">
            <table className="min-w-full mt-4 overflow-hidden ">
              <thead>
                <tr className="text-xs md:text-2xl sm:text-xl">
                  <th
                    className="text-center  font-normal text-white"
                    style={{
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                  >
                    Logo
                  </th>
                  <th className="text-center  font-normal text-white">
                Url
                  </th>
                  <th
                  
                    className="text-white text-center cursor-pointer font-normal"
                  >
                    <span className="flex items-center justify-center ">
                          End Date
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto max-h-96">
                {campaigns.map((campaign, index) => (
                  <>
                    <br />
                    <tr
                      key={index}
                      className="bg-white overflow-y-auto max-h-96"
                      style={{
                        borderTopLeftRadius: 40,
                        borderBottomLeftRadius: 40,
                      }}
                    >
                      <td
                        className="p-0 w-24 h-24 sm:w-36 sm:h-36 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96"
                        style={{
                          borderTopLeftRadius: 40,
                          borderBottomLeftRadius: 40,
                        }}
                      >
                        <div
                          className="bg-white h-full w-full"
                          style={{ borderRadius: 40 }}
                        >
                            <div
                              className="relative w-full h-full"
                              style={{
                                borderTopLeftRadius: 40,
                                borderBottomLeftRadius: 40,
                              }}
                            >
                              <Image
                                src={campaign.logo?(
                                  campaign.logo
                                ):(
                                 "/images/logo.png"
                                )}
                                alt={"Art"}
                                width={400} // Arbitrary value; the actual size will be controlled by CSS
                                height={400} // Arbitrary value; the actual size will be controlled by CSS
                                className="w-full h-full border object-cover rounded-l-3xl "
                                unoptimized
                                style={{
                                  height: "100%", // Ensuring the image takes the full height of its container
                                  aspectRatio: "1/1",
                                  boxShadow:
                                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                                  backgroundPosition: "center",
                                  backgroundSize: "cover",
                                }}
                              />
                            </div>
                        </div>
                      </td>

                      <td className="px-4 py-2 text-xs sm:text-2xl font-medium break-words break-all text-black text-center special-winner">
                      <a href={`http://${window.location.host}/${campaign.campaignTitle}`} target="_blank" className="text-blue-500 hover:underline">
                  {campaign.campaignTitle}
                </a>
                        <br />
                      </td>
                      <td
                        className="px-4 py-2 text-xs  sm:text-2xl font-medium break-words  break-all text-black text-center special-winner"
                        style={{
                          borderTopRightRadius: 20,
                          borderBottomRightRadius: 20,
                        }}
                      >
                        {campaign.endDate}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <nav className="flex justify-center flex-wrap gap-5 mt-6 mb-10 pb-3">
          <a
            href={page > 1 ? "#campaigns" : undefined}
            className={`shadow-md flex items-center justify-center py-2 px-3 rounded font-medium select-none border text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors ${
              page <= 1
                ? "cursor-not-allowed"
                : "hover:border-gray-600 hover:bg-gray-400 hover:text-white dark:hover:text-white"
            }`}
            onClick={page > 1 ? handlePrevious : undefined}
          >
            Previous
          </a>
          <a
          href={hasnext ? undefined : "#campaigns"}
            className={` shadow-md flex items-center justify-center py-2 px-3 rounded font-medium select-none border text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors ${
              hasnext
                ? "cursor-not-allowed"
                : "hover:border-gray-600 hover:bg-gray-400 hover:text-white dark:hover:text-white"
            }`}
            onClick={hasnext ? undefined : handleNext}
          >
            Next
          </a>
        </nav>
      </div>
    </div>
    </section>
    </div>
  );
};

export default CampaignTable;
