import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BottomNav } from "@/components/BottomNav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VibeCheese - Social Vibe Forecasting",
  description: "Predict future trends and earn Vibe Points",
  manifest: "/manifest.json",
  themeColor: "#00D9FF",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <main className="min-h-screen pb-20">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}

