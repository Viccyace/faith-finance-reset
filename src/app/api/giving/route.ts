import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import GivingEntry from "@/models/GivingEntry";
import { z } from "zod";

const givingSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().min(3),
  date: z.string(),
  givingType: z.enum(["tithe", "offering", "seed", "charity"]),
  note: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  await dbConnect();
  let query: any = { userId: (session.user as any).id };
  if (month && year) {
    const start = new Date(parseInt(year), parseInt(month) - 1, 1);
    const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
    query.date = { $gte: start, $lte: end };
  }

  const entries = await GivingEntry.find(query).sort({ date: -1 }).limit(100);
  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = givingSchema.parse(body);
    await dbConnect();
    const entry = await GivingEntry.create({ ...data, date: new Date(data.date), userId: (session.user as any).id });
    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await dbConnect();
  await GivingEntry.deleteOne({ _id: id, userId: (session.user as any).id });
  return NextResponse.json({ success: true });
}
