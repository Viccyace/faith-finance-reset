import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  _id: string;
  email: string;
  passwordHash: string;
  name: string;
  country: string;
  currency: string;
  timezone: string;
  plan: "free" | "pro";
  resetGoal: "budget_discipline" | "debt_reset" | "savings_growth" | "giving_consistency";
  onboardingComplete: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    country: { type: String, default: "US" },
    currency: { type: String, default: "USD" },
    timezone: { type: String, default: "America/New_York" },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    resetGoal: {
      type: String,
      enum: ["budget_discipline", "debt_reset", "savings_growth", "giving_consistency"],
      default: "budget_discipline",
    },
    onboardingComplete: { type: Boolean, default: false },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
