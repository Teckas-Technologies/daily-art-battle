import mongoose, { Document, Model } from 'mongoose';

interface Transactions extends Document {
  email:string;
  gfxCoin:number;
  transactionType: 'received' | 'spent';
}

const TransactionsSchema = new mongoose.Schema({
    email: {type: String, required: true},
    gfxCoin: {type: String,required: true,unique:true},
    transactionType: {
      type: String,
      enum: ['received', 'spent'],
      required: true
    }
}, { timestamps: true });

const Transactions: Model<Transactions> = mongoose.models.Transactions || mongoose.model<Transactions>('Transactions', TransactionsSchema);

export default Transactions;
