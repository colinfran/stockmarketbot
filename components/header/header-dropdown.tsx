"use client"
import React, { FC, useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Bell, DollarSignIcon, HomeIcon, InfoIcon } from "lucide-react"
import ThemeButton from "./theme-button"
import MenuButton from "./menu-button"
import { usePush } from "@/hooks/usePush"
import IosDialog from "../ios-dialog"

const HeaderDropdown: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const { subscription, subscribeToPush, sendTestNotification } = usePush()

  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const standalone = window.matchMedia("(display-mode: standalone)").matches
    setIsIOS(iOS)
    setIsStandalone(standalone)
  }, [])

  return (
    <div className="flex w-full items-center justify-end gap-8">
      <div className="">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger className="flex" asChild>
            <MenuButton isOpen={isOpen} />
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
              <Link href="/portfolio" prefetch>
                <DollarSignIcon size={16} />
                <span>Portfolio</span>
              </Link>
            </DropdownMenuItem>
            {!subscription && (
              <DropdownMenuItem
                className="flex w-full cursor-pointer flex-row items-center gap-2"
                onClick={isIOS && !isStandalone ? () => setDialogOpen(true) : subscribeToPush}
              >
                <Bell size={16} /> Notifications
              </DropdownMenuItem>
            )}
            {subscription && (
              <DropdownMenuItem
                className="flex w-full cursor-pointer flex-row items-center gap-2"
                onClick={sendTestNotification}
              >
                <Bell size={16} /> Test Push
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <ThemeButton />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex w-full cursor-pointer flex-row items-center gap-2"
              asChild
            >
              <Link href="/about">
                <InfoIcon size={16} />
                <span>About</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <IosDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
    </div>
  )
}

export default HeaderDropdown
