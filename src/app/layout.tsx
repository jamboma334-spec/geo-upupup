import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { OrganizationProvider } from "@/components/organization-provider";
import { ToastProvider } from "@/components/toast-provider";

export const metadata: Metadata = {
  title: "GEO 双中心",
  description: "GEO 双中心前端 Mock",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <ToastProvider>
          <OrganizationProvider>
            <AppShell>{children}</AppShell>
          </OrganizationProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
