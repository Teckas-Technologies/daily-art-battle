
import mongoose, { Document, model } from 'mongoose';

export interface UserTable extends Document {
  profileImg: string;
  firstName: string;
  lastName: string;
  email: string;
  walletAddress: string;
  gfxCoin: number;
  isNearDropClaimed:boolean;
  isTelegramDropClaimed: boolean;
  isInstagramConnected:boolean;
  isXConnected:boolean;
  isEmailVerified:boolean;
  isRegistered:boolean;
  referralCode: string;
  referredBy?: mongoose.Types.ObjectId;
  referredUsers: mongoose.Types.ObjectId[];
  createdAt:Date;
}

const UserTableSchema = new mongoose.Schema({
  profileImg: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  walletAddress: { type: String, required: true ,unique:true},
  gfxCoin:  { type: Number, default: 0 },
  isNearDropClaimed: { type: Boolean, default: false },
  isTelegramDropClaimed: { type: Boolean, default: false },
  isInstagramConnected: { type: Boolean, default: false },
  isXConnected: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  isRegistered: { type: Boolean, default: false },
  referralCode: {type: String,unique: true,},
  referredBy: {type: mongoose.Schema.Types.ObjectId,ref: 'UserTable',},
  createdAt: { type: Date, required: true ,default: Date.now},
  referredUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserTable',
    },
  ],
});

export default mongoose.models.UserTable || model<UserTable>('UserTable', UserTableSchema);