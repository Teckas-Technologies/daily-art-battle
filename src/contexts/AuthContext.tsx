"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useSendWalletData } from "@/hooks/saveUserHook";
import { UserDetails } from "@/types/types";
import { setAuthToken } from "../../utils/authToken";
import { NearContext } from "@/wallet/WalletSelector";
import useUpdateUserWalletAddress from "@/hooks/updateUserWalletAddress";
import { usePathname } from "next/navigation";
import { SignInPopup } from "@/components/PopUps/SignInPopup";
import usePostNearDrop from "@/hooks/NearDrop";
import useSendNearDrop from "@/hooks/NearDrop";

interface AuthContextType {
  user: UserDetails | null;
  idToken: string | null;
  signInUser: () => void;
  signOutUser: () => void;
  connected: boolean;
  setUserTrigger: (e: boolean) => void;
  userTrigger: boolean;
  setNewUser: (value: boolean) => void;
  newUser: boolean;
  nearDrop: boolean;
  walletError: boolean;
  setWalletError: (value: boolean) => void;
  setNearDrop: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [walletError, setWalletError] = useState(false);
  const { user: auth0User, isLoading: authLoading } = useUser();
  const {
    isLoading,
    error,
    userDetails,
    getUserDetails,
    createUser,
    sufficientBalance,
  } = useSendWalletData();
  const { wallet, signedAccountId } = useContext(NearContext);
  const { updateUserWalletAddress,checkWalletAddress} = useUpdateUserWalletAddress();
  const [userTrigger, setUserTrigger] = useState(false);
  const pathName = usePathname();
  const [newUser, setNewUser] = useState(false);
  const [signToast, setSignToast] = useState(false);
  const [nearDrop, setNearDrop] = useState(false);
  const { sendNearDrop, response } = useSendNearDrop();

  // Function to fetch and handle user data
  const fetchAndSetUser = async () => {
    if (!auth0User) return;

    try {
      console.log("Auth0 User details:", auth0User);
      if (!auth0User.email_verified) {
        console.warn("Email not verified. Prompt user to verify.");
        // You can trigger a modal or popup to inform the user.
        return;
      }
      const fetchedUser = await getUserDetails();
      console.log("fetched user",fetchedUser)
      if (fetchedUser) {
        console.log("User already exists:", fetchedUser);
        setUser(fetchedUser);
        setConnected(true);
        setNewUser(false);
      } else {
        console.log("No user found in DB. Creating new user...");
        const newUser = await createUser();
        if (newUser) {
          console.log("New user created:", newUser);
          setUser(newUser);
          setConnected(true);
          setNewUser(true);
        }
      }
    } catch (error) {
      console.error("Error fetching or creating user details:", error);
    }
  };

  // Effect to set Auth0 token and trigger user fetch
  useEffect(() => {
    if (auth0User) {
      const token = auth0User?.sub || "";
      setIdToken(token);
      setAuthToken(token);
      fetchAndSetUser();
    }
  }, [auth0User]);

  useEffect(() => {
    console.log(userTrigger);
      fetchAndSetUser();  
  }, [userTrigger]);

  // Effect to update wallet address if needed
  useEffect(() => {
    const updateWalletAddress = async () => {
      try {
        const existing = await checkWalletAddress(signedAccountId);
        console.log(existing);
        if(existing.isExist){
          setWalletError(true);
        }else{
          await updateUserWalletAddress({ nearAddress: signedAccountId });
          await triggerNearDrop();
        }
      } catch (error) {
        console.error("Error updating wallet address:", error);
      }
    };

    if (signedAccountId && user && !user?.user?.nearAddress) {
      updateWalletAddress();
    }
  }, [signedAccountId, user]);

  // Effect to trigger NearDrop if conditions are met
  const triggerNearDrop = async () => {
    if (
      signedAccountId &&
      userDetails?.user &&
      !userDetails.user.isNearDropClaimed
    ) {
      try {
        const payload = { nearAddress: signedAccountId };
        console.log("Payload sent:", payload);
        await sendNearDrop(payload);
        setNearDrop(true);
        console.log("Near drop triggered successfully.");
      } catch (error) {
        console.error("Error triggering near drop:", error);
      }
    }
  };

  const signInUser = () => {
    window.location.href = "/api/auth/login"; // Redirects to Auth0 login page
  };

  const signOutUser = () => {
    window.location.href = "/api/auth/logout"; // Redirects to Auth0 logout page
  };

  return (
    <AuthContext.Provider
      value={{
        setWalletError,
        user,
        idToken,
        signInUser,
        signOutUser,
        connected,
        setUserTrigger,
        userTrigger,
        setNewUser,
        newUser,
        nearDrop,
        setNearDrop,
        walletError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};