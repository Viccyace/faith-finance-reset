"use client";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, Textarea } from "@/components/ui/index";
import { useToast } from "@/components/ui/toast";

interface PrayerModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function PrayerModal({ onClose, onSuccess }: PrayerModalProps) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ content: string }>();

  const onSubmit = async (data: { content: string }) => {
    const res = await fetch("/api/prayer?type=entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: data.content, date: new Date().toISOString() }),
    });
    if (res.ok) {
      toast("Prayer note added");
      onSuccess();
      onClose();
    } else {
      toast("Failed to add prayer note", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md bg-surface rounded-2xl p-5 space-y-4 animate-fade-in shadow-xl border border-border dark:bg-dark-surface dark:border-dark-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary dark:text-white">Prayer Note</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="What's on your heart?">
            <Textarea placeholder="Write your prayer..." {...register("content", { required: true })} className="min-h-[100px]" />
          </FormField>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Prayer Note"}
          </Button>
        </form>
      </div>
    </div>
  );
}
