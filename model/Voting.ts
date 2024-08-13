import mongoose, { Document, Model } from 'mongoose';

interface IVoting extends Document {
  participantId: string;
  battleId: string;
  votedFor: 'Art A' | 'Art B';
  isMinted:boolean;
}

const votingSchema = new mongoose.Schema({
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
}, { timestamps: true });

const Voting: Model<IVoting> = mongoose.models.Voting || mongoose.model<IVoting>('Voting', votingSchema);

export default Voting;
