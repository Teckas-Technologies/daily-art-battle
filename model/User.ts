
import mongoose, { Document, model } from 'mongoose';

interface UserTable extends Document {
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
}

const UserTableSchema = new mongoose.Schema({
  profileImg: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  walletAddress: { type: String, required: true ,unique:true},
  gfxCoin:  { type: Number, default: 0 },
  isNearDropClaimed: { type: Boolean, default: false },
  isTelegramDropClaimed: { type: Boolean, default: false },
  isInstagramConnected: { type: Boolean, default: false },
  isXConnected: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  isRegistered: { type: Boolean, default: false },
});

export default mongoose.models.UserTable || model<UserTable>('UserTable', UserTableSchema);