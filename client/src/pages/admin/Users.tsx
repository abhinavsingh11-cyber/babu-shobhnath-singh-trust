import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Users as UsersIcon, Shield, UserCog, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import type { User } from '@shared/schema';
import { format } from 'date-fns';

const roleColors: Record<string, 'default' | 'secondary' | 'destructive'> = {
  admin: 'destructive',
  content_manager: 'secondary',
  user: 'default',
};

const roleIcons: Record<string, any> = {
  admin: Shield,
  content_manager: UserCog,
  user: UserIcon,
};

export default function Users() {
  const { toast } = useToast();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user role');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'Role Updated',
        description: 'User role has been updated successfully.',
      });
      setEditingUserId(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <p className="text-2xl text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  const totalUsers = users?.length || 0;
  const adminCount = users?.filter((u) => u.role === 'admin').length || 0;
  const contentManagerCount = users?.filter((u) => u.role === 'content_manager').length || 0;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">User Management</h1>
        <p className="text-xl text-muted-foreground">
          Manage user roles and permissions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Users</CardTitle>
            <UsersIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-total-users">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Admins</CardTitle>
            <Shield className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-admins">{adminCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Content Managers</CardTitle>
            <UserCog className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="stat-content-managers">{contentManagerCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">All Users</CardTitle>
          <CardDescription className="text-base">
            View and manage user roles. Click on a role to edit it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-base">Name</TableHead>
                  <TableHead className="text-base">Email</TableHead>
                  <TableHead className="text-base">Role</TableHead>
                  <TableHead className="text-base">WhatsApp Opt-In</TableHead>
                  <TableHead className="text-base">Joined</TableHead>
                  <TableHead className="text-base">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => {
                  const RoleIcon = roleIcons[user.role] || UserIcon;
                  const isEditing = editingUserId === user.id;

                  return (
                    <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                      <TableCell className="text-base font-medium">
                        {user.firstName || user.lastName
                          ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                          : 'No Name'}
                      </TableCell>
                      <TableCell className="text-base">{user.email || 'No email'}</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Select
                            defaultValue={user.role}
                            onValueChange={(value) => handleRoleChange(user.id, value)}
                            data-testid={`select-role-${user.id}`}
                          >
                            <SelectTrigger className="w-40 text-base">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="content_manager">Content Manager</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge
                            variant={roleColors[user.role] || 'default'}
                            className="cursor-pointer text-base"
                            onClick={() => setEditingUserId(user.id)}
                            data-testid={`badge-role-${user.id}`}
                          >
                            <RoleIcon className="h-4 w-4 mr-1" />
                            {user.role.replace('_', ' ').toUpperCase()}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-base">
                        {user.whatsappOptIn ? (
                          <Badge variant="secondary">Yes</Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-base">
                        {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingUserId(null)}
                            data-testid={`button-cancel-edit-${user.id}`}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {!users || users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
