import { FC, ReactNode } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "../ui/dialog"
import { PortfolioPosition } from "@/lib/utils"

type PopupType = {
  open: boolean
  setOpen: (open: boolean) => void
  children: ReactNode
  position: PortfolioPosition
}

const Popup: FC<PopupType> = ({ open, setOpen, children, position }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay className="backdrop-blur-sm" />
        <DialogContent className="flex flex-col sm:max-w-[70dvw] md:max-w-[80dvw] sm:max-h-[90dvh] [&>div>div>div>div]:!flex [&>div>div>div>div]:!flex-col">
          <DialogHeader>
            <DialogTitle>{position?.symbol}</DialogTitle>
          </DialogHeader>
          <div>{children}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="flex flex-col [&>div>div>div>div]:!flex [&>div>div>div>div]:!flex-col">
        <DrawerHeader className="text-left">
          <DrawerTitle>{position?.symbol}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}

export default Popup
