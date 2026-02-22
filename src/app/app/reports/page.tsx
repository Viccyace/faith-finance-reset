"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Download, TrendingUp, TrendingDown, Heart, BarChart2 } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, Progress, Separator } from "@/components/ui/index";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function ReportsPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const currency = user?.currency || "USD";

  const now = new Date();
  const [month] = useState(now.getMonth() + 1);
  const [year] = useState(now.getFullYear());
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reports?month=${month}&year=${year}`)
      .then((r) => r.json())
      .then((d) => { setReport(d); setLoading(false); });
  }, []);

  const exportTransactions = async () => {
    const res = await fetch(`/api/transactions?month=${month}&year=${year}&limit=500`);
    const txs = await res.json();
    const header = "Date,Type,Category,Amount,Currency,Note";
    const rows = txs.map((t: any) =>
      `${new Date(t.date).toLocaleDateString()},${t.type},${t.categoryName || ""},${t.amount},${t.currency},"${t.note || ""}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `transactions-${year}-${month}.csv`; a.click();
  };

  const exportGiving = async () => {
    const res = await fetch(`/api/giving?month=${month}&year=${year}`);
    const entries = await res.json();
    const header = "Date,Type,Amount,Currency,Note";
    const rows = entries.map((e: any) =>
      `${new Date(e.date).toLocaleDateString()},${e.givingType},${e.amount},${e.currency},"${e.note || ""}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `giving-${year}-${month}.csv`; a.click();
  };

  const monthName = new Date(year, month - 1).toLocaleString("default", { month: "long" });

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <AppHeader title="Reports" subtitle={`${monthName} ${year}`} />

      <div className="page-container pt-5 space-y-5">
        {loading ? (
          <div className="text-center py-8 text-text-muted text-sm">Loading report...</div>
        ) : !report ? (
          <div className="text-center py-8 text-text-muted text-sm">No data this month</div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs text-text-muted">Income</span>
                  </div>
                  <p className="text-lg font-bold text-primary">{formatCurrency(report.income, currency)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingDown className="h-3.5 w-3.5 text-error" />
                    <span className="text-xs text-text-muted">Expenses</span>
                  </div>
                  <p className="text-lg font-bold text-error">{formatCurrency(report.expenses, currency)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <BarChart2 className="h-3.5 w-3.5 text-text-muted" />
                    <span className="text-xs text-text-muted">Net</span>
                  </div>
                  <p className={`text-lg font-bold ${report.net >= 0 ? "text-primary" : "text-error"}`}>
                    {formatCurrency(report.net, currency)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Heart className="h-3.5 w-3.5 text-accent" />
                    <span className="text-xs text-text-muted">Giving</span>
                  </div>
                  <p className="text-lg font-bold text-accent">{formatCurrency(report.giving, currency)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Top categories */}
            {report.topCategories?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Top Spending Categories</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {report.topCategories.map((cat: any, i: number) => {
                    const pct = report.expenses > 0 ? (cat.amount / report.expenses) * 100 : 0;
                    return (
                      <div key={cat.name}>
                        {i > 0 && <Separator className="mb-3" />}
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-sm text-text-primary font-medium">{cat.name}</p>
                          <p className="text-sm text-text-muted">{formatCurrency(cat.amount, currency)}</p>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                        <p className="text-xs text-text-muted mt-1">{Math.round(pct)}% of expenses</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Export */}
            <div>
              <p className="section-title mb-3">Export Data</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={exportTransactions}>
                  <Download className="h-3.5 w-3.5" /> Transactions CSV
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={exportGiving}>
                  <Download className="h-3.5 w-3.5" /> Giving CSV
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
