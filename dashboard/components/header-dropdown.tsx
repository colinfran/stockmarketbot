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
// import LogOutButton from "@/components/log-out-button"
import Link from "next/link"
import { ImageIcon, ShoppingCartIcon, HomeIcon } from "lucide-react"
import ThemeButton from "./theme-button"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"


const HeaderDropdown: FC = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  return (
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
          <DropdownMenuItem>
            {/* <LogOutButton /> */}
            <button>logout fix</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default HeaderDropdown