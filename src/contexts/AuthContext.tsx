"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useSendWalletData } from "@/hooks/saveUserHook";
import { useMbWallet } from "@mintbase-js/react";
import { UserDetails } from '@/types/types';
import { setAuthToken } from '../../utils/authToken';

interface AuthContextType {
    user: UserDetails | null;
    idToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserDetails | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);
    const { data: session, status } = useSession();
    const { sendWalletData } = useSendWalletData();
    const { activeAccountId } = useMbWallet();

    useEffect(() => {
        if (status === 'unauthenticated') {
            signIn('azure-ad-b2c', { callbackUrl: '/' });
        } else if (status === 'authenticated' && session) {
            setIdToken(session?.idToken || "");
            setAuthToken(session?.idToken || "");
            console.log(idToken)
        }
    }, [status, session]);

    useEffect(() => {
        const handleWalletData = async () => {
            if (session && session.user) {
                const walletAddress = activeAccountId;
                if (!walletAddress) return;

                try {
                    const fetchedUser = await sendWalletData(walletAddress);
                    if (fetchedUser) {
                        setUser(fetchedUser);
                    }
                } catch (err) {
                    console.error("Failed to send wallet data:", err);
                }
            }
        };

        handleWalletData();
    }, [session, activeAccountId]);

    return (
        <AuthContext.Provider value={{ user, idToken }}>
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
