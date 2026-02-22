"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, FormField } from "@/components/ui/index";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/app");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="text-text-muted text-sm mt-1">
            Sign in to continue your reset
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 text-error text-sm p-3 text-center">
              {error}
            </div>
          )}

          <FormField label="Email" error={errors.email?.message} required>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
          </FormField>

          <FormField label="Password" error={errors.password?.message} required>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-11"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FormField>

          <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-primary font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
