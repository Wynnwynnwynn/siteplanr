import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectsStore } from '../store/projectsStore';
import { Button } from '../ui/components/Button';
import { TextInput } from '../ui/components/form/TextInput';
import { TextArea } from '../ui/components/form/TextArea';
import { Select } from '../ui/components/form/Select';
import { Card } from '../ui/components/Card';
import { FileBrowser } from '../ui/components/FileBrowser';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'mixed-use', label: 'Mixed-Use' },
];

export const ProjectSettings: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById, updateProject } = useProjectsStore();

  const project = projectId ? getProjectById(projectId) : null;

  const [formData, setFormData] = useState({
    name: project?.name ?? '',
    description: project?.description ?? '',
    category: project?.category ?? 'general',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen bg-pf-graphite flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pf-white mb-2">Project not found</h1>
          <Button onClick={() => navigate('/')} variant="primary">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      updateProject(projectId!, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        tags: [formData.category],
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save project settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: project.name,
      description: project.description,
      category: project.category,
    });
    setSaveSuccess(false);
  };

  const hasChanges =
    formData.name !== project.name ||
    formData.description !== project.description ||
    formData.category !== project.category;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pf-graphite to-pf-graphite/95">
      {/* Header */}
      <div className="border-b border-pf-steel/30 bg-pf-navy sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(`/editor/${projectId}`)}
            className="w-8 h-8 flex items-center justify-center rounded
                       text-pf-steel hover:text-pf-sand hover:bg-pf-steel/20 transition-colors"
            title="Back to editor"
          >
            ‹
          </button>
          <div>
            <h1 className="text-lg font-bold text-pf-white">Project Settings</h1>
            <p className="text-xs text-pf-steel">{project.name}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Success message */}
        {saveSuccess && (
          <div className="mb-6 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm">
            ✓ Project settings saved
          </div>
        )}

        {/* Main form card */}
        <Card className="p-6 mb-8">
          <div className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-semibold text-pf-white mb-2">
                Project Name
              </label>
              <TextInput
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter project name"
                className="w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-pf-white mb-2">
                Description
              </label>
              <TextArea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your project..."
                rows={4}
                className="w-full"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-pf-white mb-2">
                Category
              </label>
              <Select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                options={CATEGORIES}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* File Browser */}
        <FileBrowser projectId={projectId!} />

        {/* Project Info Card */}
        <Card className="p-6 mt-8 mb-8 bg-pf-steel/10">
          <h3 className="text-sm font-semibold text-pf-white mb-4">Project Info</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-pf-steel mb-1">Created</p>
              <p className="text-pf-sand font-medium">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-pf-steel mb-1">Last Modified</p>
              <p className="text-pf-sand font-medium">
                {new Date(project.lastModified).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-pf-steel mb-1">Items Placed</p>
              <p className="text-pf-sand font-medium">{project.itemCount}</p>
            </div>
            <div>
              <p className="text-pf-steel mb-1">Tags</p>
              <p className="text-pf-sand font-medium">
                {project.tags?.join(', ') || 'None'}
              </p>
            </div>
          </div>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            isLoading={isSaving}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
