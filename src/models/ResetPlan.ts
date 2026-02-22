import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResetPlan extends Document {
  userId: string;
  startDate: Date;
  dayIndex: number;
  completedTaskIds: string[];
  streak: number;
  lastCompletedDate?: Date;
  weeklyReflections: {
    week: number;
    wins: string;
    challenges: string;
    nextSteps: string;
    completedAt?: Date;
  }[];
  createdAt: Date;
}

const ResetPlanSchema = new Schema<IResetPlan>(
  {
    userId: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    dayIndex: { type: Number, default: 0 },
    completedTaskIds: [String],
    streak: { type: Number, default: 0 },
    lastCompletedDate: Date,
    weeklyReflections: [
      {
        week: Number,
        wins: String,
        challenges: String,
        nextSteps: String,
        completedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

const ResetPlan: Model<IResetPlan> =
  mongoose.models.ResetPlan ||
  mongoose.model<IResetPlan>("ResetPlan", ResetPlanSchema);

export default ResetPlan;
