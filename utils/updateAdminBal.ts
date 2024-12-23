import { AdminTransactionType } from '../model/enum/AdminTransactionType';
import AdminBalance from '../model/AdminBalance';
import { ADMIN_GMAIL } from '@/config/constants';
/**
 * Update admin balance based on a transaction.
 * @param adminEmail - The admin's email.
 * @param gfxCoin - The number of GFX coins involved.
 * @param transactionType - The type of transaction ("earn" or "spend").
 * @returns The updated balance document.
 */
export const updateAdminBalance = async (
  gfxCoin: number,
  transactionType: AdminTransactionType
) => {
  try {
    const updateFields =
      transactionType === AdminTransactionType.EARN
        ? { $inc: { total_earned: gfxCoin, net_balance: gfxCoin } }
        : { $inc: { total_spent: gfxCoin, net_balance: -gfxCoin } };

    const updatedBalance = await AdminBalance.findOneAndUpdate(
      { adminEmail:ADMIN_GMAIL },
      updateFields,
      { upsert: true, new: true }
    );

    return updatedBalance;
  } catch (error:any) {
    throw new Error(`Failed to update admin balance: ${error.message}`);
  }
};
