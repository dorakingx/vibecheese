import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BottomNav } from "@/components/BottomNav"
import { NetworkStatus } from "@/components/NetworkStatus"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VibeCheese | Gamified Social Prediction on Soneium",
  description: "Predict trends, earn VP, and climb the ranks in the Soneium ecosystem.",
  manifest: "/manifest.json",
  themeColor: "#FFD700",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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

