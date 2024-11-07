import mongoose, { Document, Model } from 'mongoose';

interface RaffleTicket extends Document {
  email:string;
  artId: string;
  campaignId:string;
  raffleCount:number;
  isMintedNft:boolean;
}

const RaffleTicketSchema = new mongoose.Schema({
  email: {type: String,required: true,},
  artId: {type: String,required: true,},
  campaignId: { type: String, required: true },
  raffleCount: { type: Number, required: true ,default:0},
  isMintedNft: { type: Boolean, default:false},
}, { timestamps: true });

const RaffleTicket: Model<RaffleTicket> = mongoose.models.RaffleTicket || mongoose.model<RaffleTicket>('RaffleTicket',RaffleTicketSchema);

export default RaffleTicket;
