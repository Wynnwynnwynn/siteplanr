import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { CreateProjectModal, CreateProjectData } from '../components/CreateProjectModal';
import { useProjectsStore } from '../store/projectsStore';

/**
 * Dashboard Page Wrapper
 *
 * Combines the Dashboard component with project management and modal state.
 * Handles project creation, navigation, and deletion.
 */
export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, addProject, deleteProject, isLoading, setIsLoading } = useProjectsStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateProject = async (data: CreateProjectData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newProject = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        category: data.category,
        tags: [data.category],
        lastModified: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        itemCount: 0,
      };

      addProject(newProject);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/editor/${projectId}`);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-50 dark:bg-neutral-900">
      <Dashboard
        projects={projects}
        isLoading={isLoading}
        onCreateProject={() => setShowCreateModal(true)}
        onProjectClick={handleProjectClick}
      />

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardPage;
