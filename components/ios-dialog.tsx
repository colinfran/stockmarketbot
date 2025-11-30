import { FC } from "react"
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "./ui/dialog"

type IosDialogType = {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
}

const IosDialog: FC<IosDialogType> = ({ dialogOpen, setDialogOpen }) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogOverlay className="backdrop-blur-sm" />
      <DialogContent className="flex flex-col sm:max-w-[70dvw] md:max-w-[80dvw] sm:max-h-[90dvh] [&>div>div>div>div]:!flex [&>div>div>div>div]:!flex-col">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        <div className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <p className="text-white font-semibold text-base">Install App Required</p>
            </div>
            <p className="text-white/95 text-sm leading-relaxed mb-4">
              Push notifications require installing this app to your Home Screen. Safari doesn't
              support notifications in the browser.
            </p>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-3.5 border border-white/20">
              <p className="text-white/90 text-xs font-medium mb-2.5">How to Install:</p>
              <ol className="space-y-2 text-white/85 text-xs">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-semibold mt-0.5">
                    1
                  </span>
                  <span className="leading-relaxed">
                    Tap the <span className="font-semibold">Share</span> button at the bottom
                  </span>
                </li>
                {/*  eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Share button screenshot ios" src="/share.png" />
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-semibold mt-0.5">
                    2
                  </span>
                  <span className="leading-relaxed">
                    Select <span className="font-semibold">"Add to Home Screen"</span>
                  </span>
                </li>
                {/*  eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Add to homescreen screenshot ios" src="/addhomescreen.png" />
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-semibold mt-0.5">
                    3
                  </span>
                  <span className="leading-relaxed">Open the app from your Home Screen</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default IosDialog
