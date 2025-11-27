import React from 'react'
import { render, screen } from '@testing-library/react'
import Icon from '../../components/icon'
import '@testing-library/jest-dom'


// Create a mock function that we can modify
const mockUseTheme = jest.fn()

jest.mock('next-themes', () => ({
  useTheme: () => mockUseTheme(),
}))

describe('Icon component', () => {
   beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders normally when theme is light', () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'light' })
    render(<Icon size={40} />)
    const img = screen.getByAltText('logo') as HTMLImageElement
    expect(img).toBeInTheDocument()
    expect(img.getAttribute('src')).toContain('logo.png')
    expect(img).toHaveAttribute('width', '40')
    expect(img.className).not.toContain('invert') // Assuming invert only when dark
  })
  it('renders image with alt and applies invert when theme is dark', () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'dark' })
    render(<Icon size={40} />)
    const img = screen.getByAltText('logo') as HTMLImageElement
    expect(img).toBeInTheDocument()
    expect(img.getAttribute('src')).toContain('logo.png')
    expect(img).toHaveAttribute('width', '40')
    expect(img.className).toContain('invert')

  })
})
