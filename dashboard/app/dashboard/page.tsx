import { auth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"
import LogoutButton from "@/components/logout-button"
import { headers } from "next/headers"

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })


  if (!session) {
    return redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Hello {session?.user?.name}!</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          Lorem Ipsum
        </CardContent>
      </Card>
    </div>
  )
}

export default Page;

