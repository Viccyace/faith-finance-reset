"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession, signOut } from "next-auth/react";
import { User, Lock, Globe, LogOut, Moon, Sun, Crown } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, FormField, Input, Select, Separator } from "@/components/ui/index";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { COUNTRIES, CURRENCIES, RESET_GOALS } from "@/lib/utils";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const user = session?.user as any;
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const profileForm = useForm({
    defaultValues: { name: "", country: "US", currency: "USD", timezone: "America/New_York" },
  });

  const pwForm = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    fetch("/api/user").then((r) => r.json()).then((u) => {
      if (u) {
        profileForm.reset({
          name: u.name || "",
          country: u.country || "US",
          currency: u.currency || "USD",
          timezone: u.timezone || "America/New_York",
        });
      }
    });
  }, []);

  const saveProfile = async (data: any) => {
    setProfileLoading(true);
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await update({ name: data.name, currency: data.currency });
      toast("Profile updated");
    } else toast("Failed to update profile", "error");
    setProfileLoading(false);
  };

  const changePassword = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast("Passwords don't match", "error");
      return;
    }
    setPwLoading(true);
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
    });
    if (res.ok) { toast("Password changed"); pwForm.reset(); }
    else { const e = await res.json(); toast(e.error || "Failed", "error"); }
    setPwLoading(false);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <AppHeader title="Settings" />

      <div className="page-container pt-5 space-y-6">
        {/* Plan */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Crown className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Current Plan</p>
                  <p className="text-xs text-text-muted capitalize">{user?.plan || "free"}</p>
                </div>
              </div>
              <Link href="/app/upgrade">
                <Button variant="secondary" size="sm">Upgrade</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Theme toggle */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary-soft flex items-center justify-center">
                  {theme === "dark" ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
                </div>
                <p className="text-sm font-medium text-text-primary">Appearance</p>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="text-xs border border-border rounded-lg px-2.5 py-1.5 bg-surface text-text-primary"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Profile */}
        <div>
          <p className="section-title mb-3">Profile</p>
          <Card>
            <CardContent className="pt-4">
              <form onSubmit={profileForm.handleSubmit(saveProfile)} className="space-y-4">
                <FormField label="Name">
                  <Input {...profileForm.register("name")} />
                </FormField>
                <FormField label="Country">
                  <Select {...profileForm.register("country")}>
                    {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </Select>
                </FormField>
                <FormField label="Currency">
                  <Select {...profileForm.register("currency")}>
                    {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
                  </Select>
                </FormField>
                <FormField label="Timezone">
                  <Select {...profileForm.register("timezone")}>
                    {["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
                      "Europe/London", "Europe/Paris", "Africa/Lagos", "Africa/Nairobi",
                      "Asia/Kolkata", "Asia/Singapore", "Australia/Sydney"].map((tz) => (
                      <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>
                    ))}
                  </Select>
                </FormField>
                <Button type="submit" className="w-full" disabled={profileLoading}>
                  {profileLoading ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Password */}
        <div>
          <p className="section-title mb-3">Security</p>
          <Card>
            <CardContent className="pt-4">
              <form onSubmit={pwForm.handleSubmit(changePassword)} className="space-y-4">
                <FormField label="Current Password">
                  <Input type="password" placeholder="••••••••" {...pwForm.register("currentPassword", { required: true })} />
                </FormField>
                <FormField label="New Password">
                  <Input type="password" placeholder="Min. 8 characters" {...pwForm.register("newPassword", { required: true, minLength: 8 })} />
                </FormField>
                <FormField label="Confirm New Password">
                  <Input type="password" placeholder="••••••••" {...pwForm.register("confirmPassword", { required: true })} />
                </FormField>
                <Button type="submit" variant="outline" className="w-full" disabled={pwLoading}>
                  {pwLoading ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sign out */}
        <Button
          variant="outline"
          className="w-full gap-2 text-error border-error/30 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
    </div>
  );
}
