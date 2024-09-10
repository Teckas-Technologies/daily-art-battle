import React, { useState } from 'react';

const Coin: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [showQuantityModal, setShowQuantityModal] = useState<boolean>(false);

  const handleBuyClick = () => {
    setShowQuantityModal(true);
  };

  const handleConfirmPurchase = () => {
    console.log(`Purchasing ${quantity} coins`);
    setShowQuantityModal(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-100 bg-opacity-50" onClick={onClose}>
      <div
        className="relative max-w-md mx-auto p-6 bg-gradient-to-r from-[#0f172a] via-[#6b7280] to-[#374151] rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-sm border  border-gray-200 rounded-lg shadow-lg">
          <div className="p-8 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-24 h-24 text-white">
              <path d="M12 1L21 6V18L12 23L3 18V6L12 1Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 9V15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 18H12.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-center mt-4">
              <h5 className="text-2xl font-semibold text-white mb-2">Boost Your Gfxvs coin</h5>
              <p className="text-lg text-white mb-4">Unlock exclusive coins with just a few clicks!</p>
            </div>
            <div className="flex items-center justify-between mt-2.5 mb-5">
              <span className="text-4xl font-bold text-white">$599</span>
              <button
                onClick={handleBuyClick}
                className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Quantity Modal */}
        {showQuantityModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="relative max-w-sm mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold text-gray-100 mb-4">Enter Quantity</h2>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full p-2 mb-4 border border-gray-300 text-black rounded"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleConfirmPurchase}
                  className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowQuantityModal(false)}
                  className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coin;
