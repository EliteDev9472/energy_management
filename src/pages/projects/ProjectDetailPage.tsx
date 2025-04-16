
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Users,
  BarChart,
  FileText,
  PlusCircle,
  Clock,
  Download,
  Edit,
  Trash,
  Send,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Home,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { format, isValid, parseISO } from 'date-fns';
import { getProjectById, getConnectionRequestsForProject, formatConnectionRequestStatus, formatBuildingPhase, getProjectManagerName, formatStatus } from '@/data/mockProjects';
import { Project, ConnectionRequest, BuildingPhase, ProjectStatus, ProjectTask } from '@/types/project';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { handleDragStart, handleDragOver, handleDrop, isValidStatusTransition, formatStatusChange } from '@/utils/dragAndDrop';
import { ConnectionRequestPipeline } from '@/components/projects/connection-pipeline/ConnectionRequestPipeline';
import { EnergyContractPipeline } from '@/components/projects/energy-contract/EnergyContractPipeline';

export default function ProjectDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [newTask, setNewTask] = useState<Partial<ProjectTask>>({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    assignedTo: null,
    dueDate: null
  });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [showCompleteProjectDialog, setShowCompleteProjectDialog] = useState(false);
  const [completionDate, setCompletionDate] = useState('');
  const [completionDocuments, setCompletionDocuments] = useState<File[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (!id) return;

        await new Promise(resolve => setTimeout(resolve, 500));

        const projectData = getProjectById(id);
        const requestsData = getConnectionRequestsForProject(id);

        if (projectData) {
          setProject(projectData);
          setConnectionRequests(requestsData);
        } else {
          toast({
            title: "Project niet gevonden",
            description: "Het opgevraagde project kon niet worden gevonden",
            variant: "destructive",
          });
          navigate('/projects');
        }
      } catch (error) {
        console.error("Error loading project data:", error);
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van de projectgegevens",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleEditProject = () => {
    toast({
      title: "Bewerken",
      description: "Project bewerken functionaliteit is nog in ontwikkeling",
    });
  };

  const handleDeleteProject = () => {
    toast({
      title: "Verwijderen",
      description: "Project verwijderen functionaliteit is nog in ontwikkeling",
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !project) return;

    const updatedProject = {
      ...project,
      comments: [
        {
          id: `comment-${project.id}-${Date.now()}`,
          text: newComment,
          createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          createdBy: "1",
          createdByName: "Jan de Vries",
        },
        ...project.comments
      ]
    };

    setProject(updatedProject);
    setNewComment('');

    toast({
      title: "Opmerking toegevoegd",
      description: "Uw opmerking is succesvol toegevoegd aan het project",
    });
  };

  const handleUpdateProjectStatus = (status: ProjectStatus) => {
    if (!project) return;

    const updatedProject = {
      ...project,
      status
    };

    setProject(updatedProject);

    toast({
      title: "Status bijgewerkt",
      description: `Projectstatus is bijgewerkt naar ${formatStatus(status)}`,
    });
  };

  const handleUpdateProjectPhase = (phase: BuildingPhase) => {
    if (!project) return;

    const updatedProject = {
      ...project,
      buildingPhase: phase
    };

    setProject(updatedProject);

    toast({
      title: "Bouwfase bijgewerkt",
      description: `Bouwfase is bijgewerkt naar ${formatBuildingPhase(phase)}`,
    });
  };

  const handleRequestNewConnection = () => {
    if (!project) return;
    navigate(`/connections/new?projectId=${project.id}`);
  };

  const handleAddTask = () => {
    if (!project || !newTask.title) return;

    const task: ProjectTask = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description || '',
      status: newTask.status as 'open' | 'in_progress' | 'completed',
      priority: newTask.priority as 'low' | 'medium' | 'high',
      assignedTo: newTask.assignedTo,
      dueDate: newTask.dueDate
    };

    const updatedProject = {
      ...project,
      tasks: [...project.tasks, task]
    };

    setProject(updatedProject);
    setNewTask({
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
      assignedTo: null,
      dueDate: null
    });
    setIsAddingTask(false);

    toast({
      title: "Taak toegevoegd",
      description: "Nieuwe taak succesvol toegevoegd aan het project",
    });
  };

  const handleUpdateTask = (updatedTask: ProjectTask) => {
    if (!project) return;

    const updatedTasks = project.tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );

    const updatedProject = {
      ...project,
      tasks: updatedTasks
    };

    setProject(updatedProject);
    setEditingTaskId(null);

    toast({
      title: "Taak bijgewerkt",
      description: "De taak is succesvol bijgewerkt",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    if (!project) return;

    const updatedTasks = project.tasks.filter(task => task.id !== taskId);

    const updatedProject = {
      ...project,
      tasks: updatedTasks
    };

    setProject(updatedProject);

    toast({
      title: "Taak verwijderd",
      description: "De taak is succesvol verwijderd",
    });
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: 'open' | 'in_progress' | 'completed') => {
    if (!project) return;

    const updatedTasks = project.tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );

    const updatedProject = {
      ...project,
      tasks: updatedTasks
    };

    setProject(updatedProject);

    toast({
      title: "Status bijgewerkt",
      description: `Taakstatus is bijgewerkt naar ${newStatus === 'open' ? 'Open' :
          newStatus === 'in_progress' ? 'In Uitvoering' : 'Voltooid'
        }`,
    });
  };

  const handleUpdateRequestStatus = (requestId: string, oldStatus: ConnectionRequest['status'], newStatus: ConnectionRequest['status']) => {
    if (!isValidStatusTransition(oldStatus, newStatus)) {
      toast({
        title: "Ongeldige statuswijziging",
        description: `Kan status niet wijzigen van ${formatConnectionRequestStatus(oldStatus)} naar ${formatConnectionRequestStatus(newStatus)}`,
        variant: "destructive"
      });
      return;
    }

    const updatedRequests = connectionRequests.map(request =>
      request.id === requestId ? { ...request, status: newStatus } : request
    );

    setConnectionRequests(updatedRequests);

    toast({
      title: "Status bijgewerkt",
      description: `Aanvraagstatus is bijgewerkt: ${formatStatusChange(oldStatus, newStatus)}`,
    });
  };

  const handleCompleteProject = () => {
    setShowCompleteProjectDialog(true);
  };

  const handleFinalizeProject = () => {
    if (!completionDate || completionDocuments.length === 0) return;

    toast({
      title: "Project Opleveren",
      description: "Project is succesvol opgeleverd",
    });

    setShowCompleteProjectDialog(false);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cedrus-accent"></div>
        </div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Project niet gevonden</h3>
          <p className="text-muted-foreground mb-4">
            Het opgevraagde project kon niet worden gevonden.
          </p>
          <Button onClick={() => navigate('/projects')}>
            Terug naar projecten
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug naar projectoverzicht
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">{project.name}</h1>
            <p className="text-muted-foreground mt-1">
              {project.city}, {project.address}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEditProject}>
              <Edit className="h-4 w-4 mr-2" /> Bewerken
            </Button>
            {project.status !== 'afgerond' && (
              <Button variant="default" className="bg-green-600 hover:bg-green-700" onClick={handleCompleteProject}>
                <CheckCircle className="h-4 w-4 mr-2" /> Project Opleveren
              </Button>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="h-4 w-4 mr-2" /> Verwijderen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Project verwijderen</DialogTitle>
                  <DialogDescription>
                    Weet u zeker dat u dit project wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { }}>Annuleren</Button>
                  <Button variant="destructive" onClick={handleDeleteProject}>Verwijderen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overzicht</TabsTrigger>
            <TabsTrigger value="connections">Aansluitingen</TabsTrigger>
            <TabsTrigger value="connection-pipeline">Aansluiting status</TabsTrigger>
            <TabsTrigger value="energy-contract">Energiecontract aanvragen</TabsTrigger>
            <TabsTrigger value="team">Samenwerking</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Projectgegevens</CardTitle>
                      <CardDescription>Algemene informatie over het project</CardDescription>
                    </div>
                    <ProjectStatusBadge status={project.status} />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="customer">Klant / Entiteit</Label>
                          <Input id="customer" value={project.customer} readOnly className="bg-muted/50" />
                        </div>
                        <div>
                          <Label htmlFor="projectManager">Projectmanager</Label>
                          <Input id="projectManager" value={getProjectManagerName(project.projectManager)} readOnly className="bg-muted/50" />
                        </div>
                        <div>
                          <Label htmlFor="buildingPhase">Bouwfase</Label>
                          <Select
                            defaultValue={project.buildingPhase}
                            onValueChange={(value) => handleUpdateProjectPhase(value as BuildingPhase)}
                          >
                            <SelectTrigger id="buildingPhase">
                              <SelectValue placeholder="Selecteer bouwfase" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planning">Planning</SelectItem>
                              <SelectItem value="ontwerp">Ontwerp</SelectItem>
                              <SelectItem value="constructie">Constructie</SelectItem>
                              <SelectItem value="afwerking">Afwerking</SelectItem>
                              <SelectItem value="oplevering">Oplevering</SelectItem>
                              <SelectItem value="onderhoud">Onderhoud</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="status">Projectstatus</Label>
                          <Select
                            defaultValue={project.status}
                            onValueChange={(value) => handleUpdateProjectStatus(value as ProjectStatus)}
                          >
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Selecteer status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="concept">Concept</SelectItem>
                              <SelectItem value="in_aanvraag">In Aanvraag</SelectItem>
                              <SelectItem value="lopend">Lopend</SelectItem>
                              <SelectItem value="afgerond">Afgerond</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="startDate">Startdatum</Label>
                          <Input id="startDate" type="date" value={project.startDate} readOnly className="bg-muted/50" />
                        </div>
                        <div>
                          <Label htmlFor="endDate">Einddatum</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={project.endDate || ''}
                            readOnly
                            className="bg-muted/50"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Projectbeschrijving</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: project.notes }}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Documenten</CardTitle>
                      <CardDescription>Contracten, planningen en andere projectdocumenten</CardDescription>
                    </div>
                    <Button size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" /> Document Toevoegen
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {project.documents.length === 0 ? (
                      <div className="text-center py-8 border rounded-md">
                        <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                          Er zijn nog geen documenten toegevoegd aan dit project
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {project.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{doc.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  Geüpload op {formatDate(doc.uploadedAt)}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Samenvatting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-muted-foreground">Aansluitingen</span>
                        <span className="font-medium">{project.connectionCount}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-muted-foreground">Status</span>
                        <ProjectStatusBadge status={project.status} />
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-muted-foreground">Bouwfase</span>
                        <span>{formatBuildingPhase(project.buildingPhase)}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-muted-foreground">Startdatum</span>
                        <span>{formatDate(project.startDate)}</span>
                      </div>
                      {project.endDate && (
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-muted-foreground">Einddatum</span>
                          <span>{formatDate(project.endDate)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-muted-foreground">Aangemaakt op</span>
                        <span>{formatDate(project.createdAt)}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2">
                        <span className="text-muted-foreground">Laatst bijgewerkt</span>
                        <span>{formatDate(project.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleRequestNewConnection} className="w-full">
                      <PlusCircle className="h-4 w-4 mr-2" /> Nieuwe Aansluiting Aanvragen
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Recente Opmerkingen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-4">
                      {project.comments.length === 0 ? (
                        <div className="text-center py-4">
                          <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">Er zijn nog geen opmerkingen</p>
                        </div>
                      ) : (
                        project.comments.map((comment) => (
                          <div key={comment.id} className="border rounded-md p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="font-medium">{comment.createdByName}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatDateWithTime(comment.createdAt)}
                              </div>
                            </div>
                            <p className="text-sm">{comment.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Voeg een opmerking toe..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="connections">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Aansluitingen in dit project</CardTitle>
                  <CardDescription>
                    Overzicht van alle aansluitingen die gekoppeld zijn aan dit project
                  </CardDescription>
                </div>
                <Button onClick={handleRequestNewConnection}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Nieuwe Aansluiting
                </Button>
              </CardHeader>
              <CardContent>
                {project.connectionCount === 0 ? (
                  <div className="text-center py-12 border rounded-md">
                    <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Geen aansluitingen gevonden</h3>
                    <p className="text-muted-foreground mb-4">
                      Dit project heeft nog geen aansluitingen.
                    </p>
                    <Button onClick={handleRequestNewConnection}>
                      Aansluiting Aanvragen
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>EAN</TableHead>
                          <TableHead>Adres</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Leverancier</TableHead>
                          <TableHead className="text-right">Acties</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: Math.min(5, project.connectionCount) }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono">
                              871687{Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}
                            </TableCell>
                            <TableCell>
                              {project.address}, Unit {index + 1}
                            </TableCell>
                            <TableCell>
                              {Math.random() > 0.3 ? 'Elektriciteit' : 'Gas'}
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                index % 3 === 0 ? 'bg-green-500 text-white' :
                                  index % 3 === 1 ? 'bg-yellow-500 text-white' :
                                    'bg-blue-500 text-white'
                              }>
                                {index % 3 === 0 ? 'Actief' :
                                  index % 3 === 1 ? 'In aanvraag' :
                                    'Inactief'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {['Vattenfall', 'Eneco', 'Essent'][index % 3]}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigate(`/connections/${1000 + index}`)}
                                  title="Details bekijken"
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => { }}
                                  title="Aansluiting afmelden"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigate('/connections/switch')}
                                  title="Switch leverancier"
                                >
                                  <ArrowLeft className="h-4 w-4 rotate-180" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pipeline">
            <Card>
              <CardHeader>
                <CardTitle>Aanvraagstatus pijplijn</CardTitle>
                <CardDescription>
                  Visueel overzicht van de status van alle aansluitingsaanvragen binnen dit project.
                  Sleep een aanvraag naar een andere kolom om de status te wijzigen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {['concept', 'ingediend', 'in_behandeling', 'goedgekeurd', 'aangesloten'].map((status) => {
                    const statusRequests = connectionRequests.filter(
                      req => req.status === status
                    );

                    return (
                      <PipelineColumn
                        key={status}
                        status={status as ConnectionRequest['status']}
                        requests={statusRequests}
                        onCardClick={(requestId) => {
                          toast({
                            title: "Details bekijken",
                            description: `Details voor aanvraag ${requestId}`
                          });
                        }}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={(event) => handleDrop(
                          event,
                          status as ConnectionRequest['status'],
                          handleUpdateRequestStatus
                        )}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connection-pipeline">
            <ConnectionRequestPipeline
              projectId={project.id}
              connectionRequests={connectionRequests}
              setConnectionRequests={setConnectionRequests}
              projectEndDate={project.endDate}
            />
          </TabsContent>

          <TabsContent value="energy-contract">
            <EnergyContractPipeline
              projectId={project.id}
              connectionRequests={connectionRequests}
            />
          </TabsContent>

          <TabsContent value="team">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Teammembers</CardTitle>
                      <CardDescription>
                        Mensen die betrokken zijn bij dit project
                      </CardDescription>
                    </div>
                    <Button size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" /> Lid Toevoegen
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {project.team.map((member) => (
                      <div
                        key={member.id}
                        className="flex justify-between items-center p-4 border rounded-md mb-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Badge variant="outline">
                                {member.role === 'projectmanager' ? 'Projectmanager' :
                                  member.role === 'consultant' ? 'Consultant' :
                                    member.role === 'klantcontact' ? 'Klantcontact' : 'Teamlid'}
                              </Badge>
                              <span>{member.email}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Takenlijst</CardTitle>
                      <CardDescription>Interne taken voor dit project</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setIsAddingTask(true)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" /> Taak Toevoegen
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isAddingTask && (
                      <div className="border rounded-md p-4 mb-4 bg-muted/20">
                        <h4 className="font-medium mb-3">Nieuwe taak</h4>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="task-title">Titel</Label>
                            <Input
                              id="task-title"
                              value={newTask.title}
                              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                              placeholder="Taakomschrijving"
                            />
                          </div>
                          <div>
                            <Label htmlFor="task-description">Beschrijving</Label>
                            <Textarea
                              id="task-description"
                              value={newTask.description || ''}
                              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                              placeholder="Beschrijving van de taak"
                              rows={2}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="task-assignee">Toegewezen aan</Label>
                              <Select
                                value={newTask.assignedTo || ''}
                                onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value || null })}
                              >
                                <SelectTrigger id="task-assignee">
                                  <SelectValue placeholder="Selecteer persoon" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="">Niemand</SelectItem>
                                  {project.team.map(member => (
                                    <SelectItem key={member.id} value={member.id}>
                                      {member.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="task-priority">Prioriteit</Label>
                              <Select
                                value={newTask.priority || 'medium'}
                                onValueChange={(value) => setNewTask({ ...newTask, priority: value as 'low' | 'medium' | 'high' })}
                              >
                                <SelectTrigger id="task-priority">
                                  <SelectValue placeholder="Selecteer prioriteit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Laag</SelectItem>
                                  <SelectItem value="medium">Middel</SelectItem>
                                  <SelectItem value="high">Hoog</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="task-duedate">Deadline</Label>
                            <Input
                              id="task-duedate"
                              type="date"
                              value={newTask.dueDate || ''}
                              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value || null })}
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                              Annuleren
                            </Button>
                            <Button onClick={handleAddTask} disabled={!newTask.title}>
                              Taak Toevoegen
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {project.tasks.length === 0 && !isAddingTask ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Geen taken voor dit project</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setIsAddingTask(true)}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" /> Taak Toevoegen
                        </Button>
                      </div>
                    ) : (
                      project.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-3 p-3 border rounded-md mb-3 hover:bg-muted/50 transition-colors"
                        >
                          {editingTaskId === task.id ? (
                            <div className="w-full space-y-3">
                              <Input
                                value={task.title}
                                onChange={(e) => handleUpdateTask({ ...task, title: e.target.value })}
                                className="font-medium"
                              />
                              <Textarea
                                value={task.description}
                                onChange={(e) => handleUpdateTask({ ...task, description: e.target.value })}
                                rows={2}
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <Select
                                  value={task.assignedTo || ''}
                                  onValueChange={(value) => handleUpdateTask({ ...task, assignedTo: value || null })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Toegewezen aan" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="">Niemand</SelectItem>
                                    {project.team.map(member => (
                                      <SelectItem key={member.id} value={member.id}>
                                        {member.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Select
                                  value={task.priority}
                                  onValueChange={(value) => handleUpdateTask({ ...task, priority: value as 'low' | 'medium' | 'high' })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Prioriteit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Laag</SelectItem>
                                    <SelectItem value="medium">Middel</SelectItem>
                                    <SelectItem value="high">Hoog</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="date"
                                  value={task.dueDate || ''}
                                  onChange={(e) => handleUpdateTask({ ...task, dueDate: e.target.value || null })}
                                  className="flex-1"
                                />
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingTaskId(null)}
                                >
                                  Annuleren
                                </Button>
                                <Button
                                  onClick={() => setEditingTaskId(null)}
                                >
                                  Opslaan
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div
                                className="mt-1 cursor-pointer"
                                onClick={() => handleUpdateTaskStatus(
                                  task.id,
                                  task.status === 'open' ? 'in_progress' :
                                    task.status === 'in_progress' ? 'completed' : 'open'
                                )}
                              >
                                <CheckCircle className={`h-5 w-5 ${task.status === 'completed'
                                    ? 'text-green-500 fill-green-500'
                                    : task.status === 'in_progress'
                                      ? 'text-yellow-500'
                                      : 'text-muted-foreground'
                                  }`} />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{task.title}</div>
                                <div className="text-sm text-muted-foreground mt-1">{task.description}</div>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <div className="text-xs bg-muted px-2 py-1 rounded-full">
                                    Toegewezen aan: {task.assignedTo ? getProjectManagerName(task.assignedTo) : 'Niemand'}
                                  </div>
                                  {task.dueDate && (
                                    <div className="text-xs bg-muted px-2 py-1 rounded-full flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {formatDate(task.dueDate)}
                                    </div>
                                  )}
                                  <Badge
                                    variant="outline"
                                    className={
                                      task.priority === 'high'
                                        ? 'border-red-500 text-red-500'
                                        : task.priority === 'medium'
                                          ? 'border-yellow-500 text-yellow-500'
                                          : 'border-blue-500 text-blue-500'
                                    }
                                  >
                                    {task.priority === 'high'
                                      ? 'Hoog'
                                      : task.priority === 'medium'
                                        ? 'Middel'
                                        : 'Laag'}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={
                                      task.status === 'completed'
                                        ? 'border-green-500 text-green-500'
                                        : task.status === 'in_progress'
                                          ? 'border-yellow-500 text-yellow-500'
                                          : 'border-blue-500 text-blue-500'
                                    }
                                  >
                                    {task.status === 'completed'
                                      ? 'Voltooid'
                                      : task.status === 'in_progress'
                                        ? 'In Uitvoering'
                                        : 'Open'}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingTaskId(task.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showCompleteProjectDialog} onOpenChange={setShowCompleteProjectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Project Opleveren</DialogTitle>
            <DialogDescription>
              Vul de opleverdatum in en voeg minimaal één document toe aan het opleverdossier.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="completion-date">Opleverdatum</Label>
              <Input
                id="completion-date"
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Opleverdossier documenten (minimaal 1 verplicht)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  id="document-upload"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setCompletionDocuments([...completionDocuments, e.target.files[0]]);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.getElementById('document-upload') as HTMLInputElement;
                    if (input) input.click();
                  }}
                >
                  Bestand selecteren
                </Button>
              </div>

              {completionDocuments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>Geselecteerde bestanden:</Label>
                  <div className="space-y-2">
                    {completionDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{doc.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCompletionDocuments(completionDocuments.filter((_, i) => i !== index));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteProjectDialog(false)}>
              Annuleren
            </Button>
            <Button
              onClick={handleFinalizeProject}
              disabled={!completionDate || completionDocuments.length === 0}
            >
              Project Opleveren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

function formatDate(dateStr: string) {
  try {
    const date = parseISO(dateStr);
    if (isValid(date)) {
      return format(date, 'dd-MM-yyyy');
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

function formatDateWithTime(dateTimeStr: string) {
  try {
    const date = parseISO(dateTimeStr);
    if (isValid(date)) {
      return format(date, 'dd-MM-yyyy HH:mm');
    }
    return dateTimeStr;
  } catch {
    return dateTimeStr;
  }
}

function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const getStatusStyles = (status: ProjectStatus) => {
    switch (status) {
      case 'concept':
        return 'bg-muted text-foreground';
      case 'in_aanvraag':
        return 'bg-yellow-500 text-white';
      case 'lopend':
        return 'bg-green-500 text-white';
      case 'afgerond':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-muted text-foreground';
    }
  };

  return (
    <Badge className={getStatusStyles(status)}>
      {formatStatus(status)}
    </Badge>
  );
}

interface PipelineColumnProps {
  status: ConnectionRequest['status'];
  requests: ConnectionRequest[];
  onCardClick: (id: string) => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, requestId: string, status: ConnectionRequest['status']) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
}

function PipelineColumn({
  status,
  requests,
  onCardClick,
  onDragStart,
  onDragOver,
  onDrop
}: PipelineColumnProps) {
  const getStatusInfo = (status: ConnectionRequest['status']) => {
    switch (status) {
      case 'concept':
        return {
          title: 'Concept',
          color: 'bg-gray-100 border-gray-300',
          textColor: 'text-gray-700'
        };
      case 'ingediend':
        return {
          title: 'Ingediend',
          color: 'bg-blue-50 border-blue-300',
          textColor: 'text-blue-700'
        };
      case 'in_behandeling':
        return {
          title: 'In behandeling',
          color: 'bg-yellow-50 border-yellow-300',
          textColor: 'text-yellow-700'
        };
      case 'goedgekeurd':
        return {
          title: 'Goedgekeurd',
          color: 'bg-purple-50 border-purple-300',
          textColor: 'text-purple-700'
        };
      case 'aangesloten':
        return {
          title: 'Aangesloten',
          color: 'bg-green-50 border-green-300',
          textColor: 'text-green-700'
        };
      default:
        return {
          title: 'Onbekend',
          color: 'bg-gray-100 border-gray-300',
          textColor: 'text-gray-700'
        };
    }
  };

  const { title, color, textColor } = getStatusInfo(status);

  return (
    <div
      className={`rounded-md ${color} border p-3 h-full min-h-[300px]`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className={`font-medium ${textColor} mb-3 flex justify-between`}>
        {title}
        <Badge variant="outline">{requests.length}</Badge>
      </div>

      <div className="space-y-2">
        {requests.length === 0 ? (
          <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
            Geen aanvragen
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="p-3 rounded-md bg-white border shadow-sm cursor-move hover:shadow-md transition-shadow"
              onClick={() => onCardClick(request.id)}
              draggable
              onDragStart={(e) => onDragStart(e, request.id, request.status)}
            >
              <div className="text-sm font-medium mb-1 truncate">{request.address}</div>
              <div className="flex items-center justify-between text-xs">
                <Badge variant={request.type === 'electricity' ? 'default' : 'secondary'} className="text-[10px]">
                  {request.type === 'electricity' ? 'Elektra' : 'Gas'}
                </Badge>
                <div className="text-muted-foreground">
                  {request.ean ? request.ean.slice(-8) : 'Geen EAN'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
