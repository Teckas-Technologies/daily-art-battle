import mongoose, { Document, Model } from 'mongoose';

interface IVoting extends Document {
  email:string;
  participantId?: string;
  battleId: string;
  votedFor: 'Art A' | 'Art B';
  isMinted:boolean;
  campaignId:string;
  fcId?: string;
}

const votingSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
  },
  participantId: {
    type: String,
    required: false,
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
  fcId: {
    type: String,
    required: false,
  }
}, { timestamps: true });

const Voting: Model<IVoting> = mongoose.models.Voting || mongoose.model<IVoting>('Voting', votingSchema);

export default Voting;
