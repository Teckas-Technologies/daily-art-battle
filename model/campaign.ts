import mongoose, { Document, model } from 'mongoose';

interface Campaign extends Document {
  campaignTitle: string;
  campaignTheme: string;
  campaignWelcomeText: string;
  color:string;
  video:string;
  startDate:string;
  logo:string;
  endDate:string;
  creatorId:string;
}

const campaignSchema = new mongoose.Schema({
    campaignTitle: { type: String, required: true,},
    creatorId: { type: String, required: true,},
    campaignTheme: {type: String,required: true,},
    campaignWelcomeText: {type: String,required: true,},
    color: {type: String,required: false,},
    video: {type: String,required: false,},
    logo: {type: String,required: false,},
    startDate: {type: String,required: true,},
    endDate: {type: String,required: true,},
});

export default mongoose.models.Campaign || model<Campaign>('Campaign', campaignSchema);