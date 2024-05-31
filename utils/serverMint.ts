'use server'

import { Account, KeyPair, InMemorySigner } from "near-api-js";
import { InMemoryKeyStore } from "near-api-js/lib/key_stores";
import { JsonRpcProvider, FinalExecutionOutcome } from "near-api-js/lib/providers";
import { MintArgsResponse, NearContractCall, execute, mint } from "@mintbase-js/sdk"
import { NEXT_PUBLIC_NETWORK, SERVER_WALLET_ID, SERVER_WALLET_PK , ART_BATTLE_CONTRACT, SPECIAL_WINNER_CONTRACT} from "../src/config/constants";


export const serverMint = async (accountId: string,  mediaUrl: string, referenceUrl: string, isSpecialNft: boolean): Promise<void> => {
    
    const mintArgs = await serverMintArgs(accountId, mediaUrl, referenceUrl, isSpecialNft?SPECIAL_WINNER_CONTRACT:ART_BATTLE_CONTRACT)
    //Execute mint with server wallet
    const account = await connectAccount();
    await execute({ account: account }, mintArgs) as FinalExecutionOutcome

}
export const connectAccount = async (
): Promise<Account> => {
    if (!SERVER_WALLET_ID || !SERVER_WALLET_PK) {
        throw ("SERVER_WALLET_ID or SERVER_WALLET_PK not defined in envs")

    }
    const keyStore = new InMemoryKeyStore();
    await keyStore.setKey(NEXT_PUBLIC_NETWORK, SERVER_WALLET_ID, KeyPair.fromString(SERVER_WALLET_PK));

    const provider = new JsonRpcProvider({
        url: `https://rpc.${NEXT_PUBLIC_NETWORK}.near.org`,
    });

    const signer = new InMemorySigner(keyStore);

    const account = new Account(
        {
            networkId: NEXT_PUBLIC_NETWORK,
            provider,
            signer,
            jsvmAccountId: "",
        },
        SERVER_WALLET_ID
    );

    return account;
};

export const serverMintArgs = (accountId: string, mediaUrl: string, referenceUrl: string, contract: string): NearContractCall<MintArgsResponse> => {
    return mint({
        contractAddress: contract,
        ownerId: accountId,
        metadata: {
            media: mediaUrl,
            reference: referenceUrl
        }
    })
}