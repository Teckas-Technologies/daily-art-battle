"use client";

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const handleLogin = () => {
    // Trigger login with Azure B2C provider
    signIn('azure-ad-b2c',{ callbackUrl: '/' });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="mb-6">Please log in using your Azure B2C account.</p>
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login with Azure B2C
        </button>
      </div>
    </div>
  );
}
