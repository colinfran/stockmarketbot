"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FC, ReactNode } from "react"

type Layout = {
  children: ReactNode
}

const Layout: FC<Layout> = ({ children }) => {
  const pathname = usePathname()
  const activeTab = pathname.endsWith("/chart") ? "chart" : "overview"
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-balance">Portfolio</h1>
            <p className="text-muted-foreground mt-1">Current stock holdings and performance</p>
          </div>
        </div>

        <Tabs className="w-full pb-4" value={activeTab!}>
          <TabsList>
            <TabsTrigger value="overview" asChild>
              <Link href="/portfolio">Overview</Link>
            </TabsTrigger>

            <TabsTrigger value="chart" asChild>
              <Link href="/portfolio/chart">Chart</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {children}
      </div>
    </div>
  )
}

export default Layout
