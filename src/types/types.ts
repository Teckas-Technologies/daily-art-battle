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