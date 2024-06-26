// models/Battle.ts
import mongoose, { Document, model } from 'mongoose';

interface ArtTable extends Document {
  artistId: string;
  arttitle: string;
  colouredArt: string;
  grayScale: string;
  colouredArtReference: string;
  grayScaleReference: string;
  uploadedTime: Date;
  upVotes : Number;
  isCompleted:Boolean;
  isStartedBattle:Boolean;
  specialWinner?: string;
  votes?:Number;
  battleTime?: Date;
  endTime?: Date;
  tokenId:Number;
}

const ArtTableSchema = new mongoose.Schema({
  artistId: { type: String, required: true },
  arttitle: { type: String, required: true },
  colouredArt: { type: String, required: true },
  grayScale: { type: String, required: true },
  colouredArtReference: { type: String, required: true },
  grayScaleReference: { type: String, required: true },
  uploadedTime: { type: Date, required: true },
  upVotes: { type: Number, default: 0 },
  votes: { type: Number, default: 0 },
  tokenId: { type: Number, default: 0 },
  isCompleted:{type: Boolean,default:false},
  isStartedBattle:{type: Boolean,default:false},
  specialWinner: { type: String, required: false },
  battleTime: { type: Date},
  endTime: { type: Date},
});

export default mongoose.models.ArtTable || model<ArtTable>('ArtTable', ArtTableSchema);
