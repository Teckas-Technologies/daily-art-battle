import mongoose, { Document, model } from 'mongoose';

interface Campaign extends Document {
  campaignUrl: string;
  campaignName: string;
  campaignWelcomeText: string;
  startDate:string;
  endDate:string;
  creatorId:string;
  createdAt:Date;
  email:string;
  specialRewards:number;
  publiclyVisible:boolean;
  isSpecialRewards:boolean
}

const campaignSchema = new mongoose.Schema({
  campaignUrl: {type: String,required: true,},
  campaignName: {type: String,required: true,},
  campaignWelcomeText: {type: String,required: true,},
  startDate: {type: Date,required: true,},
  endDate: {type: Date,required: true,},
  creatorId: {type: String,required: true,},
  createdAt: { type: Date, default: Date.now,},
  email: {type: String,required: true,},
  specialRewards: {type: Number,required: false,default:false},
  publiclyVisible: {type: Boolean,default: true,},
  isSpecialRewards: {type: Boolean,default: false,},
});

export default mongoose.models.Campaign || model<Campaign>('Campaign', campaignSchema);