
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TeamMember } from '@/types/project';
import { ProjectStatus, BuildingPhase } from '@/types/project';

interface ProjectBasicInfoFieldsProps {
  formData: {
    projectNumber: string;
    name: string;
    customer: string;
    status: ProjectStatus;
    projectManager: string;
    startDate: string;
    endDate: string;
    address: string;
    city: string;
    buildingPhase: BuildingPhase;
  };
  teamMembers: TeamMember[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const ProjectBasicInfoFields = ({
  formData,
  teamMembers,
  handleChange,
  handleSelectChange
}: ProjectBasicInfoFieldsProps) => {
  const statusOptions = [
    { value: 'concept', label: 'Concept' },
    { value: 'in_aanvraag', label: 'In Aanvraag' },
    { value: 'lopend', label: 'Lopend' },
    { value: 'afgerond', label: 'Afgerond' }
  ];
  
  const buildingPhaseOptions = [
    { value: 'planning', label: 'Planning' },
    { value: 'ontwerp', label: 'Ontwerp' },
    { value: 'constructie', label: 'Constructie' },
    { value: 'afwerking', label: 'Afwerking' },
    { value: 'oplevering', label: 'Oplevering' },
    { value: 'onderhoud', label: 'Onderhoud' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="projectNumber">Projectnummer <span className="text-red-500">*</span></Label>
          <Input 
            id="projectNumber" 
            name="projectNumber" 
            value={formData.projectNumber} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="name">Projectnaam <span className="text-red-500">*</span></Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            placeholder="Voer projectnaam in"
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="customer">Klant <span className="text-red-500">*</span></Label>
          <Input 
            id="customer" 
            name="customer" 
            value={formData.customer} 
            onChange={handleChange}
            placeholder="Voer klantnaam in"
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="address">Adres</Label>
          <Input 
            id="address" 
            name="address" 
            value={formData.address} 
            onChange={handleChange}
            placeholder="Hoofdstraat 1"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="city">Plaats</Label>
          <Input 
            id="city" 
            name="city" 
            value={formData.city} 
            onChange={handleChange}
            placeholder="Amsterdam"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select
            name="status"
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecteer status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="buildingPhase">Bouwfase</Label>
          <Select
            name="buildingPhase"
            value={formData.buildingPhase}
            onValueChange={(value) => handleSelectChange('buildingPhase', value as BuildingPhase)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecteer bouwfase" />
            </SelectTrigger>
            <SelectContent>
              {buildingPhaseOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="projectManager">Projectmanager</Label>
          <Select
            name="projectManager"
            value={formData.projectManager}
            onValueChange={(value) => handleSelectChange('projectManager', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecteer projectmanager" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Geen projectmanager</SelectItem>
              {teamMembers.map(member => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="startDate">Startdatum</Label>
          <Input 
            id="startDate" 
            name="startDate" 
            type="date" 
            value={formData.startDate} 
            onChange={handleChange} 
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="endDate">Einddatum</Label>
          <Input 
            id="endDate" 
            name="endDate" 
            type="date" 
            value={formData.endDate} 
            onChange={handleChange} 
          />
        </div>
      </div>
    </div>
  );
};
