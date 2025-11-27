// __tests__/login-form.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import LoginForm from "@/components/form"
import { signIn } from "@/lib/auth/auth-client"

// Mock the signIn function
jest.mock("@/lib/auth/auth-client", () => ({
  signIn: jest.fn(),
}))

describe("LoginForm", () => {

  // Suppress console.error for expected errors during tests
  let consoleErrorSpy: jest.SpyInstance

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterAll(() => {
    consoleErrorSpy.mockRestore()
  })
  
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders email and password fields and submit button", () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
  })

  it("toggles password visibility when clicking the eye button", () => {
    render(<LoginForm />)

    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement
    const toggleButton = screen.getByRole("button", { name: "" }) // the icon button has no text

    // Initially password type
    expect(passwordInput.type).toBe("password")

    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe("text")

    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe("password")
  })

  it("shows validation errors when fields are empty", async () => {
    render(<LoginForm />)

    const submitButton = screen.getByRole("button", { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email/i)).toBeInTheDocument()
      expect(screen.getByText(/password/i)).toBeInTheDocument()
    })
  })

  it("calls signIn with correct values on submit", async () => {
    ;(signIn as jest.Mock).mockResolvedValueOnce(undefined)

    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } })

    const submitButton = screen.getByRole("button", { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("test@example.com", "password123")
    })
  })

  it("shows server error if signIn throws", async () => {
    ;(signIn as jest.Mock).mockRejectedValueOnce(new Error("Invalid credentials"))

    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } })

    const submitButton = screen.getByRole("button", { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })
})
