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
  isSpecialRewards:boolean;
  specialRewardsArtId?:string[];
  distributedRewards:boolean;
  specialWinnerCount:number;
  totalRewards : number;
  noOfWinners:number;
}
const campaignSchema = new mongoose.Schema({
  specialWinnerCount: {type: Number,required: false,},
  campaignUrl: {type: String,required: true,unique:true},
  campaignName: {type: String,required: true,},
  campaignWelcomeText: {type: String,required: true,},
  startDate: {type: Date,required: true,},
  endDate: {type: Date,required: true,},
  creatorId: {type: String,required: true,},
  createdAt: { type: Date, default: Date.now,},
  email: {type: String,required: true,},
  specialRewards: {type: Number,required: false,default:0},
  publiclyVisible: {type: Boolean,default: true,},
  isSpecialRewards: {type: Boolean,default: false,},
  distributedRewards: {type: Boolean,default: false,},
  specialRewardsArtId: { type: [String], required: false },
  totalRewards : {type: Number,required: true,default:0},
  noOfWinners: {type: Number,required: true,default:0}
});

export default mongoose.models.Campaign || model<Campaign>('Campaign', campaignSchema);
