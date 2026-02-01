import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome, {user?.username}!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">You have successfully logged in.</p>
          <div className="rounded-md bg-slate-100 p-4">
            <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
          </div>
          <Button onClick={logout} variant="destructive" className="w-full">
            Logout
          </Button>
          {user?.roles?.includes("ROLE_ADMIN") && (
            <div className="space-y-2 w-full">
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/admin/users'}>
                  Manage Users (Admin)
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/admin/roles'}>
                  Manage Roles (Admin)
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/admin/audit'}>
                  View Audit Logs (Admin)
                </Button>
            </div>
          )}
          <div className="w-full mt-4 border-t pt-4">
               <Button variant="secondary" className="w-full" onClick={() => window.location.href = '/profile'}>
                  My Profile
               </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
