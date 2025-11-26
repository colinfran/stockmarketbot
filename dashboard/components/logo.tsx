"use client"
import React, { FC } from "react"
import Link from "next/link"
import Icon from "./icon"

export const Logo: FC = () => {
  return (
    <Link href="/">
      <Icon />
    </Link>
  )
}
