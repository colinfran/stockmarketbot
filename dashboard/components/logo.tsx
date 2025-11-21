import React, { FC } from "react"
import Link from "next/link"
import Icon from "./icon"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export const Logo: FC = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <Link href={session ? "/dashboard" : "/"}>
      <Icon />
    </Link>
  )
}