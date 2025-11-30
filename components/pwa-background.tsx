"use client"

import { useTheme } from "next-themes"
import { FC, useEffect } from "react"

// this is needed to change the backround color of the pwa app
const PwaBackground: FC = () => {
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    const currentTheme = resolvedTheme || theme
    const themeColor = currentTheme === "dark" ? "#0a0a0a" : "#ffffff"
    // prettier-ignore
    let metaThemeColor = document.querySelector("meta[name=\"theme-color\"]")
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta")
      metaThemeColor.setAttribute("name", "theme-color")
      document.head.appendChild(metaThemeColor)
    }
    metaThemeColor.setAttribute("content", themeColor)
  }, [theme, resolvedTheme])

  return null
}

export default PwaBackground
