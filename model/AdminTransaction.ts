import mongoose, { Document, Model } from 'mongoose';
import { AdminTransactionType } from './enum/AdminTransactionType';

interface AdminTransaction extends Document {
     adminEmail:string;
     gfxCoin:number;
     transactionType: AdminTransactionType;
     reciever:string;
}

const AdminTransactionSchema = new mongoose.Schema({
        adminEmail: {type: String, required: true},
        gfxCoin: {type: Number,required: true},
        transactionType: {
          type: String,
          enum: Object.values(AdminTransactionType),
          required: true
        },
        reciever:{type: String, required: true},
    }, { timestamps: true });

const AdminTransaction: Model<AdminTransaction> = mongoose.models.AdminTransaction || mongoose.model<AdminTransaction>('AdminTransaction', AdminTransactionSchema);

export default AdminTransaction;