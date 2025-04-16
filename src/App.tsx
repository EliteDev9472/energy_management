
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ConnectionsPage from "./pages/connections/ConnectionsPage";
import ConnectionDetailPage from "./pages/connections/ConnectionDetailPage";
import NewConnectionPage from "./pages/connections/NewConnectionPage";
import ConnectionPipelinePage from "./pages/connections/ConnectionPipelinePage";
import SwitchSupplierPage from "./pages/connections/SwitchSupplierPage";
import AuthPage from "./pages/auth/AuthPage";
import ProjectsPage from "./pages/projects/ProjectsPage";
import ProjectDetailPage from "./pages/projects/ProjectDetailPage";
import NewProjectPage from "./pages/projects/NewProjectPage";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./hooks/useAuth";
import { SettingsProvider } from "./contexts/SettingsContext";
import { RequireAuth } from "./components/auth/RequireAuth";
import OrganizationsPage from "./pages/organizations/OrganizationsPage";
import OrganizationDetailPage from "./pages/organizations/OrganizationDetailPage";
import NewOrganizationPage from "./pages/organizations/NewOrganizationPage";
import EntitiesPage from "./pages/entities/EntitiesPage";
import EntityDetailPage from "./pages/entities/EntityDetailPage";
import NewEntityPage from "./pages/entities/NewEntityPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import CategoryDetailPage from "./pages/categories/CategoryDetailPage";
import NewCategoryPage from "./pages/categories/NewCategoryPage";
import ComplexesPage from "./pages/complexes/ComplexesPage";
import ComplexDetailPage from "./pages/complexes/ComplexDetailPage";
import NewComplexPage from "./pages/complexes/NewComplexPage";
import ObjectsPage from "./pages/objects/ObjectsPage";
import ObjectDetailPage from "./pages/objects/ObjectDetailPage";
import NewObjectPage from "./pages/objects/NewObjectPage";
import TeamMembersPage from "./pages/team/TeamMembersPage";
import TasksPage from "./pages/tasks/TasksPage";
import SettingsPage from "./pages/settings/SettingsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import NewUserPage from "./pages/admin/NewUserPage";
import ClientsManagementPage from "./pages/clients/ClientsManagementPage";
import { RoleGuard } from "./components/auth/RoleGuard";
import EditConnectionPage from "./pages/connections/EditConnectionPage";

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/" element={<Index />} />

            {/* Hierarchical Structure Routes */}
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route path="/organizations/:id" element={<OrganizationDetailPage />} />
            <Route path="/organizations/new" element={<NewOrganizationPage />} />

            <Route path="/entities" element={<EntitiesPage />} />
            <Route path="/entities/:id" element={<EntityDetailPage />} />
            <Route path="/entities/new" element={<NewEntityPage />} />

            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:id" element={<CategoryDetailPage />} />
            <Route path="/categories/new" element={<NewCategoryPage />} />

            {/* Project Management Routes */}
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/projects/new" element={<NewProjectPage />} />

            {/* Complex and Object Routes */}
            <Route path="/complexes" element={<ComplexesPage />} />
            <Route path="/complexes/:id" element={<ComplexDetailPage />} />
            <Route path="/complexes/new" element={<NewComplexPage />} />

            <Route path="/objects" element={<ObjectsPage />} />
            <Route path="/objects/:id" element={<ObjectDetailPage />} />
            <Route path="/objects/new" element={<NewObjectPage />} />

            {/* Object and Connection Routes */}
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/connections/:id" element={<ConnectionDetailPage />} />
            <Route path="/connections/:id/edit" element={<EditConnectionPage />} />
            <Route path="/connections/new" element={<NewConnectionPage />} />
            <Route path="/connections/switch" element={<SwitchSupplierPage />} />
            <Route path="/connections/pipeline" element={<ConnectionPipelinePage />} />

            {/* Team and Task Management Routes */}
            <Route path="/team" element={<TeamMembersPage />} />
            <Route path="/tasks" element={<TasksPage />} />

            {/* Profile and Settings Routes */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Admin Routes - Now accessed through Settings */}
            <Route path="/admin/users" element={<RoleGuard allowedRoles={['admin']}><UserManagementPage /></RoleGuard>} />
            <Route path="/admin/users/new" element={<RoleGuard allowedRoles={['admin']}><NewUserPage /></RoleGuard>} />

            {/* Client Management Routes - Now accessed through Settings */}
            <Route path="/clients" element={<RoleGuard allowedRoles={['admin', 'consultant']}><ClientsManagementPage /></RoleGuard>} />
          </Route>

          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
        <Toaster />
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
