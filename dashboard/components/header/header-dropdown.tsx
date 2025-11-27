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
import Link from "next/link"
import { ChartSplineIcon, DollarSignIcon, HomeIcon } from "lucide-react"
import ThemeButton from "./theme-button"

const HeaderDropdown: FC = () => {
  const session = {
    user: {
      image: undefined,
    },
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
            <DropdownMenuItem
              className="flex w-full cursor-pointer flex-row items-center gap-2"
              asChild
            >
              <Link href="/portfolio">
                <DollarSignIcon size={16} />
                <span>Portfolio</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full cursor-pointer flex-row items-center gap-2"
              asChild
            >
              <Link href="/charts">
                <ChartSplineIcon size={16} />
                <span>Charts</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ThemeButton />
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              <LogOutButton />
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default HeaderDropdown
