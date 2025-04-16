
import { useState, useEffect } from "react";
import { hierarchyService } from "@/services/hierarchy";
import { useParams } from "react-router-dom";
import { Organization, Entity, Category, Project, Complex, HierarchyObject } from "@/types/hierarchy";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";

export function OrganizationHierarchyView({}) {
  const { organizationId } = useParams();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [categories, setCategories] = useState<Record<string, Category[]>>({});
  const [projects, setProjects] = useState<Record<string, Project[]>>({});
  const [complexes, setComplexes] = useState<Record<string, Complex[]>>({});
  const [objects, setObjects] = useState<Record<string, HierarchyObject[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchHierarchyData() {
      if (!organizationId) return;

      try {
        // Fetch organization
        const org = await hierarchyService.getOrganizationById(organizationId);
        if (!org) throw new Error("Organization not found");
        setOrganization(org);

        // Fetch entities for this organization
        const fetchedEntities = await hierarchyService.getEntitiesByOrganization(organizationId);
        setEntities(fetchedEntities);

        // For each entity, fetch categories
        const categoryMap: Record<string, Category[]> = {};
        for (const entity of fetchedEntities) {
          const entityCategories = await hierarchyService.getCategoriesByEntity(entity.id);
          categoryMap[entity.id] = entityCategories;
        }
        setCategories(categoryMap);

        // For each category, fetch projects
        const projectMap: Record<string, Project[]> = {};
        for (const entityId in categoryMap) {
          for (const category of categoryMap[entityId]) {
            const categoryProjects = await hierarchyService.getProjectsByCategory(category.id);
            projectMap[category.id] = categoryProjects;
          }
        }
        setProjects(projectMap);

        // For each project, fetch complexes
        const complexMap: Record<string, Complex[]> = {};
        for (const categoryId in projectMap) {
          for (const project of projectMap[categoryId]) {
            const projectComplexes = await hierarchyService.getComplexesByProject(project.id);
            complexMap[project.id] = projectComplexes;
          }
        }
        setComplexes(complexMap);

        // For each complex, fetch objects
        const objectMap: Record<string, HierarchyObject[]> = {};
        for (const projectId in complexMap) {
          for (const complex of complexMap[projectId]) {
            const complexObjects = await hierarchyService.getObjectsByComplex(complex.id);
            objectMap[complex.id] = complexObjects;
          }
        }
        setObjects(objectMap);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching hierarchy data:", error);
        setError(error instanceof Error ? error : new Error("Failed to fetch hierarchy"));
        setLoading(false);
      }
    }

    fetchHierarchyData();
  }, [organizationId]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !organization) {
    return <ErrorState title="Organisatie niet gevonden" />;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">{organization.name}</h2>

        <div className="space-y-4">
          {entities.map((entity) => (
            <div key={entity.id} className="ml-4">
              <h3 className="text-lg font-medium">Entiteit: {entity.name}</h3>

              {(categories[entity.id] || []).map((category) => (
                <div key={category.id} className="ml-4 mt-2">
                  <h4 className="text-md font-medium">Categorie: {category.name}</h4>

                  {(projects[category.id] || []).map((project) => (
                    <div key={project.id} className="ml-4 mt-1">
                      <p className="font-medium">Project: {project.name}</p>

                      {(complexes[project.id] || []).map((complex) => (
                        <div key={complex.id} className="ml-4 mt-1">
                          <p>Complex: {complex.name}</p>

                          <ul className="list-disc ml-8">
                            {(objects[complex.id] || []).map((object) => (
                              <li key={object.id} className="text-sm">
                                {object.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
