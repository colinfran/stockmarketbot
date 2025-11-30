import { FC, ReactNode } from "react"
import { Analytics } from "@vercel/analytics/next"
import { Geist, Geist_Mono } from "next/font/google"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import Header from "@/components/header/header"
import { DataProvider } from "@/providers/data-provider"
import PwaBackground from "@/components/pwa-background"

type Layout = {
  children: ReactNode
}

const RootLayout: FC<Layout> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/android-icon-192x192.png" rel="icon" sizes="192x192" type="image/png" />
        <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon-96x96.png" rel="icon" sizes="96x96" type="image/png" />
        <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <title>StockMarketBot | Live AI Trading Experiment (Paper Trading)</title>
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="default" name="apple-mobile-web-app-status-bar-style" />
        <meta content="StockMarketBot" name="apple-mobile-web-app-title" />
        {/* <!-- SEO Meta Tags --> */}
        <meta
          content="StockMarketBot is a live proof-of-concept that tests whether AI models can generate profitable stock trading decisions. Watch a fully automated AI trader run in real market conditions using only paper money."
          name="description"
        />
        <meta
          content="StockMarketBot, AI stock trading, AI trading bot, paper trading bot, AI stock picker, algorithmic trading PoC, AI vs stock market, live AI trader, stockmarketbot"
          name="keywords"
        />
        <meta content="StockMarketBot" name="author" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />

        {/* <!-- Open Graph Meta Tags --> */}
        <meta content="website" property="og:type" />
        <meta
          content="StockMarketBot - Can AI Actually Trade Stocks Profitably?"
          property="og:title"
        />
        <meta
          content="A real-time proof-of-concept: an AI-powered bot making fully automated stock trades with paper money. See live performance, returns, trades, and positions as the experiment unfolds."
          property="og:description"
        />
        <meta content="https://stockmarketbot.app" property="og:url" />
        <meta content="/ogimage-stockmarketbot.jpg" property="og:image" />
        <meta content="/icon.png" property="og:logo" />

        {/* <!-- Twitter Card Meta Tags --> */}
        <meta content="summary_large_image" name="twitter:card" />
        <meta
          content="StockMarketBot - Can AI Actually Trade Stocks Profitably?"
          name="twitter:title"
        />
        <meta
          content="Live AI trading bot running 100% on paper money. Watch it make decisions, track performance, and find out if AI can beat the market."
          name="twitter:description"
        />
        <meta content="/ogimage-stockmarketbot.jpg" name="twitter:image" />
        <meta content="Live view of an AI stock trading experiment" property="twitter:image:alt" />

        <link href="/manifest.json" rel="manifest" />
      </head>
      <body className="flex min-h-screen w-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <DataProvider>
            <div className="flex flex-col sm:gap-4 sm:px-7 sm:py-4">
              <Header />
              <main className="flex-1 items-start gap-2 md:gap-4">{children}</main>
            </div>
          </DataProvider>
          <PwaBackground />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

export default RootLayout
