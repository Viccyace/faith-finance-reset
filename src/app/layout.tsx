import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Faith & Finance Reset",
  description: "A Christian financial planner for budget, tithing, and 90-day reset",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Faith & Finance" },
};

export const viewport: Viewport = {
  themeColor: "#2F6B4F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-text-primary antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
