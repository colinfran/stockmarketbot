import { render } from '@testing-library/react'
import UnauthPage from '@/app/(unauthenticated)/page'
import AuthPage from '@/app/(authenticated)/dashboard/page'

jest.mock('@/lib/auth/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn().mockResolvedValue(
        { user: { name: 'Colin Franceschini' } }
      ),
    },
  },
}))

jest.mock('next/headers', () => ({
  headers: jest.fn().mockReturnValue(new Headers()),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

it('shows hello <user name>!', async () => {
  const jsx = await AuthPage()
  const { container } = render(jsx)
  expect(container).toHaveTextContent("Hello Colin Franceschini!")
})