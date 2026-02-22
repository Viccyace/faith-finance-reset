"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Heart, Target, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, Progress, Badge, Separator } from "@/components/ui/index";
import { Button } from "@/components/ui/button";
import { GivingModal } from "@/components/dashboard/GivingModal";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, formatDate } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  tithe: "Tithe", offering: "Offering", seed: "Seed", charity: "Charity",
};

const TYPE_COLORS: Record<string, string> = {
  tithe: "default", offering: "accent", seed: "secondary", charity: "success",
};

export default function GivingPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const currency = user?.currency || "USD";
  const { toast } = useToast();

  const now = new Date();
  const [month] = useState(now.getMonth() + 1);
  const [year] = useState(now.getFullYear());
  const [entries, setEntries] = useState<any[]>([]);
  const [budget, setBudget] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [titheRate, setTitheRate] = useState(10);

  const load = async () => {
    const [givingRes, budgetRes] = await Promise.all([
      fetch(`/api/giving?month=${month}&year=${year}`),
      fetch(`/api/budget?month=${month}&year=${year}`),
    ]);
    const [g, b] = await Promise.all([givingRes.json(), budgetRes.json()]);
    setEntries(g || []);
    setBudget(b);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const totalIncome = budget?.incomes?.reduce((s: number, i: any) => s + i.amount, 0) || 0;
  const titheTarget = (totalIncome * titheRate) / 100;
  const totalGiven = entries.reduce((s, e) => s + e.amount, 0);
  const progress = titheTarget > 0 ? Math.min(100, (totalGiven / titheTarget) * 100) : 0;

  const deleteEntry = async (id: string) => {
    await fetch(`/api/giving?id=${id}`, { method: "DELETE" });
    toast("Entry deleted");
    load();
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <AppHeader title="Giving" subtitle={`${new Date(year, month - 1).toLocaleString("default", { month: "long" })} ${year}`} />

      <div className="page-container pt-5 space-y-5">
        {/* Tithe target card */}
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Target className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Monthly Giving Target</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <select
                      value={titheRate}
                      onChange={(e) => setTitheRate(Number(e.target.value))}
                      className="text-xs border border-border rounded-md px-1.5 py-0.5 bg-surface text-text-muted"
                    >
                      {[5, 7, 10, 12, 15, 20].map((r) => (
                        <option key={r} value={r}>{r}% of income</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-accent">{formatCurrency(totalGiven, currency)}</p>
                <p className="text-xs text-text-muted">of {formatCurrency(titheTarget, currency)}</p>
              </div>
            </div>
            <Progress value={progress} className="h-2.5" />
            <p className="text-xs text-text-muted">
              {progress >= 100 ? "🎉 Target met this month!" : `${Math.round(progress)}% of target reached`}
            </p>
          </CardContent>
        </Card>

        <Button className="w-full gap-2" onClick={() => setShowModal(true)}>
          <Heart className="h-4 w-4" /> Log Giving
        </Button>

        {/* Entries */}
        {loading ? (
          <div className="text-center py-8 text-text-muted text-sm">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            <Heart className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No giving entries yet</p>
            <p className="text-xs mt-1">Log your first tithe or offering above</p>
          </div>
        ) : (
          <div>
            <p className="section-title mb-3">Giving History</p>
            <Card>
              <CardContent className="pt-4 divide-y divide-border space-y-0">
                {entries.map((entry) => (
                  <div key={entry._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium text-text-primary">{TYPE_LABELS[entry.givingType]}</p>
                          <Badge variant={TYPE_COLORS[entry.givingType] as any}>{TYPE_LABELS[entry.givingType]}</Badge>
                        </div>
                        <p className="text-xs text-text-muted">{formatDate(entry.date)}{entry.note && ` · ${entry.note}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-accent">{formatCurrency(entry.amount, entry.currency)}</p>
                      <button onClick={() => deleteEntry(entry._id)} className="text-text-muted hover:text-error p-1">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {showModal && (
        <GivingModal currency={currency} onClose={() => setShowModal(false)} onSuccess={load} />
      )}
    </div>
  );
}
