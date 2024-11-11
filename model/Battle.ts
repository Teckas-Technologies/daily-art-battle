// models/Battle.ts

import mongoose, { Document, model } from 'mongoose';

interface Battle extends Document {
  artAartistEmail:string;
  artBartistEmail:string;
  artAId:string;
  artBId:string;
  artAartistId:string;
  artBartistId:string;
  artAtitle: string;
  artBtitle: string;
  startTime:Date;
  endTime:Date;
  isBattleEnded:Boolean;
  isNftMinted:Boolean;
  artAVotes:Number;
  artBVotes:Number;
  grayScale?: string;
  artAcolouredArt: string;
  artBcolouredArt: string;
  artAcolouredArtReference: string;
  artBcolouredArtReference: string;
  grayScaleReference?: string;
  winningArt?: 'Art A' | 'Art B';
  specialWinner?: string;
  artAspecialWinner?: string;
  artBspecialWinner?: string;
  artAvoters?:string[];
  artBvoters?:string[];
  isSpecialWinnerMinted?:Boolean;
  tokenId:string;
  campaignId:string;
  emoji1:string;
  emoji2:string;
  videoSpinnerReference:string;
  videoSpinner:string;
}

const BattleSchema = new mongoose.Schema({
  videoSpinner: { type: String, required: false },
  videoSpinnerReference: { type: String, required: false },
  emoji1: { type: String, required: true },
  emoji2: { type: String, required: true },
  artAartistEmail: { type: String, required: true },
  artBartistEmail: { type: String, required: true },
  campaignId: { type: String, required: true },
  artAId: { type: String, required: true },
  artBId: { type: String, required: true },
  artAartistId: { type: String, required: false },
  artBartistId: { type: String, required: false },
  artAtitle: { type: String, required: true },
  artBtitle: { type: String, required: true },
  grayScale: { type: String, required: false },
  artAcolouredArt: { type: String, required: true },
  artBcolouredArt: { type: String, required: true },
  artAcolouredArtReference: { type: String, required: true },
  artBcolouredArtReference: { type: String, required: true },
  grayScaleReference: { type: String, required: false },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isBattleEnded: { type: Boolean, default: false },
  isSpecialWinnerMinted: { type: Boolean, default: false },
  isNftMinted: { type: Boolean, default: false },
  winningArt: { type: String, enum: ['Art A', 'Art B'], required: false },
  artAVotes: { type: Number, default: 0 },
  artBVotes: { type: Number, default: 0 },
  specialWinner: { type: String, required: false },
  artAvoters: { type: [String], required: false },
  artBvoters: { type: [String], required: false },
  tokenId: { type: String, required: false },
});

export default mongoose.models.Battle || model<Battle>('Battle', BattleSchema);
