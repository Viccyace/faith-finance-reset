import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import GivingEntry from "@/models/GivingEntry";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));
  const userId = (session.user as any).id;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  await dbConnect();

  const [transactions, givingEntries] = await Promise.all([
    Transaction.find({ userId, date: { $gte: start, $lte: end } }),
    GivingEntry.find({ userId, date: { $gte: start, $lte: end } }),
  ]);

  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const giving = givingEntries.reduce((s, g) => s + g.amount, 0);

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  transactions.filter((t) => t.type === "expense").forEach((t) => {
    const cat = t.categoryName || "Uncategorized";
    categoryMap[cat] = (categoryMap[cat] || 0) + t.amount;
  });
  const topCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, amount]) => ({ name, amount }));

  return NextResponse.json({
    month, year,
    income, expenses, net: income - expenses, giving,
    topCategories,
    transactionCount: transactions.length,
    givingCount: givingEntries.length,
  });
}
