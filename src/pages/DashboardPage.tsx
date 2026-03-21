import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { CreateProjectModal, CreateProjectData } from '../components/CreateProjectModal';
import { MainLayout } from '../ui/components/MainLayout';
import { useProjectsStore } from '../store/projectsStore';

/**
 * Dashboard Page Wrapper
 *
 * Combines the Dashboard component with project management and modal state.
 * Handles project creation, navigation, and deletion.
 */
export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, addProject, deleteProject, duplicateProject, updateProject, getProjectById, isLoading, setIsLoading } = useProjectsStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const handleCreateProject = async (data: CreateProjectData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingProjectId) {
        // Update existing project
        updateProject(editingProjectId, {
          name: data.name,
          description: data.description,
          category: data.category,
          tags: [data.category],
        });
      } else {
        // Create new project
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
      }
      setShowCreateModal(false);
      setEditingProjectId(null);
    } catch (error) {
      console.error('Failed to submit project:', error);
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

  const handleDuplicateProject = (projectId: string) => {
    duplicateProject(projectId);
  };

  const handleEditProject = (projectId: string) => {
    setEditingProjectId(projectId);
    setShowCreateModal(true);
  };

  return (
    <MainLayout title="SitePlanr">
      <Dashboard
        projects={projects}
        isLoading={isLoading}
        onCreateProject={() => {
          setEditingProjectId(null);
          setShowCreateModal(true);
        }}
        onProjectClick={handleProjectClick}
        onDeleteProject={handleDeleteProject}
        onDuplicateProject={handleDuplicateProject}
        onEditProject={handleEditProject}
      />

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingProjectId(null);
        }}
        onSubmit={handleCreateProject}
        isLoading={isLoading}
        initialData={editingProjectId ? getProjectById(editingProjectId) : undefined}
        isEditing={!!editingProjectId}
      />
    </MainLayout>
  );
};

export default DashboardPage;
