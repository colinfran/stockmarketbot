import React, { FC } from "react"
import { Logo } from "@/components/logo"
import HeaderDropdown from "./header-dropdown"
import { auth } from "@/lib/auth/auth"

import { headers } from "next/headers"

const Header: FC = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  return (
    <header className="sticky top-0 z-30 flex h-[50px] items-center gap-4 border-b bg-background px-4 sm:static sm:border-0 sm:bg-transparent sm:px-6">
      <Logo />
      <HeaderDropdown />
    </header>
  )
}

export default Header