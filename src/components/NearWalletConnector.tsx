"use client";
import { useMbWallet } from "@mintbase-js/react";
import { useRouter } from 'next/navigation';
export const NearWalletConnector = () => {
  const { isConnected, selector, connect, activeAccountId } = useMbWallet();
  const router = useRouter();
  const handleSignout = async () => {
    const wallet = await selector.wallet();
    return wallet.signOut();
  };

  const handleSignIn = async () => {
    return connect();
  };

  const handleRoute = ()=>{
    router.push(`/theme`);
  }


  return (
    <nav
      className="navbar bg-gray-950"
      style={{
        width: "100vw",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        padding: "10px 5vw",
      }}
    >
      <div className="flex items-center flex-col md:flex-col">
        <img
          src="/images/logo.png"
          alt="GFXvs"
          width={50}
          height={50}
          className=" md:mb-0" // Add margin bottom for smaller screens
        />
        {/* <h1 className="font-extrabold text-2xl md:text-md ml-2" style={{color:"#33cd2b"}}>
    GFXvs
  </h1> */}
      </div>
      {isConnected ? (
        <div className="flex flex-row justify-center items-center  hover-trigger">
          <p className="px-2 items-center text-xs sm:text-sm md:text-base">
            {activeAccountId}
          </p>
          {/* <button className="mt-2 sm:mt-0 sm:ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleSignout}>
         Disconnect
       </button>      */}
          <img
            onClick={handleSignout}
            src="/wallet lock.png"
            title="Disconnect"
            alt="Disconnect"
            className="w-10 h-10 cursor-pointer"
          ></img>
          {activeAccountId=="scalability-vega.testnet"&&(
        <label onClick ={handleRoute} className="ml-2 px-2 bg-green-600 border hover:bg-green-500 rounded-lg cursor-pointer">  admin</label>
          )}
        </div>
      ) : (
        // <button className="px-4 py-2 flex connect-btn rounded" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 'clamp(0.75rem, 2vw, 1rem)' }} onClick={handleSignIn}>
        <img
          onClick={handleSignIn}
          src="/wallet open.png"
          className="w-10 h-10 cursor-pointer"
        ></img>
        // </button>
      )}
      
    </nav>
  );
};
