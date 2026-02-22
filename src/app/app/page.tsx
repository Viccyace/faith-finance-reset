"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TrendingDown, TrendingUp, Heart, Flame, BookOpen, ArrowRight, CheckSquare } from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/layout/AppHeader";
import { QuickAddFAB } from "@/components/layout/QuickAddFAB";
import { TransactionModal } from "@/components/dashboard/TransactionModal";
import { GivingModal } from "@/components/dashboard/GivingModal";
import { PrayerModal } from "@/components/dashboard/PrayerModal";
import { Card, CardContent, Progress, Badge, Separator } from "@/components/ui/index";
import { formatCurrency } from "@/lib/utils";
import { getDailyScripture } from "@/lib/data";

interface DashboardData {
  budget: any;
  transactions: any[];
  giving: any[];
  reset: any;
  reports: any;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user as any;
  const currency = user?.currency || "USD";

  const [data, setData] = useState<Partial<DashboardData>>({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"expense" | "income" | "giving" | "prayer" | null>(null);

  useEffect(() => {
    if (user && !user.onboardingComplete) {
      router.push("/app/onboarding");
    }
  }, [user, router]);

  const load = async () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [budgetRes, txRes, givingRes, resetRes, reportsRes] = await Promise.all([
      fetch(`/api/budget?month=${month}&year=${year}`),
      fetch(`/api/transactions?month=${month}&year=${year}&limit=5`),
      fetch(`/api/giving?month=${month}&year=${year}`),
      fetch("/api/reset"),
      fetch(`/api/reports?month=${month}&year=${year}`),
    ]);

    const [budget, transactions, giving, reset, reports] = await Promise.all([
      budgetRes.json(), txRes.json(), givingRes.json(), resetRes.json(), reportsRes.json(),
    ]);

    setData({ budget, transactions, giving, reset, reports });
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const { budget, transactions, giving, reset, reports } = data;

  const totalIncome = budget?.incomes?.reduce((s: number, i: any) => s + i.amount, 0) || 0;
  const totalExpenses = reports?.expenses || 0;
  const totalGiving = reports?.giving || 0;
  const remaining = totalIncome - totalExpenses;

  const today = new Date();
  const scripture = getDailyScripture(user?.resetGoal || "budget_discipline", reset?.dayIndex || 0);

  const resetProgress = reset ? Math.min(100, ((reset.completedTaskIds?.length || 0) / 90) * 100) : 0;
  const dayNumber = reset ? Math.min(90, reset.completedTaskIds?.length + 1) : 1;

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <AppHeader />

      <div className="page-container pt-5 space-y-5">
        {/* Scripture Card */}
        <div className="scripture-card">
          <p className="text-xs text-white/60 mb-2 font-medium">Today's Word</p>
          <p className="text-sm font-medium text-white leading-relaxed">{scripture.verse}</p>
          <p className="text-xs text-white/60 mt-2">— {scripture.reference}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-7 w-7 rounded-lg bg-primary-soft flex items-center justify-center">
                  <TrendingDown className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs text-text-muted">Remaining</span>
              </div>
              <p className={`text-lg font-bold ${remaining >= 0 ? "text-primary" : "text-error"}`}>
                {loading ? "—" : formatCurrency(remaining, currency)}
              </p>
              <p className="text-xs text-text-muted mt-0.5">this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-7 w-7 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Heart className="h-3.5 w-3.5 text-accent" />
                </div>
                <span className="text-xs text-text-muted">Given</span>
              </div>
              <p className="text-lg font-bold text-accent">
                {loading ? "—" : formatCurrency(totalGiving, currency)}
              </p>
              <p className="text-xs text-text-muted mt-0.5">this month</p>
            </CardContent>
          </Card>
        </div>

        {/* 90-Day Reset Progress */}
        {reset && (
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-primary-soft flex items-center justify-center">
                    <Flame className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">90-Day Reset</p>
                    <p className="text-xs text-text-muted">Day {dayNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {reset.streak > 0 && (
                    <Badge variant="default" className="gap-1">
                      <Flame className="h-3 w-3" /> {reset.streak}d
                    </Badge>
                  )}
                  <Link href="/app/reset/today">
                    <ArrowRight className="h-4 w-4 text-text-muted" />
                  </Link>
                </div>
              </div>
              <Progress value={resetProgress} />
              <p className="text-xs text-text-muted">{reset.completedTaskIds?.length || 0} of 90 tasks complete</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div>
          <p className="section-title mb-3">Quick Actions</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Expense", icon: TrendingDown, action: () => setModal("expense"), color: "text-error" },
              { label: "Income", icon: TrendingUp, action: () => setModal("income"), color: "text-primary" },
              { label: "Giving", icon: Heart, action: () => setModal("giving"), color: "text-accent" },
              { label: "Prayer", icon: BookOpen, action: () => setModal("prayer"), color: "text-text-muted" },
            ].map(({ label, icon: Icon, action, color }) => (
              <button
                key={label}
                onClick={action}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-surface hover:bg-primary-soft/50 transition-colors active:scale-95"
              >
                <Icon className={`h-5 w-5 ${color}`} />
                <span className="text-[10px] font-medium text-text-muted">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        {transactions && transactions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="section-title">Recent</p>
              <Link href="/app/transactions" className="text-xs text-primary font-medium">See all</Link>
            </div>
            <Card>
              <CardContent className="pt-4 space-y-0">
                {transactions.slice(0, 5).map((tx: any, i: number) => (
                  <div key={tx._id}>
                    {i > 0 && <Separator className="my-3" />}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{tx.categoryName || "Uncategorized"}</p>
                        <p className="text-xs text-text-muted">{new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                      <p className={`text-sm font-semibold ${tx.type === "income" ? "text-primary" : "text-error"}`}>
                        {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount, tx.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {!loading && transactions?.length === 0 && (
          <div className="text-center py-8 text-text-muted">
            <CheckSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No transactions yet this month</p>
            <p className="text-xs mt-1">Tap + to add your first transaction</p>
          </div>
        )}
      </div>

      <QuickAddFAB
        onAddExpense={() => setModal("expense")}
        onAddIncome={() => setModal("income")}
        onAddGiving={() => setModal("giving")}
        onAddPrayer={() => setModal("prayer")}
      />

      {(modal === "expense" || modal === "income") && (
        <TransactionModal
          defaultType={modal}
          currency={currency}
          onClose={() => setModal(null)}
          onSuccess={load}
        />
      )}
      {modal === "giving" && (
        <GivingModal currency={currency} onClose={() => setModal(null)} onSuccess={load} />
      )}
      {modal === "prayer" && (
        <PrayerModal onClose={() => setModal(null)} onSuccess={load} />
      )}
    </div>
  );
}
