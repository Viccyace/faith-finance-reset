import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { PrayerGoal, PrayerEntry } from "@/models/Prayer";
import { z } from "zod";

const goalSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number(),
  title: z.string().min(1),
  notes: z.string().optional(),
  linkedToFinance: z.boolean().optional(),
});

const entrySchema = z.object({
  date: z.string(),
  content: z.string().min(1),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "goals";
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const userId = (session.user as any).id;

  await dbConnect();

  if (type === "goals") {
    const query: any = { userId };
    if (month && year) { query.month = parseInt(month); query.year = parseInt(year); }
    const goals = await PrayerGoal.find(query).sort({ createdAt: -1 });
    return NextResponse.json(goals);
  } else {
    const entries = await PrayerEntry.find({ userId }).sort({ date: -1 }).limit(30);
    return NextResponse.json(entries);
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "goal";
  const userId = (session.user as any).id;

  try {
    const body = await req.json();
    await dbConnect();

    if (type === "goal") {
      const data = goalSchema.parse(body);
      const count = await PrayerGoal.countDocuments({ userId, month: data.month, year: data.year });
      if (count >= 3) {
        return NextResponse.json({ error: "Maximum 3 prayer goals per month" }, { status: 400 });
      }
      const goal = await PrayerGoal.create({ ...data, userId });
      return NextResponse.json(goal, { status: 201 });
    } else {
      const data = entrySchema.parse(body);
      const entry = await PrayerEntry.create({ ...data, date: new Date(data.date), userId });
      return NextResponse.json(entry, { status: 201 });
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    const body = await req.json();
    await dbConnect();
    const goal = await PrayerGoal.findOneAndUpdate(
      { _id: id, userId: (session.user as any).id },
      body,
      { new: true }
    );
    return NextResponse.json(goal);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type") || "goal";

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await dbConnect();
  if (type === "goal") {
    await PrayerGoal.deleteOne({ _id: id, userId: (session.user as any).id });
  } else {
    await PrayerEntry.deleteOne({ _id: id, userId: (session.user as any).id });
  }
  return NextResponse.json({ success: true });
}
