import mongoose, { Document, Model } from 'mongoose';

interface IVoting extends Document {
  participantId: string;
  battleId: string;
  votedFor: 'ArtA' | 'ArtB';
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
  votedFor: {
    type: String,
    required: true,
    enum: ['ArtA', 'ArtB'],
  },
}, { timestamps: true });

const Voting: Model<IVoting> = mongoose.models.Voting || mongoose.model<IVoting>('Voting', votingSchema);

export default Voting;
