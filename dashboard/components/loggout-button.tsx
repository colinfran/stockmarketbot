"use client"
import { signOut } from "@/lib/auth-client"
import { Button } from "./ui/button"
import { useRouter } from 'next/navigation'

export const LogoutButton = () => {
  const router = useRouter()
  
  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); // redirect to login page
        },
      },
    })
  }

  return (
    <Button onClick={handleLogout} variant="outline">
      Logout
    </Button>
  )
}