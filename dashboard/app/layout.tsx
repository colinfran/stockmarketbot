import { FC, ReactNode } from "react"
import { Analytics } from "@vercel/analytics/next"
import NextTopLoader from "nextjs-toploader"
import { Geist, Geist_Mono } from "next/font/google"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import Header from "@/components/header/header"

const RootLayout: FC<{
  children: ReactNode
}> = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="/apple-icon-180x180.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/android-icon-192x192.png" rel="icon" sizes="192x192" type="image/png" />
        <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon-96x96.png" rel="icon" sizes="96x96" type="image/png" />
        <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <title>trading bot dashboard</title>
      </head>
      <body className="flex min-h-screen w-full flex-col">
        <NextTopLoader color={"#808080"} showSpinner={false} zIndex={100} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <div className="flex flex-col sm:gap-4 sm:px-7 sm:py-4">
            <Header />
            <main className="grid flex-1 items-start gap-2 md:gap-4">{children}</main>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

export default RootLayout
