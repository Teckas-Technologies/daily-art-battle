import mongoose, { Document, Model } from 'mongoose';

interface RaffleTicket extends Document {
  email:string;
  participantId: string;
  artId: string;
  campaignId:string;
}

const RaffleTicketSchema = new mongoose.Schema({
  email: {type: String,required: true,},
  participantId: {type: String,required: true,},
  artId: {type: String,required: true,},
  campaignId: { type: String, required: true },

}, { timestamps: true });

const RaffleTicket: Model<RaffleTicket> = mongoose.models.RaffleTicket || mongoose.model<RaffleTicket>('RaffleTicket',RaffleTicketSchema);

export default RaffleTicket;
