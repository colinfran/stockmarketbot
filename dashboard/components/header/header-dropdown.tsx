"use client"
import React, { FC } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LogOutButton from "@/components/header/logout-button"
import Link from "next/link"
import { HomeIcon } from "lucide-react"
import ThemeButton from "./theme-button"
import { useSession } from "@/lib/auth/auth-client"
import { Skeleton } from "../ui/skeleton"
import { usePathname } from "next/navigation"

const HeaderDropdown: FC = () => {
  const { data: session, isPending } = useSession()
  const pathname = usePathname()
  // Don't show dropdown if not logged in
  if (pathname == "/") return null
  // Show skeleton while session is loading
  if (isPending) {
    return (
      <div className="flex w-full items-center justify-end gap-8">
        <div className="">
          <Skeleton className="h-[36px] w-[36px] rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full items-center justify-end gap-8">
      <div className="">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="overflow-hidden rounded-full" size="icon" variant="outline">
              <Image
                alt="Avatar"
                className="overflow-hidden rounded-full"
                height={36}
                src={session?.user.image ?? "/placeholder-user.jpg"}
                width={36}
                priority
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="flex w-full cursor-pointer flex-row items-center gap-2"
              asChild
            >
              <Link href="/">
                <HomeIcon size={16} />
                <span>Home</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ThemeButton />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              <LogOutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default HeaderDropdown
