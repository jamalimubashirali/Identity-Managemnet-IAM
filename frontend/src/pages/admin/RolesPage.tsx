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
import { type Role } from "@/types"
import { Plus } from "lucide-react"

import RoleEditDialog from "./RoleEditDialog"

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const response = await api.get("/roles")
      setRoles(response.data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch roles")
    }
  }

  const handleCreate = () => {
      setSelectedRole(null)
      setIsDialogOpen(true)
  }

  const handleEdit = (role: Role) => {
      setSelectedRole(role)
      setIsDialogOpen(true)
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Role Management</CardTitle>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Create Role
                </Button>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Role Name</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {role.permissions && role.permissions.map((perm) => (
                            <Badge key={perm.id} variant="secondary" className="text-xs">
                                {perm.name}
                            </Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(role)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RoleEditDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        role={selectedRole} 
        onRoleUpdated={fetchRoles} 
      />
    </div>
  )
}
