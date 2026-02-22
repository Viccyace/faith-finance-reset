"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BookOpen, Plus, Trash2, CheckCircle2, X } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, Badge, Textarea, FormField, Input, Separator } from "@/components/ui/index";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

export default function PrayerPage() {
  const { toast } = useToast();
  const now = new Date();
  const [month] = useState(now.getMonth() + 1);
  const [year] = useState(now.getFullYear());
  const [goals, setGoals] = useState<any[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);

  const goalForm = useForm({ defaultValues: { title: "", notes: "", linkedToFinance: false } });
  const entryForm = useForm({ defaultValues: { content: "" } });

  const load = async () => {
    const [goalsRes, entriesRes] = await Promise.all([
      fetch(`/api/prayer?type=goals&month=${month}&year=${year}`),
      fetch(`/api/prayer?type=entries`),
    ]);
    const [g, e] = await Promise.all([goalsRes.json(), entriesRes.json()]);
    setGoals(g || []);
    setEntries(e || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addGoal = async (data: any) => {
    const res = await fetch("/api/prayer?type=goal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, month, year }),
    });
    if (res.ok) { toast("Prayer goal added"); load(); setShowGoalForm(false); goalForm.reset(); }
    else { const e = await res.json(); toast(e.error || "Failed", "error"); }
  };

  const toggleGoal = async (goal: any) => {
    await fetch(`/api/prayer?id=${goal._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !goal.completed }),
    });
    load();
  };

  const deleteGoal = async (id: string) => {
    await fetch(`/api/prayer?id=${id}&type=goal`, { method: "DELETE" });
    toast("Goal deleted");
    load();
  };

  const addEntry = async (data: any) => {
    const res = await fetch("/api/prayer?type=entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: data.content, date: new Date().toISOString() }),
    });
    if (res.ok) { toast("Prayer note saved"); load(); setShowEntryForm(false); entryForm.reset(); }
    else toast("Failed to save", "error");
  };

  const deleteEntry = async (id: string) => {
    await fetch(`/api/prayer?id=${id}&type=entry`, { method: "DELETE" });
    toast("Entry deleted");
    load();
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <AppHeader title="Prayer & Goals" />

      <div className="page-container pt-5 space-y-6">
        {/* Prayer Goals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="section-title">Monthly Prayer Goals ({goals.length}/3)</p>
            {goals.length < 3 && (
              <button onClick={() => setShowGoalForm(!showGoalForm)} className="text-xs text-primary font-medium flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" /> Add Goal
              </button>
            )}
          </div>

          {showGoalForm && (
            <Card className="mb-3">
              <CardContent className="pt-4">
                <form onSubmit={goalForm.handleSubmit(addGoal)} className="space-y-3">
                  <FormField label="Prayer Goal">
                    <Input placeholder="e.g. Pay off credit card debt" {...goalForm.register("title", { required: true })} />
                  </FormField>
                  <FormField label="Notes">
                    <Textarea placeholder="Additional thoughts..." {...goalForm.register("notes")} className="min-h-[60px]" />
                  </FormField>
                  <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                    <input type="checkbox" className="rounded" {...goalForm.register("linkedToFinance")} />
                    Link to a finance goal
                  </label>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={goalForm.formState.isSubmitting}>Save Goal</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setShowGoalForm(false)}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {goals.length === 0 && !showGoalForm && (
            <div className="text-center py-8 text-text-muted">
              <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No prayer goals yet this month</p>
              <p className="text-xs mt-1">Add up to 3 prayer goals for {new Date(year, month - 1).toLocaleString("default", { month: "long" })}</p>
            </div>
          )}

          <div className="space-y-2">
            {goals.map((goal) => (
              <Card key={goal._id}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleGoal(goal)} className="mt-0.5 shrink-0">
                      <CheckCircle2 className={`h-5 w-5 ${goal.completed ? "text-primary fill-primary/20" : "text-border"}`} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${goal.completed ? "line-through text-text-muted" : "text-text-primary"}`}>
                        {goal.title}
                      </p>
                      {goal.notes && <p className="text-xs text-text-muted mt-0.5">{goal.notes}</p>}
                      {goal.linkedToFinance && (
                        <Badge variant="accent" className="mt-1">Linked to Finance</Badge>
                      )}
                    </div>
                    <button onClick={() => deleteGoal(goal._id)} className="text-text-muted hover:text-error shrink-0 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Prayer Journal */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="section-title">Prayer Journal</p>
            <button onClick={() => setShowEntryForm(!showEntryForm)} className="text-xs text-primary font-medium flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" /> New Entry
            </button>
          </div>

          {showEntryForm && (
            <Card className="mb-3">
              <CardContent className="pt-4">
                <form onSubmit={entryForm.handleSubmit(addEntry)} className="space-y-3">
                  <Textarea
                    placeholder="Write your prayer, reflection, or gratitude..."
                    {...entryForm.register("content", { required: true })}
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={entryForm.formState.isSubmitting}>Save</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setShowEntryForm(false)}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {entries.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <p className="text-sm">Your prayer journal is empty</p>
              <p className="text-xs mt-1">Start writing your daily prayers and reflections</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => (
                <Card key={entry._id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs text-text-muted mb-1">{formatDate(entry.date)}</p>
                        <p className="text-sm text-text-primary leading-relaxed">{entry.content}</p>
                      </div>
                      <button onClick={() => deleteEntry(entry._id)} className="text-text-muted hover:text-error shrink-0 p-1">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
