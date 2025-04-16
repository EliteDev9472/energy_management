
import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { UserCog, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { UserProfile, USER_ROLE_LABELS } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data as UserProfile[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Fout bij ophalen gebruikers',
        description: 'Er is een fout opgetreden bij het ophalen van de gebruikers.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    navigate('/admin/users/new');
  };

  const handleEditUser = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  const filterUsersByRole = (role: string) => {
    return users.filter(user => user.role === role);
  };

  return (
    <PageLayout>
      <RoleGuard allowedRoles={['admin']}>
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white mb-2 flex items-center">
                <UserCog className="mr-2 h-8 w-8" />
                Gebruikersbeheer
              </h1>
              <p className="text-muted-foreground">
                Beheer alle gebruikers en hun rollen in het systeem.
              </p>
            </div>
            <Button className="bg-cedrus-accent hover:bg-cedrus-accent/90" onClick={handleCreateUser}>
              <Plus className="mr-2 h-4 w-4" /> Nieuwe Gebruiker
            </Button>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Alle Gebruikers</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
              <TabsTrigger value="consultant">Consultants</TabsTrigger>
              <TabsTrigger value="client_owner">Klant Eigenaren</TabsTrigger>
              <TabsTrigger value="project_manager">Project Managers</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <UserTable users={users} loading={loading} onEditUser={handleEditUser} />
            </TabsContent>
            
            <TabsContent value="admin">
              <UserTable users={filterUsersByRole('admin')} loading={loading} onEditUser={handleEditUser} />
            </TabsContent>
            
            <TabsContent value="consultant">
              <UserTable users={filterUsersByRole('consultant')} loading={loading} onEditUser={handleEditUser} />
            </TabsContent>
            
            <TabsContent value="client_owner">
              <UserTable users={filterUsersByRole('client_owner')} loading={loading} onEditUser={handleEditUser} />
            </TabsContent>
            
            <TabsContent value="project_manager">
              <UserTable users={filterUsersByRole('project_manager')} loading={loading} onEditUser={handleEditUser} />
            </TabsContent>
          </Tabs>
        </div>
      </RoleGuard>
    </PageLayout>
  );
}

interface UserTableProps {
  users: UserProfile[];
  loading: boolean;
  onEditUser: (userId: string) => void;
}

function UserTable({ users, loading, onEditUser }: UserTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gebruikerslijst</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <p>Gebruikers laden...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Naam</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Organisatie</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Geen gebruikers gevonden.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name || '-'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {USER_ROLE_LABELS[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.organizationName || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onEditUser(user.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
