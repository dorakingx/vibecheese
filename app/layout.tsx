import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BottomNav } from "@/components/BottomNav"
import { NetworkStatus } from "@/components/NetworkStatus"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VibeCheese 🧀 - Social Vibe Forecasting",
  description: "Predict future trends and earn Vibe Points",
  manifest: "/manifest.json",
  themeColor: "#FFD700",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <main className="min-h-screen pb-32">
          {children}
        </main>
        <BottomNav />
        <NetworkStatus />
      </body>
    </html>
  )
}

