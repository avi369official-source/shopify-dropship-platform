import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Avidnt Dropship OS — Shopify + IndiaMART + Meta",
  description: "AI-Powered Shopify Dropshipping Operating System for IndiaMART sourcing and Meta marketing workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-slate-950/40 p-6 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
