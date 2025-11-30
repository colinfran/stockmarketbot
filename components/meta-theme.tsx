"use client"

import { useTheme } from "next-themes"
import { FC, useEffect } from "react"

const ThemeColorMeta: FC = () => {
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    const currentTheme = resolvedTheme || theme
    const themeColor = currentTheme === "dark" ? "#0a0a0a" : "#ffffff"

    // Update or create theme-color meta tag
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

export default ThemeColorMeta
