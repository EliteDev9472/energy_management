
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TasksList } from '@/components/tasks/TasksList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Plus, Search, Filter, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getTasksCountByStatus } from '@/services/taskService';
import { Progress } from '@/components/ui/progress';

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    completed: 0
  });

  // Fetch stats when component mounts or refresh key changes
  useEffect(() => {
    const stats = getTasksCountByStatus();
    // Make sure we maintain the expected structure
    setTaskStats({
      total: stats.total || 0,
      open: stats.open || 0,
      in_progress: stats.in_progress || 0,
      completed: stats.completed || 0
    });
  }, [refreshKey]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddTask = () => {
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
  };

  const handleFormSubmit = () => {
    toast({
      title: "Taak toegevoegd",
      description: "De nieuwe taak is succesvol toegevoegd.",
    });
    setShowAddForm(false);
    refreshList();
  };

  const refreshList = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Calculate completion percentage
  const completionPercentage = taskStats.total > 0
    ? Math.round((taskStats.completed / taskStats.total) * 100)
    : 0;

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Taken</h1>
        <p className="text-muted-foreground">Beheer en volg uw projecttaken</p>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Totale voortgang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Voltooiing</span>
                <span className="text-sm font-medium">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle className="mr-1 h-3.5 w-3.5" />
                <span>{taskStats.completed} van {taskStats.total} taken voltooid</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In uitvoering</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-amber-500" />
            <div>
              <div className="text-2xl font-bold">{taskStats.in_progress}</div>
              <div className="text-xs text-muted-foreground">taken worden uitgevoerd</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open taken</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">{taskStats.open}</div>
              <div className="text-xs text-muted-foreground">taken moeten worden gestart</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <TabsList>
            <TabsTrigger value="all">Alle taken</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in_progress">In uitvoering</TabsTrigger>
            <TabsTrigger value="completed">Afgerond</TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Zoek taken..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <Button onClick={handleAddTask}>
              <Plus className="mr-2 h-4 w-4" />
              Nieuwe taak
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Alle taken</CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </CardHeader>
            <CardContent>
              <TasksList 
                status="all" 
                searchQuery={searchQuery} 
                refreshList={refreshList}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="open" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Open taken</CardTitle>
            </CardHeader>
            <CardContent>
              <TasksList 
                status="open" 
                searchQuery={searchQuery} 
                refreshList={refreshList}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in_progress" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Taken in uitvoering</CardTitle>
            </CardHeader>
            <CardContent>
              <TasksList 
                status="in_progress" 
                searchQuery={searchQuery} 
                refreshList={refreshList}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Afgeronde taken</CardTitle>
            </CardHeader>
            <CardContent>
              <TasksList 
                status="completed" 
                searchQuery={searchQuery} 
                refreshList={refreshList}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showAddForm && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Nieuwe taak toevoegen</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm 
              onSubmit={handleFormSubmit} 
              onCancel={handleFormClose} 
            />
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}
