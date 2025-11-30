import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FC } from "react"

const NotFound: FC = () => {
  return (
    <div className="flex min-h-screen mt-[-80px] items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-2xl font-semibold text-foreground">Page Not Found</p>
        <p className="mt-2 text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
