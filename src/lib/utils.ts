import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string, format?: string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function getDaysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((b.getTime() - a.getTime()) / msPerDay);
}

export const COUNTRY_CURRENCIES: Record<string, string> = {
  US: "USD", GB: "GBP", EU: "EUR", NG: "NGN", GH: "GHS",
  KE: "KES", ZA: "ZAR", CA: "CAD", AU: "AUD", IN: "INR",
  BR: "BRL", MX: "MXN", JP: "JPY", SG: "SGD", AE: "AED",
  ZW: "ZWL", UG: "UGX", TZ: "TZS", RW: "RWF", CM: "XAF",
};

export const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
  { code: "KE", name: "Kenya" },
  { code: "ZA", name: "South Africa" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "ZW", name: "Zimbabwe" },
  { code: "UG", name: "Uganda" },
  { code: "TZ", name: "Tanzania" },
  { code: "RW", name: "Rwanda" },
  { code: "CM", name: "Cameroon" },
];

export const CURRENCIES = [
  { code: "USD", name: "US Dollar" },
  { code: "GBP", name: "British Pound" },
  { code: "EUR", name: "Euro" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "GHS", name: "Ghanaian Cedi" },
  { code: "KES", name: "Kenyan Shilling" },
  { code: "ZAR", name: "South African Rand" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "INR", name: "Indian Rupee" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "AED", name: "UAE Dirham" },
];

export const RESET_GOALS = [
  { value: "budget_discipline", label: "Budget Discipline", desc: "Build consistent spending habits" },
  { value: "debt_reset", label: "Debt Reset", desc: "Create a debt-free plan" },
  { value: "savings_growth", label: "Savings Growth", desc: "Grow your emergency fund & savings" },
  { value: "giving_consistency", label: "Giving Consistency", desc: "Establish faithful tithing habits" },
];

export const DEFAULT_CATEGORIES = [
  { name: "Housing / Rent", color: "#2F6B4F", icon: "home" },
  { name: "Food & Groceries", color: "#B08D57", icon: "shopping-cart" },
  { name: "Transport", color: "#6B7280", icon: "car" },
  { name: "Utilities", color: "#1F2937", icon: "zap" },
  { name: "Healthcare", color: "#B42318", icon: "heart" },
  { name: "Education", color: "#4F6B2F", icon: "book" },
  { name: "Entertainment", color: "#8D57B0", icon: "tv" },
  { name: "Clothing", color: "#574BB0", icon: "shirt" },
  { name: "Savings", color: "#2F6B4F", icon: "piggy-bank" },
  { name: "Miscellaneous", color: "#9CA3AF", icon: "more-horizontal" },
];
