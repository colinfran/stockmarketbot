import { render } from '@testing-library/react'
import UnauthPage from '@/app/(unauthenticated)/page'
import AuthPage from '@/app/(authenticated)/dashboard/page'
import Header from '@/components/header/header'

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
  usePathname: jest.fn().mockReturnValue('/dashboard'),
}))

jest.mock('@/components/logo', () => ({
  Logo: () => <img alt="logo" src="/logo.png" />,
}))



it('renders homepage unchanged', async () => {
  const jsx = await UnauthPage({}) // don't use render here
  const { container: PageContainer } = render(jsx)
  const { container: HeaderContainer } = render(<Header />)
  expect(PageContainer).toMatchSnapshot()
  expect(HeaderContainer).toMatchSnapshot()
})

it('renders dashboard unchanged', async () => {
  ;(require('@/lib/auth/auth').auth.api.getSession as jest.Mock).mockResolvedValue({
    user: { name: 'Colin' },
  })
  const jsx = await AuthPage({})
  const { container: PageContainer } = render(jsx)
  const { container: HeaderContainer } = render(<Header />)
  expect(PageContainer).toMatchSnapshot()
  expect(HeaderContainer).toMatchSnapshot()
})