import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HotelPilot AI",
  description: "AI operations copilot for Australian hotels (portfolio demonstration)",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geist.className} antialiased`}
      >
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="bg-amber-100 px-6 py-2 text-center text-xs font-medium text-amber-900">
              Portfolio Demonstration — Synthetic Data. Not connected to a real hotel.
            </div>

            <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
              <p className="text-sm font-semibold text-slate-900">
                Demo Hotel — Perth, Western Australia
              </p>
              <p className="text-sm text-slate-500">Manager view</p>
            </header>

            <main className="flex-1 p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
