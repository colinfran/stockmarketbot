import { render, screen } from "@testing-library/react"
import { Logo } from "@/components/logo"
import { useSession } from "@/lib/auth/auth-client"
import React from "react"

// Mock Icon since it has its own tests
jest.mock("@/components/icon", () => ({
  __esModule: true,
  default: () => <span data-testid="icon" />,
}))

// Mock Link from next/link
jest.mock("next/link", () => {
  return ({ href, children }: any) => <a href={href}>{children}</a>
})

// Mock useSession
jest.mock("@/lib/auth/auth-client", () => ({
  useSession: jest.fn(),
}))

describe("Logo component", () => {
  it("links to dashboard when session exists", () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: { user: { name: "Colin" } },
    })

    render(<Logo />)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/dashboard")
  })

  it("links to home when session does not exist", () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
    })
    render(<Logo />)
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/")
  })

  it("has brand icon", () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
    })
    render(<Logo />)
    expect(screen.getByTestId("icon")).toBeInTheDocument()
  })
})
