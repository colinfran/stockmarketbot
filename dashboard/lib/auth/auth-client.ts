import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient()

const { useSession, } = createAuthClient()

const signOut = async (win) => {
  return await authClient.signOut({
    fetchOptions: {
      onSuccess: (window) => {
        win.location.href = "/"; // redirect to login page
      },
    },
  });
}

const signIn = async (email: string, password: string) => {
  return await authClient.signIn.email({ 
    email, 
    password, 
    callbackURL: "/dashboard", 
    rememberMe: true 
  })
}

export { useSession, signIn, signOut }