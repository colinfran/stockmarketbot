import { FC, ReactNode } from "react"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "../ui/dialog"

type PopupType = {
  open: boolean
  setOpen: (open: boolean) => void
  children: ReactNode
}

const Popup: FC<PopupType> = ({ open, setOpen, children }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay className="backdrop-blur-sm" />
        <DialogContent className="flex flex-col sm:max-w-[70dvw] sm:max-h-[90dvh] [&>div>div>div>div]:!flex [&>div>div>div>div]:!flex-col">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div>{children}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-8">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}

export default Popup
