import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import api from "@/lib/api"
import { format } from "date-fns"

interface AuditLog {
  id: number
  timestamp: string
  action: string
  username: string
  target: string
  details: string
  status: string
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await api.get("/audit")
      setLogs(response.data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch audit logs")
    }
  }

  const getStatusColor = (status: string) => {
      return status === "SUCCESS" ? "default" : "destructive"
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                  </TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.username}</TableCell>
                  <TableCell>{log.target}</TableCell>
                  <TableCell>
                      <Badge variant={getStatusColor(log.status)}>{log.status}</Badge>
                  </TableCell>
                  <TableCell className="max-w-md truncate" title={log.details}>
                      {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
