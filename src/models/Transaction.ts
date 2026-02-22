import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransaction extends Document {
  userId: string;
  type: "income" | "expense";
  amount: number;
  currency: string;
  categoryId?: string;
  categoryName?: string;
  date: Date;
  note?: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: String, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true },
    categoryId: String,
    categoryName: String,
    date: { type: Date, required: true },
    note: String,
  },
  { timestamps: true }
);

TransactionSchema.index({ userId: 1, date: -1 });

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
