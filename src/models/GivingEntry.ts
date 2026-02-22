import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGivingEntry extends Document {
  userId: string;
  amount: number;
  currency: string;
  date: Date;
  givingType: "tithe" | "offering" | "seed" | "charity";
  note?: string;
  createdAt: Date;
}

const GivingEntrySchema = new Schema<IGivingEntry>(
  {
    userId: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true },
    date: { type: Date, required: true },
    givingType: {
      type: String,
      enum: ["tithe", "offering", "seed", "charity"],
      required: true,
    },
    note: String,
  },
  { timestamps: true }
);

GivingEntrySchema.index({ userId: 1, date: -1 });

const GivingEntry: Model<IGivingEntry> =
  mongoose.models.GivingEntry ||
  mongoose.model<IGivingEntry>("GivingEntry", GivingEntrySchema);

export default GivingEntry;
