import React from 'react'
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react'
import Header from '@/components/header/header'
import HeaderDropdown from '@/components/header/header-dropdown'
import ThemeButton from '@/components/header/theme-button'
import LogOutButton from '@/components/header/logout-button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import userEvent from '@testing-library/user-event'

jest.mock('@/components/logo', () => ({
  Logo: () => <img alt="logo" src="/logo.png" />,
}))

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

jest.mock('@/lib/auth/auth-client', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}))

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

describe('Header components', () => {
  const usePathname = require('next/navigation').usePathname as jest.Mock
  const useSession = require('@/lib/auth/auth-client').useSession as jest.Mock
  const signOut = require('@/lib/auth/auth-client').signOut as jest.Mock
  const useTheme = require('next-themes').useTheme as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    usePathname.mockReturnValue('/dashboard')
  })

  it('renders Header with Logo and dropdown present when not on root', () => {
    useSession.mockReturnValue({ data: null, isPending: false })
    const { container } = render(<Header />)
    expect(screen.getByAltText('logo')).toBeInTheDocument()
    // Avatar should be present (placeholder)
    expect(container.querySelector('img[alt="Avatar"]')).toBeTruthy()
  })

  it('does not render dropdown on root pathname', () => {
    usePathname.mockReturnValue('/')
    useSession.mockReturnValue({ data: null, isPending: false })
    const { container } = render(<HeaderDropdown />)
    expect(container.firstChild).toBeNull()
  })

  it('shows skeleton while session is pending', () => {
    usePathname.mockReturnValue('/dashboard')
    useSession.mockReturnValue({ data: null, isPending: true })
    const { container } = render(<HeaderDropdown />)
    expect(container.querySelector('[data-slot="skeleton"]')).toBeTruthy()
  })

  it('renders avatar with user image when available', () => {
    usePathname.mockReturnValue('/dashboard')
    useSession.mockReturnValue({ data: { user: { image: '/my-image.jpg' } }, isPending: false })
    const { container } = render(<HeaderDropdown />)
    const avatar = container.querySelector('img[alt="Avatar"]') as HTMLImageElement
    expect(avatar).toBeTruthy()
    expect(avatar.getAttribute('src')).toEqual(expect.stringContaining('my-image.jpg'))
  })

  it('falls back to placeholder avatar when user has no image', () => {
    usePathname.mockReturnValue('/dashboard')
    useSession.mockReturnValue({ data: { user: {} }, isPending: false })
    const { container } = render(<HeaderDropdown />)
    const avatar = container.querySelector('img[alt="Avatar"]') as HTMLImageElement
    expect(avatar).toBeTruthy()
    expect(avatar.getAttribute('src')).toEqual(expect.stringContaining('placeholder-user.jpg'))
  })

  it('ThemeButton toggles theme via setTheme', async () => {
    const setTheme = jest.fn()
    ;(useTheme as jest.Mock).mockReturnValue({ resolvedTheme: 'dark', setTheme })

    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>Toggle Menu</button>
        </DropdownMenuTrigger>

        {/* The content is what Radix will portal to document.body */}
        <DropdownMenuContent data-testid="dropdown-content">
          <ThemeButton />
        </DropdownMenuContent>
      </DropdownMenu>
    )

    // Open the dropdown
    await userEvent.click(screen.getByText('Toggle Menu'))

    // Wait for the portal-mounted menu content to exist
    const menu = await screen.findByTestId('dropdown-content')

    // Find actionable menu items within the menu
    // There may be different structures; try to find by accessible role first
    let menuItems = within(menu).queryAllByRole('menuitem')

    // If nothing with role=menuitem, fall back to any clickable elements inside the content
    if (menuItems.length === 0) {
      menuItems = within(menu).queryAllByRole('button')
    }

    // Try to find the item that mentions theme/light/dark (case-insensitive)
    let targetItem = menuItems.find((el) =>
      /theme|light|dark|system/i.test(el.textContent ?? '')
    )

    // If none match, fall back to the first menu item
    if (!targetItem) {
      if (menuItems.length === 0) {
        throw new Error('No menu items found inside dropdown content')
      }
      targetItem = menuItems[0]
    }

    // Click the target item
    await userEvent.click(targetItem)

    // Assert theme was toggled from 'dark' -> 'light'
    await waitFor(() => {
      expect(setTheme).toHaveBeenCalledWith('light')
    })
  })

  it('LogOutButton calls signOut and shows loader while signing out', async () => {
    signOut.mockResolvedValue(undefined)
    render(<LogOutButton />)
    const button = screen.getByRole('button', { name: /Sign Out/i })
    fireEvent.click(button)
    await waitFor(() => expect(signOut).toHaveBeenCalled())
    // loader element uses class "animate-spin"
    expect(button.querySelector('.animate-spin')).toBeTruthy()
  })
})