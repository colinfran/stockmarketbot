import { render } from '@testing-library/react'
import UnauthPage from '@/app/(unauthenticated)/page'
import AuthPage from '@/app/(authenticated)/dashboard/page'

jest.mock('@/lib/auth/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn().mockResolvedValue(null),
    },
  },
}))

jest.mock('next/headers', () => ({
  headers: jest.fn().mockReturnValue(new Headers()),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

it('renders homepage unchanged', async () => {
  const jsx = await UnauthPage() // don't use render here
  const { container } = render(jsx)
  expect(container).toHaveTextContent("Enter your credentials to access your account")
})