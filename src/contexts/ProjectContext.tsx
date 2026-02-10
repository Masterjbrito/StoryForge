import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import type { ProjectSummary, Project, NewProjectFormData } from '@/types/domain';
import { initialProjectSummaries, initialProjectsData } from '@/data/mock-projects';

interface ProjectContextValue {
  projects: ProjectSummary[];
  projectsData: Record<number, Project>;
  addProject: (formData: NewProjectFormData) => number;
  getProject: (id: number) => Project | undefined;
  updateProject: (id: number, updates: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  duplicateProject: (id: number) => number;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<ProjectSummary[]>(() =>
    loadFromStorage('projects', initialProjectSummaries)
  );

  const [projectsData, setProjectsData] = useState<Record<number, Project>>(() =>
    loadFromStorage('projectsData', initialProjectsData)
  );

  const persist = useCallback(
    (newProjects: ProjectSummary[], newData: Record<number, Project>) => {
      setProjects(newProjects);
      setProjectsData(newData);
      saveToStorage('projects', newProjects);
      saveToStorage('projectsData', newData);
    },
    []
  );

  const addProject = useCallback(
    (formData: NewProjectFormData): number => {
      const newId = Math.max(0, ...projects.map((p) => p.id)) + 1;
      const now = new Date();

      const newSummary: ProjectSummary = {
        id: newId,
        name: formData.name || 'Novo Projeto',
        code: formData.code || `PROJ-${newId}`,
        department: formData.department || 'Digital',
        type: formData.type || 'Web Banking',
        platform: formData.targetPlatform || 'Jira Cloud',
        version: 'v1.0.0',
        createdAt: now,
        lastExport: now,
        status: 'draft',
        artifacts: { epics: 0, features: 0, userStories: 0, tasks: 0, testCases: 0 },
        compliance: formData.complianceFrameworks || [],
        url: '',
        qualityScore: 0,
        exportCount: 0,
        lastModifiedBy: 'Susana Gamito',
      };

      const newProject: Project = {
        id: newId,
        name: formData.name || 'Novo Projeto',
        code: formData.code || `PROJ-${newId}`,
        department: formData.department || 'Digital',
        type: formData.type || 'Web Banking',
        platform: formData.targetPlatform || 'Jira Cloud',
        version: 'v1.0.0',
        createdAt: now,
        lastExport: now,
        createdBy: 'Susana Gamito',
        description: formData.description || '',
        objectives: [],
        compliance: formData.complianceFrameworks || [],
        qualityScore: 0,
        url: '',
        structure: [],
      };

      const newProjects = [newSummary, ...projects];
      const newData = { ...projectsData, [newId]: newProject };
      persist(newProjects, newData);
      return newId;
    },
    [projects, projectsData, persist]
  );

  const getProject = useCallback(
    (id: number) => projectsData[id],
    [projectsData]
  );

  const updateProject = useCallback(
    (id: number, updates: Partial<Project>) => {
      const existing = projectsData[id];
      if (!existing) return;

      const updated = { ...existing, ...updates };
      const newData = { ...projectsData, [id]: updated };

      const newProjects = projects.map((p) =>
        p.id === id
          ? {
              ...p,
              name: updated.name,
              code: updated.code,
              version: updated.version,
              qualityScore: updated.qualityScore,
              compliance: updated.compliance,
            }
          : p
      );

      persist(newProjects, newData);
    },
    [projects, projectsData, persist]
  );

  const deleteProject = useCallback(
    (id: number) => {
      const newProjects = projects.filter((p) => p.id !== id);
      const { [id]: _, ...newData } = projectsData;
      persist(newProjects, newData);
    },
    [projects, projectsData, persist]
  );

  const duplicateProject = useCallback(
    (id: number): number => {
      const source = projectsData[id];
      if (!source) return -1;

      const newId = Math.max(0, ...projects.map((p) => p.id)) + 1;
      const now = new Date();

      const newSummary: ProjectSummary = {
        ...projects.find((p) => p.id === id)!,
        id: newId,
        name: `${source.name} (Cópia)`,
        code: `${source.code}-COPY`,
        createdAt: now,
        lastExport: now,
        status: 'draft',
        exportCount: 0,
        version: 'v1.0.0',
      };

      const newProject: Project = {
        ...source,
        id: newId,
        name: `${source.name} (Cópia)`,
        code: `${source.code}-COPY`,
        createdAt: now,
        lastExport: now,
        version: 'v1.0.0',
      };

      const newProjects = [newSummary, ...projects];
      const newData = { ...projectsData, [newId]: newProject };
      persist(newProjects, newData);
      return newId;
    },
    [projects, projectsData, persist]
  );

  return (
    <ProjectContext.Provider
      value={{ projects, projectsData, addProject, getProject, updateProject, deleteProject, duplicateProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider');
  return ctx;
}
