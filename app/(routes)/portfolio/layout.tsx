import { FC, ReactNode } from "react"

type Layout = {
  children: ReactNode
}

const Layout: FC<Layout> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-balance">Portfolio</h1>
            <p className="text-muted-foreground mt-1">Current stock holdings and performance</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Layout
