"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Save } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, Progress, Separator, FormField, Input, Select } from "@/components/ui/index";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, DEFAULT_CATEGORIES } from "@/lib/utils";

export default function BudgetPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const currency = user?.currency || "USD";
  const { toast } = useToast();

  const now = new Date();
  const [month] = useState(now.getMonth() + 1);
  const [year] = useState(now.getFullYear());
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);

  const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      incomes: [{ label: "Salary", amount: 0, currency }],
      categories: DEFAULT_CATEGORIES.map((c) => ({ name: c.name, plannedAmount: 0 })),
    },
  });

  const { fields: incomeFields, append: addIncome, remove: removeIncome } = useFieldArray({ control, name: "incomes" });
  const { fields: catFields, append: addCat, remove: removeCat } = useFieldArray({ control, name: "categories" });

  useEffect(() => {
    const load = async () => {
      const [budgetRes, txRes] = await Promise.all([
        fetch(`/api/budget?month=${month}&year=${year}`),
        fetch(`/api/transactions?month=${month}&year=${year}`),
      ]);
      const [budget, txs] = await Promise.all([budgetRes.json(), txRes.json()]);
      if (budget) {
        reset({
          incomes: budget.incomes?.length ? budget.incomes : [{ label: "Salary", amount: 0, currency }],
          categories: budget.categories?.length ? budget.categories : DEFAULT_CATEGORIES.map((c) => ({ name: c.name, plannedAmount: 0 })),
        });
      }
      setTransactions(txs || []);
      setLoading(false);
    };
    load();
  }, []);

  const onSubmit = async (data: any) => {
    const res = await fetch("/api/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, month, year, incomes: data.incomes.map((i: any) => ({ ...i, currency, amount: parseFloat(i.amount) })) }),
    });
    if (res.ok) toast("Budget saved");
    else toast("Failed to save budget", "error");
  };

  const monthExpByCategory = (catName: string) =>
    transactions.filter((t) => t.type === "expense" && t.categoryName === catName).reduce((s: number, t: any) => s + t.amount, 0);

  const totalIncome = 0; // computed in form

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <AppHeader title="Budget" subtitle={`${new Date(year, month - 1).toLocaleString("default", { month: "long" })} ${year}`} />

      <div className="page-container pt-5 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Income */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="section-title">Income Sources</p>
              <button type="button" onClick={() => addIncome({ label: "", amount: 0, currency })} className="text-xs text-primary font-medium flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
            <Card>
              <CardContent className="pt-4 space-y-3">
                {incomeFields.map((field, i) => (
                  <div key={field.id} className="flex items-end gap-2">
                    <div className="flex-1">
                      <Input placeholder="Label (e.g. Salary)" {...register(`incomes.${i}.label`)} />
                    </div>
                    <div className="w-28">
                      <Input type="number" step="0.01" placeholder="Amount" {...register(`incomes.${i}.amount`)} />
                    </div>
                    {incomeFields.length > 1 && (
                      <button type="button" onClick={() => removeIncome(i)} className="text-error pb-2">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="section-title">Budget Categories</p>
              <button type="button" onClick={() => addCat({ name: "", plannedAmount: 0 })} className="text-xs text-primary font-medium flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
            <Card>
              <CardContent className="pt-4 space-y-4">
                {catFields.map((field, i) => {
                  return (
                    <div key={field.id} className="space-y-1">
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <Input placeholder="Category name" {...register(`categories.${i}.name`)} />
                        </div>
                        <div className="w-28">
                          <Input type="number" step="0.01" placeholder="Budget" {...register(`categories.${i}.plannedAmount`)} />
                        </div>
                        {catFields.length > 1 && (
                          <button type="button" onClick={() => removeCat(i)} className="text-error pb-2">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Budget"}
          </Button>
        </form>

        {/* Spending vs Budget */}
        {transactions.length > 0 && (
          <div>
            <p className="section-title mb-3">This Month's Spending</p>
            <div className="space-y-3">
              {DEFAULT_CATEGORIES.map((cat) => {
                const spent = monthExpByCategory(cat.name);
                return (
                  <Card key={cat.name}>
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-text-primary">{cat.name}</p>
                        <p className="text-sm font-semibold text-text-muted">{formatCurrency(spent, currency)}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
