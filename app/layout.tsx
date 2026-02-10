import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import ErrorBoundary from "@/components/ErrorBoundary"
import { Providers } from "@/components/providers"
import { CONFIG } from "@/lib/config"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: CONFIG.APP_TITLE,
  description: CONFIG.APP_DESCRIPTION,
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
          :root {
            --primary: ${CONFIG.PRIMARY_COLOR};
            --accent: ${CONFIG.ACCENT_COLOR};
            --ring: ${CONFIG.PRIMARY_COLOR};
          }
          .dark {
            --primary: ${CONFIG.PRIMARY_COLOR};
            --accent: ${CONFIG.ACCENT_COLOR};
            --ring: ${CONFIG.PRIMARY_COLOR};
          }
        `}} />
      </head>
      <body className={`font-sans antialiased`}>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
