import mongoose, { Document, model } from 'mongoose';

interface DailyCheckin extends Document {
    email:string;
    streakDays:number;
    totalStreakDays:number;
    lastClaimedDate:Date;
    lastWeeklyClaimDate:Date;
}
const DailyCheckinSchema = new mongoose.Schema({
    email: {type:String,required: true,},
    streakDays :{ type: Number,default: 0,},
    totalStreakDays: {type: Number,default: 0,},
    lastClaimedDate: {type:Date,default:null},
    lastWeeklyClaimDate: {type: Date,default: null,},
})

export default mongoose.models.DailyCheckin || model<DailyCheckin>('DailyCheckin', DailyCheckinSchema);