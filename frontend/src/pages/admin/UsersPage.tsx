import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import api from "@/lib/api"
import { type User } from "@/types"
import { Trash2, Edit } from "lucide-react"
import UserEditDialog from "./UserEditDialog"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users")
      setUsers(response.data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch users")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    try {
      await api.delete(`/users/${id}`)
      toast.success("User deleted")
      fetchUsers()
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete user")
    }
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>User Management</CardTitle>
                <Button onClick={fetchUsers}>Refresh</Button>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.roles.map((role) => (
                        <Badge key={role.id} variant="outline" className="mr-1">
                            {role.name}
                        </Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.enabled ? "default" : "destructive"}>
                        {user.enabled ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedUser(user); setIsEditDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <UserEditDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        user={selectedUser} 
        onUserUpdated={fetchUsers}
      />
    </div>
  )
}
