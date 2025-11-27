import { FC, ReactNode } from "react"

type Layout = {
  children: ReactNode
}

const Layout: FC<Layout> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Portfolio</h1>
            <p className="text-muted-foreground">Current stock holdings and performance</p>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}

export default Layout
