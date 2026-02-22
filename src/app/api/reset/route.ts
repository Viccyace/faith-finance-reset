import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ResetPlan from "@/models/ResetPlan";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const plan = await ResetPlan.findOne({ userId: (session.user as any).id });
  return NextResponse.json(plan || null);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const userId = (session.user as any).id;
    await dbConnect();

    if (body.completeTask) {
      const taskId = body.taskId;
      const plan = await ResetPlan.findOne({ userId });
      if (!plan) return NextResponse.json({ error: "No plan found" }, { status: 404 });

      if (!plan.completedTaskIds.includes(taskId)) {
        plan.completedTaskIds.push(taskId);
        // Update streak
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const last = plan.lastCompletedDate ? new Date(plan.lastCompletedDate) : null;
        if (last) {
          last.setHours(0, 0, 0, 0);
          const diff = (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
          if (diff === 1) plan.streak += 1;
          else if (diff > 1) plan.streak = 1;
        } else {
          plan.streak = 1;
        }
        plan.lastCompletedDate = today;
        await plan.save();
      }
      return NextResponse.json(plan);
    }

    if (body.weeklyReflection) {
      const plan = await ResetPlan.findOneAndUpdate(
        { userId },
        { $push: { weeklyReflections: { ...body.reflection, completedAt: new Date() } } },
        { new: true }
      );
      return NextResponse.json(plan);
    }

    const plan = await ResetPlan.findOneAndUpdate({ userId }, body, { new: true });
    return NextResponse.json(plan);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
