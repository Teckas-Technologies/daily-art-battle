import type { FinalExecutionOutcome, WalletSelector, WalletSelectorState } from '@near-wallet-selector/core';
import '@near-wallet-selector/modal-ui/styles.css';
import { setupWalletSelector } from '@near-wallet-selector/core';
// import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
// import { setupMintbaseWallet } from '@near-wallet-selector/mintbase-wallet';
import { setupModal } from '@near-wallet-selector/modal-ui';
// import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupBitteWallet } from '@near-wallet-selector/bitte-wallet';
import { providers, utils } from 'near-api-js';
import type { Context } from 'react';
import { createContext } from 'react';
import { distinctUntilChanged, map } from 'rxjs';
import { NetworkId } from '@/types/types';
import { ART_BATTLE_CONTRACT } from '@/config/constants';

const THIRTY_TGAS = '30000000000000';
const NO_DEPOSIT = '0';

export class Wallet {
    private createAccessKeyFor: string;
    private networkId: NetworkId;
    selector!: Promise<WalletSelector>;

    constructor({
        networkId = "testnet",
        createAccessKeyFor = ART_BATTLE_CONTRACT,
    }: {
        networkId: NetworkId;
        createAccessKeyFor: string;
    }) {
        this.createAccessKeyFor = createAccessKeyFor;
        this.networkId = networkId;
    }

    startUp = async (accountChangeHook: (account: string) => void) => {
        this.selector = setupWalletSelector({
            network: this.networkId,
            modules: [
                setupBitteWallet() as any,
                // setupMeteorWallet(),
                // setupMyNearWallet(),
                // setupHereWallet(),
                // setupMintbaseWallet(),
            ],
        });

        const walletSelector = await this.selector as WalletSelector;
        const isSignedIn = walletSelector.isSignedIn();
        const accountId = isSignedIn ? walletSelector.store.getState().accounts[0].accountId : '';

        walletSelector.store.observable
            .pipe(
                map((state: WalletSelectorState) => state.accounts),
                distinctUntilChanged(),
            )
            .subscribe((accounts: any) => {
                const signedAccount = accounts.find((account: { active: boolean }) => account.active)?.accountId;
                accountChangeHook(signedAccount);
            });

        return accountId;
    };

    signIn = async () => {
        const modal = setupModal(await this.selector, { contractId: this.createAccessKeyFor });
        modal.show();
    };

    signOut = async () => {
        const selectedWallet = await (await this.selector).wallet();
        selectedWallet.signOut();
    };

    viewMethod = async ({ contractId, method, args = {} }: { contractId: string; method: string; args?: object }) => {
        const url = `https://rpc.${this.networkId}.near.org`;
        const provider = new providers.JsonRpcProvider({ url });

        const res: any = await provider.query({
            request_type: 'call_function',
            account_id: contractId,
            method_name: method,
            args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
            finality: 'optimistic',
        });
        return JSON.parse(Buffer.from(res.result).toString());
    };

    callMethod = async ({
        contractId,
        method,
        args = {},
        gas = THIRTY_TGAS,
        deposit = NO_DEPOSIT,
    }: {
        contractId: string;
        method: string;
        args?: object;
        gas?: string;
        deposit?: string;
    }) => {
        // Sign a transaction with the "FunctionCall" action
        const selectedWallet = await (await this.selector).wallet();
        const outcome = await selectedWallet.signAndSendTransaction({
            receiverId: contractId,
            callbackUrl: window.location.origin,
            actions: [
                {
                    type: 'FunctionCall',
                    params: {
                        methodName: method,
                        args,
                        gas,
                        deposit,
                    },
                },
            ],
        });

        return providers.getTransactionLastResult(outcome as FinalExecutionOutcome);
    };

    isFinalExecutionStatusWithSuccessValue(status: any): status is { SuccessValue: string } {
        return status && typeof status.SuccessValue === 'string';
    }

    getTransactionResult = async (txhash: string) => {
        const walletSelector = await this.selector;
        const { network } = walletSelector.options;
        const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

        try {
            // Retrieve transaction result from the network
            const transaction = await provider.txStatus(txhash, 'unused') as providers.FinalExecutionOutcome;
            console.log("Res 1  >>", transaction);

            if (this.isFinalExecutionStatusWithSuccessValue(transaction.status)) {
                const signerId = transaction.transaction.signer_id;
                const amount = transaction.transaction.actions[0].Transfer.deposit;

                return {
                    success: true,
                    signerId,
                    amount,
                };
            } else {
                // Transaction failed
                return { success: false };
            }
        } catch (error) {
            console.error("Transaction Error >>", error);
            return { success: false };
        }

        // Retrieve transaction result from the network
        // const transaction = await provider.txStatus(txhash, 'unnused');
        // console.log("Res 1  >>", transaction)
        // const res = await providers.getTransactionLastResult(transaction);
        // console.log("Res 2  >>", res)
        // return res;
    };

    getBalance = async (accountId: string) => {
        const walletSelector = await this.selector;
        const { network } = walletSelector.options;
        const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

        // Retrieve account state from the network
        const account: any = await provider.query({
            request_type: 'view_account',
            account_id: accountId,
            finality: 'final',
        });
        // return amount on NEAR
        return account.amount ? Number(utils.format.formatNearAmount(account.amount)) : 0;
    };

    signAndSendTransactions = async ({ transactions }: { transactions: any[] }) => {
        const selectedWallet = await (await this.selector).wallet();
        return selectedWallet.signAndSendTransactions({ transactions });
    };
}

export const NearContext: Context<{ wallet: Wallet | undefined; signedAccountId: string }> = createContext({
    wallet: undefined as Wallet | undefined,
    signedAccountId: '',
});