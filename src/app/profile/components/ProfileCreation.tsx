import React, { useState } from 'react';

const Profile: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [image, setImage] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const sendVerificationCode = () => {
    // Simulate sending a 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(code);
    setIsCodeSent(true);
    setIsCodeValid(false);
    alert('Verification code sent to email'); // Replace with actual email sending logic
  };

  const validateCode = () => {
    if (enteredCode === verificationCode) {
      setIsCodeValid(true);
      alert('Email verified successfully');
    } else {
      alert('Invalid code');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCodeValid) {
      alert('Please verify your email before submitting');
      return;
    }
    // Add your form submission logic here
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-gray-100 bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative max-w-md mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 rounded-lg shadow dark:bg-gray-700"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking inside the modal
      >
        <h1 className='text-gray-100 text-lg font-bold text-center mb-2'>Edit profile</h1>
        <div
          className="border-2 border-dashed border-gray-300 p-4 mb-6 rounded-lg flex flex-col items-center justify-center text-gray-100 dark:text-gray-400"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="file-input"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer flex flex-col items-center"
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <svg
                className="w-16 h-16 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            <span>Drag and drop an image here, or click to select one</span>
          </label>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="first_name"
              id="first_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="first_name"
              className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              First Name
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="last_name"
              id="last_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="last_name"
              className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Last Name
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="email"
              className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email Address
            </label>
            {!isCodeSent && (
              <button
                type="button"
                onClick={sendVerificationCode}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-4"
              >
                Send Code
              </button>
            )}
            {isCodeSent && (
              <div className="relative mt-4">
                <input
                  type="text"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="code"
                  className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Verification Code
                </label>
                <button
                  type="button"
                  onClick={validateCode}
                  className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-4"
                >
                  Validate
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled={!isCodeValid}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
