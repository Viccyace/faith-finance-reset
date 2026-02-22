"use client";
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

// Input
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-surface dark:border-dark-border dark:text-white",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

// Textarea
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50 resize-none dark:bg-dark-surface dark:border-dark-border dark:text-white",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

// Label
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn("text-sm font-medium text-text-primary leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

// Card components
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-2xl border border-border bg-surface shadow-sm dark:bg-dark-surface dark:border-dark-border", className)} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-5 pb-3", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight text-text-primary dark:text-white", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

// Badge
const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "accent" | "success" | "error" }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variant === "default" && "bg-primary-soft text-primary",
      variant === "secondary" && "bg-gray-100 text-gray-700",
      variant === "accent" && "bg-accent/10 text-accent",
      variant === "success" && "bg-green-50 text-green-700",
      variant === "error" && "bg-red-50 text-error",
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

// Progress
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary-soft", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

// Separator
const Separator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("h-px bg-border dark:bg-dark-border w-full", className)} {...props} />
  )
);
Separator.displayName = "Separator";

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      className={cn(
        "flex h-11 w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-surface dark:border-dark-border dark:text-white",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

// FormField wrapper
const FormField = ({ label, error, children, required }: { label: string; error?: string; children: React.ReactNode; required?: boolean }) => (
  <div className="space-y-1.5">
    <Label>{label}{required && <span className="text-error ml-1">*</span>}</Label>
    {children}
    {error && <p className="text-xs text-error">{error}</p>}
  </div>
);

// Toast (simple)
export { Input, Textarea, Label, Card, CardHeader, CardTitle, CardContent, CardFooter, Badge, Progress, Separator, Select, FormField };
