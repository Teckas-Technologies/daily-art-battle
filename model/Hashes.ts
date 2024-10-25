import mongoose, { Document, Model } from 'mongoose';

interface Hashes extends Document {
  email:string;
  walletAddress: string;
  hash:string
}

const HashesSchema = new mongoose.Schema({
    email: {type: String, required: true},
    walletAddress: {type: String, required: true},
    hash: {type: String,required: true,unique:true}
}, { timestamps: true });

const Hashes: Model<Hashes> = mongoose.models.Hashes || mongoose.model<Hashes>('Hashes', HashesSchema);

export default Hashes;