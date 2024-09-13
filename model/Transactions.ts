import mongoose, { Document, Model } from 'mongoose';

interface Transactions extends Document {
  walletAddress: string;
  hash:string
}

const TransactionsSchema = new mongoose.Schema({
    walletAddress: {type: String, required: true},
    hash: {type: String,required: true,unique:true}
}, { timestamps: true });

const Transactions: Model<Transactions> = mongoose.models.Transactions || mongoose.model<Transactions>('Transactions', TransactionsSchema);

export default Transactions;
