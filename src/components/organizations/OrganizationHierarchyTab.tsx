
import React, { useEffect, useState } from "react";
import { Tree, TreeNode } from "@/components/ui/tree";
import { hierarchyService } from "@/services/hierarchy";
import { useParams } from "react-router-dom";
import { Organization, Entity, Category, Project, Complex, HierarchyObject } from "@/types/hierarchy";

interface OrganizationHierarchyTabProps {
  organizationId: string;
}

export function OrganizationHierarchyTab({ organizationId }: OrganizationHierarchyTabProps) {
  // const { organizationId } = useParams();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [categories, setCategories] = useState<Record<string, Category[]>>({});
  const [projects, setProjects] = useState<Record<string, Project[]>>({});
  const [complexes, setComplexes] = useState<Record<string, Complex[]>>({});
  const [objects, setObjects] = useState<Record<string, HierarchyObject[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHierarchyData() {
      if (!organizationId) return;

      try {
        // Fetch organization
        const org = await hierarchyService.getOrganizationById(organizationId);
        if (org) setOrganization(org);

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
        setLoading(false);
      }
    }

    fetchHierarchyData();
  }, [organizationId]);

  if (loading) {
    return <div>Loading hierarchy...</div>;
  }

  if (!organization) {
    return <div>Organization not found</div>;
  }

  // Build the tree data
  const treeData = [
    {
      id: organization.id,
      name: organization.name,
      children: entities.map((entity) => ({
        id: entity.id,
        name: entity.name,
        children: (categories[entity.id] || []).map((category) => ({
          id: category.id,
          name: category.name,
          children: (projects[category.id] || []).map((project) => ({
            id: project.id,
            name: project.name,
            children: (complexes[project.id] || []).map((complex) => ({
              id: complex.id,
              name: complex.name,
              children: (objects[complex.id] || []).map((object) => ({
                id: object.id,
                name: object.name,
              })),
            })),
          })),
        })),
      })),
    },
  ];

  const renderTreeNode = (node: any): React.ReactNode => {
    if (!node || !node.id || !node.name) return null;

    const hasValidChildren = Array.isArray(node.children) && node.children.length > 0;

    return (
      <TreeNode key={node.id} id={node.id} label={node.name}>
        {hasValidChildren && node.children.map(renderTreeNode)}
      </TreeNode>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold text-lg mb-4">Hiërarchie</h2>
      <Tree>
        {treeData.map(renderTreeNode)}
      </Tree>
    </div>
  );
}
