import mongoose, { Document, model } from 'mongoose';

interface Campaign extends Document {
  campaignTitle: string;
  campaignTheme: string;
  campaignWelcomeText: string;
  color:string;
  video:string;
}

const campaignSchema = new mongoose.Schema({
    campaignTitle: { type: String, required: true,},
    campaignTheme: {type: String,required: true,},
    campaignWelcomeText: {type: String,required: true,},
    color: {type: String,required: true,},
    video: {type: String,required: true,},
});

export default mongoose.models.Campaign || model<Campaign>('Campaign', campaignSchema);