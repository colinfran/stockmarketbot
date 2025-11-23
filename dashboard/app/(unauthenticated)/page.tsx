import { FC } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"
import LoginForm from "../../components/form"
import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"

const Page: FC = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) {
    return redirect("/dashboard")
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
