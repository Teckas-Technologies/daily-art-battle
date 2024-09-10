import mongoose, { Document, Model } from 'mongoose';

interface ArtVoting extends Document {
  participantId: string;
  artId: string;
  votesCount:Number
}

const votingSchema = new mongoose.Schema({
  participantId: {
    type: String,
    required: true,
  },
  artId: {
    type: String,   
    required: true,
  },
  votesCount: {
    type: Number,   
    required: true,
    default:0
  },
}, { timestamps: true });

const UpVoting: Model<ArtVoting> = mongoose.models.UpVoting || mongoose.model<ArtVoting>('UpVoting', votingSchema);

export default UpVoting;
