"use client"

import React, { FC } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ThemeProvider: FC<any> = ({ children, ...props }) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}