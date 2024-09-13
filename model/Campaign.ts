import mongoose, { Document, model } from 'mongoose';

interface Campaign extends Document {
  campaignUrl: string;
  campaignTheme: string;
  campaignWelcomeText: string;
  color:string;
  video:string;
  startDate:Date;
  logo:string;
  endDate:Date;
  creatorId:string;
  reward:string;
}

const campaignSchema = new mongoose.Schema({
    campaignUrl: { type: String, required: true,},
    creatorId: { type: String, required: true,},
    campaignTheme: {type: String,required: true,},
    campaignWelcomeText: {type: String,required: true,},
    color: {type: String,required: false,},
    video: {type: String,required: false,},
    logo: {type: String,required: false,},
    startDate: {type: Date,required: true,},
    endDate: {type: Date,required: true,},
    reward: {type: String,required: true,},
});

export default mongoose.models.Campaign || model<Campaign>('Campaign', campaignSchema);