
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus, UserCog } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserProfile, USER_ROLE_LABELS } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function UserManagement() {
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
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center">
            <UserCog className="mr-2 h-6 w-6" />
            Gebruikersbeheer
          </h2>
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
      <CardContent className="p-4">
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
                        <span className="sr-only">Bewerk gebruiker</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
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
