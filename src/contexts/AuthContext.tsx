"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useSendWalletData } from "@/hooks/saveUserHook";
import { UserDetails } from '@/types/types';
import { setAuthToken } from '../../utils/authToken';
import { NearContext } from '@/wallet/WalletSelector';
import useUpdateUserWalletAddress from '@/hooks/updateUserWalletAddress';
import { usePathname } from 'next/navigation';

interface AuthContextType {
    user: UserDetails | null;
    idToken: string | null;
    signInUser: () => void;
    signOutUser: () => void;
    connected: boolean;
    setUserTrigger: (e: boolean) => void;
    userTrigger: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserDetails | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);
    const { data: session, status } = useSession();
    const { sendWalletData } = useSendWalletData();
    const { wallet, signedAccountId } = useContext(NearContext);
    const { updateUserWalletAddress } = useUpdateUserWalletAddress();
    const [userTrigger, setUserTrigger] = useState(false);
    const pathName = usePathname();

    useEffect(() => {
        // if (status === 'unauthenticated') {
        //     signIn('azure-ad-b2c', { callbackUrl: '/' });
        // } else 
        if (status === 'authenticated' && session) {
            setIdToken(session?.idToken || "");
            setAuthToken(session?.idToken || "");
            console.log(idToken)
        }
    }, [status, session]);

    useEffect(() => {
        const updateWalletAddress = async () => {
            await updateUserWalletAddress({ nearAddress: signedAccountId })
        }
        if (signedAccountId && user && !user?.user?.nearAddress) {
            updateWalletAddress();
        }
    }, [signedAccountId, user])

    useEffect(() => {
        const handleWalletData = async () => {
            if (session && session.user) {
                try {
                    const fetchedUser = await sendWalletData();
                    if (fetchedUser) {
                        setUser(fetchedUser);
                        setConnected(true);
                    }
                } catch (err) {
                    console.error("Failed to send wallet data:", err);
                }
            }
        };

        handleWalletData();
    }, [session, status, signedAccountId, userTrigger, pathName]);

    const signInUser = () => {
        signIn('azure-ad-b2c', { callbackUrl: '/' });
    };

    const signOutUser = () => {
        signOut();
    };

    return (
        <AuthContext.Provider value={{ user, idToken, signInUser, signOutUser, connected, setUserTrigger, userTrigger }}>
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
