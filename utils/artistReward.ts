import { AdminTransactionType } from '../model/enum/AdminTransactionType';
import AdminBalance from '../model/AdminBalance';
import { ADMIN_GMAIL } from '@/config/constants';
import User from '../model/User';
import Transactions from '../model/Transactions';
import { createTransaction } from './updateAdminTrans';
import { updateAdminBalance } from './updateAdminBal';
import { ARTIST_RAFFLE } from '@/config/points';
import { TransactionType } from '../model/enum/TransactionType';
import ArtTable from '../model/ArtTable';

export const artistReward = async (
  artId: string,
  raffleCount: number
) => {
  try {
    const art = await ArtTable.findOne({_id:artId});
    const response = await User.findOneAndUpdate(
        { email:art.email },
        { $inc: { gfxCoin:  raffleCount * ARTIST_RAFFLE } },
        { new: true }
    );
    const newTransaction = new Transactions({
        email: art.email,
        gfxCoin: raffleCount * ARTIST_RAFFLE, 
        transactionType: TransactionType.RECEIVED_FROM_ARTIST_RAFFLE
        });
        await newTransaction.save();
        const transaction = await createTransaction(raffleCount * ARTIST_RAFFLE, AdminTransactionType.SPENT_FOR_ARTIST_RAFFLE,art.email);
        const updatedBalance = await updateAdminBalance(raffleCount * ARTIST_RAFFLE, AdminTransactionType.SPENT);
  } catch (error:any) {
    throw new Error(`Failed to update admin balance: ${error.message}`);
  }
};
