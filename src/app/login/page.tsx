"use client"
// import { useState, useEffect } from 'react';

// export default function Home() {
//   const [profile, setProfile] = useState(null);

//   const checkFollowStatus = async (userId: string, accessToken: string) => {
//     const res = await fetch(`/api/auth/x/check-follow?userId=${userId}&accessToken=${accessToken}`);
//     const data = await res.json();
//     alert(data.message);
//   };

//   // Check if the user is logged in and retrieve profile data
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const profile = urlParams.get('userProfile');
//     if (profile) {
//       setProfile(JSON.parse(decodeURIComponent(profile)));
//       const { id, access_token } = JSON.parse(decodeURIComponent(profile));
//       checkFollowStatus("1833828927992918016", access_token);
//     }
//   }, []);

//   return (
//     <div>
//       <h1>Login with X</h1>

//       {!profile ? (
//         <a href="/api/login">
//           <button>Login with X</button>
//         </a>
//       ) : (
//         <div>
//           <p>Welcome, {profile.username}</p>
//           <p>ID: {profile.id}</p>
//         </div>
//       )}
//     </div>
//   );
// }
// import React, { useEffect } from 'react';
// import { initMainButton } from '@tma.js/sdk-react';
// //import { WebApp } from '@tma.js/sdk';

// const App: React.FC = () => {
//   useEffect(() => {
//     const initializeMainButton = async () => {
//       try {
//         // Ensure the WebApp is initialized
//         // WebApp.ready();

//         const [mainButton] = await initMainButton();
        
//         mainButton.show();
//         console.log(mainButton.isVisible); // true  
        
//         mainButton.hide();
//         console.log(mainButton.isVisible); // false
        
//         mainButton.showLoader();
//         console.log(mainButton.isLoaderVisible); // true  
    
//         mainButton.hideLoader();
//         console.log(mainButton.isLoaderVisible); // false
        
//         mainButton.enable();
//         console.log(mainButton.isEnabled); // true  
    
//         mainButton.disable();
//         console.log(mainButton.isEnabled); // false
        
//         mainButton.setText('Submit');
//         console.log(mainButton.text); // 'Submit'
//       } catch (error) {
//         console.error('Error initializing main button:', error);
//       }
//     };

//     initializeMainButton();
//   }, []);

//   return (
//     <div>
//       <h1>Telegram Mini App is Ready!</h1>
//     </div>
//   );
// };

// export default App;
