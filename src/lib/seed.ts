// Run with: npx ts-node --project tsconfig.json src/lib/seed.ts
// or via: npm run seed

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/faith-finance";

async function seed() {
  console.log("🌱 Seeding database...");
  await mongoose.connect(MONGODB_URI);

  const { default: User } = await import("../models/User");
  const { default: BudgetMonth } = await import("../models/BudgetMonth");
  const { default: ResetPlan } = await import("../models/ResetPlan");

  // Demo user
  const existingUser = await User.findOne({ email: "demo@faithfinance.app" });
  if (!existingUser) {
    const passwordHash = await bcrypt.hash("demo1234", 12);
    const user = await User.create({
      name: "Grace Demo",
      email: "demo@faithfinance.app",
      passwordHash,
      country: "US",
      currency: "USD",
      timezone: "America/New_York",
      plan: "free",
      resetGoal: "budget_discipline",
      onboardingComplete: true,
    });

    // Demo budget
    const now = new Date();
    await BudgetMonth.create({
      userId: user._id.toString(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      incomes: [
        { label: "Salary", amount: 4500, currency: "USD" },
        { label: "Freelance", amount: 500, currency: "USD" },
      ],
      categories: [
        { name: "Housing / Rent", plannedAmount: 1200 },
        { name: "Food & Groceries", plannedAmount: 400 },
        { name: "Transport", plannedAmount: 200 },
        { name: "Utilities", plannedAmount: 150 },
        { name: "Savings", plannedAmount: 500 },
        { name: "Entertainment", plannedAmount: 100 },
        { name: "Miscellaneous", plannedAmount: 200 },
      ],
    });

    // Demo reset plan
    await ResetPlan.create({
      userId: user._id.toString(),
      startDate: new Date(),
      dayIndex: 0,
      completedTaskIds: [],
      streak: 0,
    });

    console.log("✅ Demo user created: demo@faithfinance.app / demo1234");
  } else {
    console.log("ℹ️  Demo user already exists");
  }

  await mongoose.disconnect();
  console.log("✅ Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

export { seed };
