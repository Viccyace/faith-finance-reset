"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, FormField, Select } from "@/components/ui/index";
import { useToast } from "@/components/ui/toast";
import { DEFAULT_CATEGORIES } from "@/lib/utils";

const schema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("Amount must be positive"),
  categoryName: z.string().optional(),
  date: z.string(),
  note: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface TransactionModalProps {
  defaultType?: "income" | "expense";
  currency: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function TransactionModal({ defaultType = "expense", currency, onClose, onSuccess }: TransactionModalProps) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: defaultType,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, currency }),
    });
    if (res.ok) {
      toast("Transaction added successfully");
      onSuccess();
      onClose();
    } else {
      const err = await res.json();
      toast(err.error || "Failed to add transaction", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md bg-surface rounded-2xl p-5 space-y-4 animate-fade-in shadow-xl border border-border dark:bg-dark-surface dark:border-dark-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary dark:text-white">Add Transaction</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Type">
            <Select {...register("type")}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Select>
          </FormField>

          <FormField label="Amount" error={errors.amount?.message} required>
            <Input type="number" step="0.01" placeholder="0.00" {...register("amount")} />
          </FormField>

          <FormField label="Category">
            <Select {...register("categoryName")}>
              <option value="">Select category</option>
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="Date" required>
            <Input type="date" {...register("date")} />
          </FormField>

          <FormField label="Note">
            <Input placeholder="Optional note..." {...register("note")} />
          </FormField>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </div>
    </div>
  );
}
