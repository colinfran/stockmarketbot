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
import { usePushNotifications } from "@/hooks/usePush"
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "../ui/dialog"

const HeaderDropdown: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const {
    isSupported,
    subscription,
    // isRegistering,
    subscribeToPush,
    // unsubscribeFromPush,
    sendTestNotification,
  } = usePushNotifications()

  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)
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
              <Link href="/portfolio">
                <DollarSignIcon size={16} />
                <span>Portfolio</span>
              </Link>
            </DropdownMenuItem>
            {isSupported && !subscription && (
              <DropdownMenuItem
                className="flex w-full cursor-pointer flex-row items-center gap-2"
                onClick={isIOS ? () => setDialogOpen(true): subscribeToPush }
              >
                <Bell size={16} /> Notifications
              </DropdownMenuItem>
            )}
            {isSupported && subscription && (
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogOverlay className="backdrop-blur-sm" />
        <DialogContent className="flex flex-col sm:max-w-[70dvw] md:max-w-[80dvw] sm:max-h-[90dvh] [&>div>div>div>div]:!flex [&>div>div>div>div]:!flex-col">
          <DialogHeader>
            <DialogTitle>{"Notifications"}</DialogTitle>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
              📱 iOS Installation Required
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
              To get Push notifications to work on iOS, you have to follow a few steps.
            </p>
            <div className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
              <p className="font-medium">Steps:</p>
              <ol className="list-decimal list-inside space-y-1 ml-1">
                <li>Tap the Share button (box with arrow) at the bottom of Safari</li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" in the top right</li>
                <li>Open the app from your home screen</li>
                <li>Then enable notifications</li>
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default HeaderDropdown
