// "use client";
// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { useMbWallet } from '@mintbase-js/react';
// import { execute, burn, BurnArgs } from '@mintbase-js/sdk';

// export const BurnComponent = ({ tokenIds, contractAddress }: BurnArgs): JSX.Element => {
//   const [transactionHash, setTransactionHash] = useState<string | null>(null);
//   const searchParams = useSearchParams();
//   const {selector} = useMbWallet();

//   // Get the transactionHashes from the URL (if needed)
//   const transactionHashesFromUrl = searchParams.get('transactionHashes');

//   const handleBurn = async (): Promise<void> => {
//     try {
//       alert("called");

//       // Assuming you have your wallet connected
//       const wallet = await selector.wallet();

//       console.log(wallet.id);

//       // Execute the burn function and wait for the transaction result
//       const res = await execute(
//         { wallet },
//         burn({ contractAddress: contractAddress, tokenIds: tokenIds })
//       );

//       // Get the transaction hash from the result and set it to the state
//       if (res && res.transactionHash) {
//         setTransactionHash(res.transactionHash);
//         console.log("Transaction Hash:", res.transactionHash);
//       } else {
//         console.error("No transaction hash returned");
//       }
//     } catch (error) {
//       console.error("Error executing burn:", error);
//     }
//   };

//   // Display the transaction hash
//   return (
//     <div>
//       <button
//         className="bg-gray-100 text-black w-full hover:cursor-pointer h-10"
//         onClick={handleBurn}
//       >
//         Burn {contractAddress}
//       </button>

//       {transactionHash && (
//         <p className="mt-4 text-green-500">
//           Burn Successful! Transaction Hash: {transactionHash}
//         </p>
//       )}

//       {/* Optionally, show transactionHashes from URL if needed */}
//       {transactionHashesFromUrl && (
//         <p className="mt-4 text-blue-500">
//           Transaction Hash from URL: {transactionHashesFromUrl}
//         </p>
//       )}
//     </div>
//   );
// };
// 