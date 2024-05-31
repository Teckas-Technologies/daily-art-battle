// components/NearWalletConnector.tsx
"use client"
import { useMbWallet } from "@mintbase-js/react";

export const NearWalletConnector = () => {
  const { isConnected, selector, connect, activeAccountId } = useMbWallet();

  const handleSignout = async () => {
    const wallet = await selector.wallet();
    return wallet.signOut();
  };

  const handleSignIn = async () => {
    return connect();
  };

  return(
    
      <nav className="navbar bg-gray-950" style={{ width: "100vw", display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', top: 0, padding: '20px 5vw'}}>
      <h1 className="text-purple-600 font-extrabold text-2xl">
    Daily Art Battle
  </h1>
        {isConnected ? (
          <div className="flex justify-center items-center mt-4">
            <p className="px-2 text-xs sm:text-sm md:text-base">{activeAccountId}</p>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleSignout}>
              Disconnect
            </button>
          </div>  
        ) : (
          <button className="px-4 py-2 flex connect-btn rounded" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 'clamp(0.75rem, 2vw, 1rem)' }} onClick={handleSignIn}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg>
            Connect To NEAR
          </button>
        )}
      </nav>
      
    );
  

};
