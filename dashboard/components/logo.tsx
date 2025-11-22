"use client"
import React, { FC } from "react"
import Link from "next/link"
import Icon from "./icon"
import { useSession } from "@/lib/auth/auth-client"

export const Logo: FC = () => {
  const { data: session } = useSession()
  return (
    <Link href={session ? "/dashboard" : "/"}>
      <Icon />
    </Link>
  )
}
