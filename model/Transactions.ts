import mongoose, { Document, Model } from 'mongoose';
import { TransactionType } from './enum/TransactionType';

interface Transactions extends Document {
  email:string;
  gfxCoin:number;
  transactionType: TransactionType;
}

const TransactionsSchema = new mongoose.Schema({
    email: {type: String, required: true},
    gfxCoin: {type: Number,required: true},
    transactionType: {
      type: String,
      enum: Object.values(TransactionType),
      required: true
    }
}, { timestamps: true });

const Transactions: Model<Transactions> = mongoose.models.Transactions || mongoose.model<Transactions>('Transactions', TransactionsSchema);

export default Transactions;
