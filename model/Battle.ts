// models/Battle.ts

import mongoose, { Document, model } from 'mongoose';

interface Battle extends Document {
  artAId:string;
  artBId:string;
  startTime:Date;
  endTime:Date;
  isBattleEnded:Boolean;
  isNftMinted:Boolean;
  artAVotes:Number;
  artBVotes:Number;
  artAgrayScale: string;
  artBgrayScale: string;
  artAcolouredArt: string;
  artBcolouredArt: string;
  artAcolouredArtReference: string;
  artBcolouredArtReference: string;
  artAgrayScaleReference: string;
  artBgrayScaleReference: string;
  winningArt?: 'ArtA' | 'ArtB';
  specialWinner?: string;
}

const BattleSchema = new mongoose.Schema({
  artAId: { type: String, required: true },
  artBId: { type: String, required: true },
  artAgrayScale: { type: String, required: true },
  artBgrayScale: { type: String, required: true },
  artAcolouredArt: { type: String, required: true },
  artBcolouredArt: { type: String, required: true },
  artAcolouredArtReference: { type: String, required: true },
  artBcolouredArtReference: { type: String, required: true },
  artAgrayScaleReference: { type: String, required: true },
  artBgrayScaleReference: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isBattleEnded: { type: Boolean, default: false },
  isNftMinted: { type: Boolean, default: false },
  winningArt: { type: String, enum: ['ArtA', 'ArtB'], required: false },
  artAVotes: { type: Number, default: 0 },
  artBVotes: { type: Number, default: 0 },
  specialWinner: { type: String, required: false },
});

export default mongoose.models.Battle || model<Battle>('Battle', BattleSchema);
