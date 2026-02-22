"use client";
import { useState } from "react";
import { Plus, X, TrendingDown, TrendingUp, Heart, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAddFABProps {
  onAddExpense: () => void;
  onAddIncome: () => void;
  onAddGiving: () => void;
  onAddPrayer: () => void;
}

export function QuickAddFAB({ onAddExpense, onAddIncome, onAddGiving, onAddPrayer }: QuickAddFABProps) {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: TrendingDown, label: "Expense", onClick: onAddExpense, color: "bg-error text-white" },
    { icon: TrendingUp, label: "Income", onClick: onAddIncome, color: "bg-primary text-white" },
    { icon: Heart, label: "Giving", onClick: onAddGiving, color: "bg-accent text-white" },
    { icon: BookOpen, label: "Prayer", onClick: onAddPrayer, color: "bg-text-primary text-white" },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="fixed bottom-20 right-5 z-50 flex flex-col-reverse items-end gap-3">
        {open && actions.map(({ icon: Icon, label, onClick, color }, i) => (
          <div
            key={label}
            className="flex items-center gap-2 animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="text-xs font-medium bg-surface text-text-primary px-2.5 py-1 rounded-lg shadow-sm border border-border">
              {label}
            </span>
            <button
              className={cn("h-11 w-11 rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95", color)}
              onClick={() => { onClick(); setOpen(false); }}
            >
              <Icon className="h-5 w-5" />
            </button>
          </div>
        ))}
        <button
          className={cn(
            "h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all",
            open ? "bg-text-primary text-white rotate-45" : "bg-primary text-white"
          )}
          onClick={() => setOpen(!open)}
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}
