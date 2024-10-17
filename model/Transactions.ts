import mongoose, { Document, Model } from 'mongoose';

interface Transactions extends Document {
  email:string;
  walletAddress: string;
  hash:string
}

const TransactionsSchema = new mongoose.Schema({
    email: {type: String, required: true},
    walletAddress: {type: String, required: true},
    hash: {type: String,required: true,unique:true}
}, { timestamps: true });

const Transactions: Model<Transactions> = mongoose.models.Transactions || mongoose.model<Transactions>('Transactions', TransactionsSchema);

export default Transactions;
