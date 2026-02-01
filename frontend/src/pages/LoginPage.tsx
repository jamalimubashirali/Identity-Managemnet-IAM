import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  password: z.string().min(4, { message: "Password must be at least 4 characters." }),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const response = await api.post("/auth/signin", values)
      login(response.data)
      toast.success("Login successful")
      navigate("/")
    } catch (error: any) {
      console.error(error)
      const message = error.response?.data?.message || "Login failed"
      toast.error(message)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
            <p className="text-sm text-gray-500">
                Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Sign up</a>
            </p>
        </CardFooter>
      </Card>
    </div>
  )
}
