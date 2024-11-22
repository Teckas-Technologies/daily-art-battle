import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    idToken?: string;
    refreshToken?: string;
    error?: string;
  }

  interface JWT {
    idToken?: string;
    refreshToken?: string;
    idTokenExpires?: number;
    error?: string;
  }
}

export enum TransactionEnum {
  MINT = 'mint',
  TRANSFER = 'transfer',
  BURN = 'burn',
  DEPLOY_STORE = 'deploy-store',
  MAKE_OFFER = 'make-offer',
  REVOKE_MINTER = 'revoke-minter',
  ADD_MINTER = 'add-minter',
  TRANSFER_STORE_OWNERSHIP = 'transfer-store-ownership',
  LIST = 'list',
  TAKE_OFFER = 'take-offer',
  WITHDRAW_OFFER = 'withdraw-offer',
}


export interface ArtBattle {
  date: Date | null;
  creatorAddress: string | null;
  artAGrayUrl?: string;
  artAColorUrl?: string;
  artBGrayUrl?: string;
  artBColorUrl?: string;
  isCompleted?: boolean;
  totalVote: Number;
  winningArt: String;
  raffleWinnerAddr: String;
}

export interface Vote {
  battleId: String;
  voterAddress: String;
  date: Date;
}

export interface Rewards {
  data: {
    mb_views_nft_tokens_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}

export interface User {
  _id: string;
  createdAt: string;
  email: string;
  firstName: string;
  lastName: string;
  gfxCoin: number;
  isEmailConnected: boolean;
  isEmailVerified: boolean;
  isInstagramConnected: boolean;
  isNearDropClaimed: boolean;
  isRegistered: boolean;
  isTelegramDropClaimed: boolean;
  isXConnected: boolean;
  nearAddress?: string;
  profileImg: string;
  referralCode: string;
  referredBy: string | null;
  referredUsers: string[];
  __v: number;
}

export interface UserDetails {
  user: User;
  voting: number;
  rewards: Rewards;
}

export type NetworkId = "testnet" | "mainnet";

export interface NftToken {
  base_uri: string;
  burned_receipt_id: string | null;
  burned_timestamp: string | null;
  copies: number;
  description: string | null;
  id: string;
  metadata_id: string;
  minter: string;
  minted_timestamp: string;
  owner: string;
  title: string | null;
  media: string | null;
  media_hash: string | null;
  extra: string | null;
  reference: string | null;
  reference_hash: string | null;
}

export interface MbViewsNftTokensAggregate {
  aggregate: {
    count: number;
  };
}

export interface RareNfts {
  data: {
    mb_views_nft_tokens: NftToken[];
    mb_views_nft_tokens_aggregate: MbViewsNftTokensAggregate;
  };
}

export interface ConfirmPopupInfo {
  info: string;
  text: string;
  isMint: boolean;
}

export interface RaffleArt {
  _id: string;
  email: string;
  participantId: string;
  artId: string;
  campaignId: string;
  raffleCount: number;
  isMintedNft: boolean;
  createdAt: string; // Use `Date` type if you plan to parse this string into a Date object
  updatedAt: string; // Use `Date` type if you plan to parse this string into a Date object
  __v: number;
  colouredArt: string;
  colouredArtReference: string;
}

export interface SpinnerItem {
  _id: string;
  videoSpinner: string;
  videoSpinnerReference: string;
  emoji1: string;
  emoji2: string;
  artAId?: string;
  artAVotes?: number;
  artAartistEmail?: string;
  artAartistId?: string;
  artAartistName?: string;
  artAcolouredArt?: string;
  artAcolouredArtReference?: string;
  artAtitle?: string;
  artAvoters?: string[];
  artBId?: string;
  artBVotes?: number;
  artBartistEmail?: string;
  artBartistId?: string;
  artBartistName?: string;
  artBcolouredArt?: string;
  artBcolouredArtReference?: string;
  artBtitle?: string;
  artBvoters?: string[];
  grayScale?: string;
  grayScaleReference?: string;
  campaignId?: string;
  isBattleEnded?: boolean;
  isNftMinted?: boolean;
  isSpecialWinnerMinted?: boolean;
  specialWinner?: string;
  startTime?: string;
  endTime?: string;
  totalVotes?: number;
  winningArt?: string;
}

export interface PaginatedResponse {
  spinner: SpinnerItem[];
  totalDocuments: number;
  totalPages: number;
}