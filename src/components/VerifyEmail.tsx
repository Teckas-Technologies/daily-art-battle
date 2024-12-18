import { Dialog } from '@headlessui/react';

const VerifyEmailModal = ({ show, onClose }: { show: boolean; onClose: () => void }) => {
  return (
    <Dialog open={show} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-75" />

      {/* Modal Panel */}
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-black rounded-lg p-6 max-w-sm mx-auto border border-[#00ff00] shadow-lg">
          <Dialog.Title className="text-xl font-bold text-[#00ff00]">
            Verify Your Email
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-white text-sm">
            A verification email has been sent to your email address. Please check your inbox
            and verify your email to continue.
          </Dialog.Description>
          <div className="mt-4">
            <button
              onClick={onClose}
              className="bg-[#00ff00] text-black font-semibold px-4 py-2 rounded hover:bg-white hover:text-black transition duration-300"
            >
              Close
            </button>   
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default VerifyEmailModal;
