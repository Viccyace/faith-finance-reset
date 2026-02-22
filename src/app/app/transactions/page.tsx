"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TrendingDown, TrendingUp, Trash2, Plus } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, Badge, Separator } from "@/components/ui/index";
import { Button } from "@/components/ui/button";
import { TransactionModal } from "@/components/dashboard/TransactionModal";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function TransactionsPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const currency = user?.currency || "USD";
  const { toast } = useToast();

  const now = new Date();
  const [month] = useState(now.getMonth() + 1);
  const [year] = useState(now.getFullYear());
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"expense" | "income" | null>(null);

  const load = async () => {
    const res = await fetch(`/api/transactions?month=${month}&year=${year}`);
    const data = await res.json();
    setTransactions(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const deleteTransaction = async (id: string) => {
    await fetch(`/api/transactions?id=${id}`, { method: "DELETE" });
    toast("Transaction deleted");
    load();
  };

  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <AppHeader title="Transactions" subtitle={`${new Date(year, month - 1).toLocaleString("default", { month: "long" })} ${year}`} />

      <div className="page-container pt-5 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="stat-card text-center">
            <p className="text-xs text-text-muted mb-1">Income</p>
            <p className="text-sm font-bold text-primary">{formatCurrency(income, currency)}</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-xs text-text-muted mb-1">Expenses</p>
            <p className="text-sm font-bold text-error">{formatCurrency(expenses, currency)}</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-xs text-text-muted mb-1">Net</p>
            <p className={`text-sm font-bold ${income - expenses >= 0 ? "text-primary" : "text-error"}`}>
              {formatCurrency(income - expenses, currency)}
            </p>
          </div>
        </div>

        {/* Add buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => setModal("expense")}>
            <TrendingDown className="h-3.5 w-3.5 text-error" /> Add Expense
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => setModal("income")}>
            <TrendingUp className="h-3.5 w-3.5 text-primary" /> Add Income
          </Button>
        </div>

        {/* Transactions list */}
        {loading ? (
          <div className="text-center py-8 text-text-muted text-sm">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            <TrendingDown className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No transactions yet</p>
            <p className="text-xs mt-1">Add your first income or expense above</p>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-4 space-y-0 divide-y divide-border">
              {transactions.map((tx) => (
                <div key={tx._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${tx.type === "income" ? "bg-primary-soft" : "bg-red-50"}`}>
                      {tx.type === "income"
                        ? <TrendingUp className="h-4 w-4 text-primary" />
                        : <TrendingDown className="h-4 w-4 text-error" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{tx.categoryName || "Uncategorized"}</p>
                      <p className="text-xs text-text-muted">{formatDate(tx.date)}{tx.note && ` · ${tx.note}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${tx.type === "income" ? "text-primary" : "text-error"}`}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount, tx.currency)}
                    </p>
                    <button onClick={() => deleteTransaction(tx._id)} className="text-text-muted hover:text-error p-1">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {modal && (
        <TransactionModal
          defaultType={modal}
          currency={currency}
          onClose={() => setModal(null)}
          onSuccess={load}
        />
      )}
    </div>
  );
}
