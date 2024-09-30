import mongoose, { Document, Model } from 'mongoose';

interface FcVoting extends Document {
  participantId: string;
  battleId: string;
  votedFor: 'Art A' | 'Art B';
  isMinted:boolean;
  campaignId:string;
}

const fcVotingSchema = new mongoose.Schema({
  participantId: {
    type: String,
    required: true,
  },
  battleId: {
    type: String,
    required: true,
  },
  isMinted: {
    type: Boolean, default: false
  },
  votedFor: {
    type: String,
    required: true,
    enum: ['Art A', 'Art B'],
  },
  campaignId: { type: String, required: true },
}, { timestamps: true });

const FcVoting: Model<FcVoting> = mongoose.models.FcVoting || mongoose.model<FcVoting>('FcVoting', fcVotingSchema);

export default FcVoting;
