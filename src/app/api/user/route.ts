import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import ResetPlan from "@/models/ResetPlan";
import { z } from "zod";

const onboardSchema = z.object({
  country: z.string().min(2),
  currency: z.string().min(3),
  timezone: z.string().min(1),
  resetGoal: z.enum(["budget_discipline", "debt_reset", "savings_growth", "giving_consistency"]),
});

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const user = await User.findById((session.user as any).id).select("-passwordHash");
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    await dbConnect();

    if (body.onboarding) {
      const data = onboardSchema.parse(body);
      const user = await User.findByIdAndUpdate(
        (session.user as any).id,
        { ...data, onboardingComplete: true },
        { new: true }
      ).select("-passwordHash");

      // Create reset plan
      await ResetPlan.findOneAndUpdate(
        { userId: (session.user as any).id },
        { userId: (session.user as any).id, startDate: new Date(), dayIndex: 0, completedTaskIds: [], streak: 0 },
        { upsert: true, new: true }
      );

      return NextResponse.json(user);
    } else {
      const data = profileSchema.parse(body);
      const user = await User.findByIdAndUpdate(
        (session.user as any).id,
        data,
        { new: true }
      ).select("-passwordHash");
      return NextResponse.json(user);
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: "Invalid password data" }, { status: 400 });
    }

    const bcrypt = await import("bcryptjs");
    await dbConnect();
    const user = await User.findById((session.user as any).id);
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
