// models/Battle.ts
import mongoose, { Document, model } from 'mongoose';

interface Theme extends Document {
  month: string;
  week: Number;
  holidayInspiredTheme: string;
  artisticStyleMovement: string;
  controversialTopic: string;
 
}

const ThemeSchema = new mongoose.Schema({
    month: { type: String, required: true },
    week: { type: Number, required: true },
    holidayInspiredTheme: { type: String, required: true },
    artisticStyleMovement: { type: String, required: true },
    controversialTopic: { type: String, required: true },
});

export default mongoose.models.Theme || model<Theme>('Theme', ThemeSchema);