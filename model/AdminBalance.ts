import mongoose, { Document, Model } from 'mongoose';

interface AdminBalance extends Document {
    adminEmail:string;
    total_earned: number;
    total_spent: number;
    net_balance: number;
}

const AdminBalanceSchema = new mongoose.Schema({
    adminEmail: {type: String, required: true},
    total_earned: {type: Number, required: true},
    total_spent: {type: Number, required: true},
    net_balance: {type: Number,required: true}
}, { timestamps: true });

const AdminBalance: Model<AdminBalance> = mongoose.models.AdminBalance || mongoose.model<AdminBalance>('AdminBalance', AdminBalanceSchema);

export default AdminBalance;