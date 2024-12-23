import { ADMIN_GMAIL } from '@/config/constants';
import AdminTransaction from '../model/AdminTransaction';
import { AdminTransactionType } from '../model/enum/AdminTransactionType';
/**
 * Create a new admin transaction.
 * @param adminEmail - The email of the admin performing the transaction.
 * @param gfxCoin - The amount of GFX coins involved.
 * @param transactionType - The type of transaction ("earn" or "spend").
 * @param reciever - The recipient of the transaction.
 * @returns The created transaction.
 */
export const createTransaction = async (
  gfxCoin: number,
  transactionType: AdminTransactionType,
  reciever: string
) => {
  try {
    const transaction = await AdminTransaction.create({
      adminEmail:ADMIN_GMAIL,
      gfxCoin,
      transactionType,
      reciever,
    });
    return transaction;
  } catch (error:any) {
    throw new Error(`Failed to create transaction: ${error.message}`);
  }
};



