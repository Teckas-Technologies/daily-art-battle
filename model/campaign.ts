import mongoose, { Document, model } from 'mongoose';

interface Campaign extends Document {
  campaignTitle: string;
  campaignTheme: string;
  campaignWelcomeText: string;
}

const campaignSchema = new mongoose.Schema({
    campaignTitle: { type: String, required: true,},
    campaignTheme: {type: String,required: true,},
    campaignWelcomeText: {type: String,required: true,},
});

export default mongoose.models.Campaign || model<Campaign>('Battle', campaignSchema);