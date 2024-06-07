// models/Battle.ts

import mongoose, { Document, model } from 'mongoose';

interface Battle extends Document {
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
  artAgrayScale: string;
  artBgrayScale: string;
  artAcolouredArt: string;
  artBcolouredArt: string;
  artAcolouredArtReference: string;
  artBcolouredArtReference: string;
  artAgrayScaleReference: string;
  artBgrayScaleReference: string;
  winningArt?: 'Art A' | 'Art B';
  artAspecialWinner?: string;
  artBspecialWinner?: string;
  artAvoters?:string[];
  artBvoters?:string[];

}

const BattleSchema = new mongoose.Schema({
  artAId: { type: String, required: true },
  artBId: { type: String, required: true },
  artAartistId: { type: String, required: true },
  artBartistId: { type: String, required: true },
  artAtitle: { type: String, required: true },
  artBtitle: { type: String, required: true },
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
  winningArt: { type: String, enum: ['Art A', 'Art B'], required: false },
  artAVotes: { type: Number, default: 0 },
  artBVotes: { type: Number, default: 0 },
  artAspecialWinner: { type: String, required: false },
  artBspecialWinner: { type: String, required: false },
  artAvoters: { type: [String], required: false },
  artBvoters: { type: [String], required: false },
});

export default mongoose.models.Battle || model<Battle>('Battle', BattleSchema);
