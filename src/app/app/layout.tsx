import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const user = session.user as any;
  if (!user.onboardingComplete && !process.env.SKIP_ONBOARD) {
    // Allow onboarding route
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      {children}
      <BottomNav />
    </div>
  );
}
