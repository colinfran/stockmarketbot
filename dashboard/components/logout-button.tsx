"use client"

import React, { FC, useState } from "react"
import { signOut } from "@/lib/auth-client"
import { Loader2, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

const LogOutButton: FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const onClick = async (): Promise<void> => {
    setLoading(true)
    await signOut()
    router.push("/")
  }
  return (
    <button className="flex w-full flex-row items-center gap-2" type="submit" onClick={onClick}>
      {loading ? <Loader2 className="animate-spin" size={16} /> : <LogOut size={16} />}
      <span>Sign Out</span>
    </button>
  )
}

export default LogOutButton;
