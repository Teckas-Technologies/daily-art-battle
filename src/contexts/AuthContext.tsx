"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSession, signIn, signOut } from "next-auth/react";
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
  setNearDrop: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const { data: session, status } = useSession();
  const {
    isLoading,
    error,
    userDetails,
    getUserDetails,
    createUser,
    sufficientBalance,
  } = useSendWalletData();
  const { wallet, signedAccountId } = useContext(NearContext);
  const { updateUserWalletAddress } = useUpdateUserWalletAddress();
  const [userTrigger, setUserTrigger] = useState(false);
  const pathName = usePathname();
  const [newUser, setNewUser] = useState(false);
  const [signToast, setSignToast] = useState(false);
  const [nearDrop, setNearDrop] = useState(false);
  const { sendNearDrop, response } = useSendNearDrop();
  useEffect(() => {
    // if (status === 'unauthenticated') {
    //     signIn('azure-ad-b2c', { callbackUrl: '/' });
    // } else
    if (status === "authenticated" && session) {
      setIdToken(session?.idToken || "");
      setAuthToken(session?.idToken || "");
      console.log(idToken);
    }
  }, [status, session]);

  useEffect(() => {
    const updateWalletAddress = async () => {
      await updateUserWalletAddress({ nearAddress: signedAccountId });
    };
    if (signedAccountId && user && !user?.user?.nearAddress) {
      updateWalletAddress();
    }
    // const updateWalletAddress = async () => {
    //   try {
    //     await updateUserWalletAddress({ nearAddress: signedAccountId });
    //     console.log("User wallet address updated successfully.");
    //     const wallet = { nearAddress: signedAccountId };
    //     await postNearDrop(wallet);
    //     setNearDrop(true);
    //     console.log("Near drop triggered successfully.");
    //   } catch (err) {
    //     console.error("Error in updating wallet or posting near drop:", err);
    //   }
    // };

    // if (signedAccountId && user && !user?.user?.nearAddress) {
    //   updateWalletAddress();
    // }
  }, [signedAccountId, user]);
  useEffect(() => {
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

    triggerNearDrop();
  }, [signedAccountId, userDetails]);

  useEffect(() => {
    const handleWalletData = async () => {
      if (session && session.user) {
        try {
          console.log("Session details:", session);

          const fetchedUser = await getUserDetails();
          console.log("Fetched user:", fetchedUser);

          if (fetchedUser) {
            console.log("User already exists");
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
              // setSignToast(true);
            }
          }
        } catch (err) {
          console.error("Error while handling wallet data:", err);
        }
      }
    };

    handleWalletData();
  }, [session, status, signedAccountId, userTrigger, pathName]);

  const signInUser = () => {
    signIn("azure-ad-b2c", { callbackUrl: "/" });
  };

  const signOutUser = () => {
    signOut();
  };

  return (
    <AuthContext.Provider
      value={{
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
