"use client"
import { signIn } from "@/lib/auth/auth-client"
import { loginSchema, LoginSchema } from "@/lib/form-schemas/login-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const LoginForm: FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async ({ email, password }: LoginSchema): Promise<void> => {
    setError("")
    setIsLoading(true)
    try {
      await signIn(email, password)
    } catch (err: unknown) {
      setIsLoading(false)
      console.error("Authentication error:", err)
      setError(err instanceof Error ? err.message : "Authentication failed")
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="you@example.com" type="email" {...register("email")} />
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password-toggle">Password</Label>
        <div className="relative">
          <Input
            id="password-toggle"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          <Button
            className="absolute top-0 right-0 h-full px-3"
            size="icon"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
      </div>

      {/* Server error */}
      {error && <div className="text-red-600 bg-red-50 p-3 rounded-md text-sm">{error}</div>}

      {/* Submit */}
      <Button className="w-full" disabled={isLoading} type="submit">
        {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Sign in"}
      </Button>
    </form>
  )
}

export default LoginForm
