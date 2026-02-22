import mongoose, { Schema, Document, Model } from "mongoose";

export interface IIncomeSource {
  _id?: string;
  label: string;
  amount: number;
  currency: string;
}

export interface IBudgetCategory {
  _id?: string;
  name: string;
  plannedAmount: number;
  color?: string;
  icon?: string;
}

export interface IBudgetMonth extends Document {
  userId: string;
  month: number; // 1-12
  year: number;
  incomes: IIncomeSource[];
  categories: IBudgetCategory[];
  createdAt: Date;
  updatedAt: Date;
}

const IncomeSrcSchema = new Schema({
  label: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
});

const BudgetCategorySchema = new Schema({
  name: { type: String, required: true },
  plannedAmount: { type: Number, required: true },
  color: { type: String, default: "#2F6B4F" },
  icon: { type: String, default: "circle" },
});

const BudgetMonthSchema = new Schema<IBudgetMonth>(
  {
    userId: { type: String, required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    incomes: [IncomeSrcSchema],
    categories: [BudgetCategorySchema],
  },
  { timestamps: true }
);

BudgetMonthSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

const BudgetMonth: Model<IBudgetMonth> =
  mongoose.models.BudgetMonth ||
  mongoose.model<IBudgetMonth>("BudgetMonth", BudgetMonthSchema);

export default BudgetMonth;
