import { create } from 'zustand';

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  tags: string[];
  lastModified: string;
  itemCount?: number;
  createdAt: string;
}

interface ProjectsStore {
  projects: Project[];
  currentProjectId: string | null;
  isLoading: boolean;
  addProject: (project: Project) => void;
  setProjects: (projects: Project[]) => void;
  setCurrentProjectId: (id: string | null) => void;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  getProjectById: (id: string) => Project | undefined;
  setIsLoading: (loading: boolean) => void;
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: [
    {
      id: '1',
      name: 'North Campus',
      description: 'Main site planning for north campus expansion',
      category: 'site-planning',
      tags: ['Planning', 'Campus'],
      lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      itemCount: 12,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      name: 'South Campus',
      description: 'Infrastructure planning and utility layout',
      category: 'infrastructure',
      tags: ['Infrastructure', 'Utilities'],
      lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      itemCount: 8,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'East Wing',
      description: 'Facility planning and amenities',
      category: 'facilities',
      tags: ['Facility', 'Amenities'],
      lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      itemCount: 15,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  currentProjectId: null,
  isLoading: false,

  addProject: (project: Project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),

  setProjects: (projects: Project[]) =>
    set({ projects }),

  setCurrentProjectId: (id: string | null) =>
    set({ currentProjectId: id }),

  deleteProject: (id: string) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
    })),

  updateProject: (id: string, updates: Partial<Project>) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  getProjectById: (id: string) => {
    const state = get();
    return state.projects.find((p) => p.id === id);
  },

  setIsLoading: (loading: boolean) =>
    set({ isLoading: loading }),
}));
