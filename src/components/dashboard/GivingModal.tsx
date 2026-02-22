"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, FormField, Select, Textarea } from "@/components/ui/index";
import { useToast } from "@/components/ui/toast";

const schema = z.object({
  amount: z.coerce.number().positive(),
  date: z.string(),
  givingType: z.enum(["tithe", "offering", "seed", "charity"]),
  note: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface GivingModalProps {
  currency: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function GivingModal({ currency, onClose, onSuccess }: GivingModalProps) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { date: new Date().toISOString().split("T")[0], givingType: "tithe" },
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/giving", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, currency }),
    });
    if (res.ok) {
      toast("Giving entry logged");
      onSuccess();
      onClose();
    } else {
      toast("Failed to log giving", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md bg-surface rounded-2xl p-5 space-y-4 animate-fade-in shadow-xl border border-border dark:bg-dark-surface dark:border-dark-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary dark:text-white">Log Giving</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Amount" error={errors.amount?.message} required>
            <Input type="number" step="0.01" placeholder="0.00" {...register("amount")} />
          </FormField>
          <FormField label="Type">
            <Select {...register("givingType")}>
              <option value="tithe">Tithe</option>
              <option value="offering">Offering</option>
              <option value="seed">Seed</option>
              <option value="charity">Charity</option>
            </Select>
          </FormField>
          <FormField label="Date" required>
            <Input type="date" {...register("date")} />
          </FormField>
          <FormField label="Note">
            <Textarea placeholder="Optional note..." {...register("note")} className="min-h-[60px]" />
          </FormField>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging..." : "Log Giving"}
          </Button>
        </form>
      </div>
    </div>
  );
}
