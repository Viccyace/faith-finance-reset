import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPrayerGoal extends Document {
  userId: string;
  month: number;
  year: number;
  title: string;
  notes?: string;
  completed: boolean;
  linkedToFinance: boolean;
  weeklyCheckins: { week: number; text: string }[];
  createdAt: Date;
}

const PrayerGoalSchema = new Schema<IPrayerGoal>(
  {
    userId: { type: String, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    title: { type: String, required: true },
    notes: String,
    completed: { type: Boolean, default: false },
    linkedToFinance: { type: Boolean, default: false },
    weeklyCheckins: [
      {
        week: Number,
        text: String,
      },
    ],
  },
  { timestamps: true }
);

PrayerGoalSchema.index({ userId: 1, month: 1, year: 1 });

export const PrayerGoal: Model<IPrayerGoal> =
  mongoose.models.PrayerGoal ||
  mongoose.model<IPrayerGoal>("PrayerGoal", PrayerGoalSchema);

export interface IPrayerEntry extends Document {
  userId: string;
  date: Date;
  content: string;
  createdAt: Date;
}

const PrayerEntrySchema = new Schema<IPrayerEntry>(
  {
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

PrayerEntrySchema.index({ userId: 1, date: -1 });

export const PrayerEntry: Model<IPrayerEntry> =
  mongoose.models.PrayerEntry ||
  mongoose.model<IPrayerEntry>("PrayerEntry", PrayerEntrySchema);
