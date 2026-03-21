import React, { useState } from 'react';
import { Dialog } from '../ui/components/Dialog';
import { Button } from '../ui/components/Button';
import { TextInput } from '../ui/components/form/TextInput';
import { TextArea } from '../ui/components/form/TextArea';
import { Select } from '../ui/components/form/Select';
import { Divider } from '../ui/components/Divider';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CreateProjectData) => Promise<void>;
  isLoading?: boolean;
  initialData?: CreateProjectData & { id?: string };
  isEditing?: boolean;
}

export interface CreateProjectData {
  name: string;
  description: string;
  category: string;
}

/**
 * CreateProjectModal Component
 *
 * Modal form for creating a new project with name, description, and category.
 */
export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<CreateProjectData>({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    category: initialData?.category ?? 'general',
  });
  const [errors, setErrors] = useState<Partial<CreateProjectData>>({});

  // Update form data when initialData changes (e.g., when editing different project)
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? '',
        description: initialData.description ?? '',
        category: initialData.category ?? 'general',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'general',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const categoryOptions = [
    { value: 'general', label: 'General Project' },
    { value: 'site-planning', label: 'Site Planning' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'other', label: 'Other' },
  ];

  const validateForm = () => {
    const newErrors: Partial<CreateProjectData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Project name must be at least 3 characters';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit?.(formData);
      // Reset form on success (only for create mode)
      if (!isEditing) {
        setFormData({
          name: '',
          description: '',
          category: 'general',
        });
      }
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  const handleChange = (field: keyof CreateProjectData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project' : 'Create New Project'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-lg">
        {/* Project Name */}
        <TextInput
          label="Project Name"
          placeholder="Enter a unique project name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
          autoFocus
        />

        {/* Description */}
        <TextArea
          label="Description"
          placeholder="Add a description for your project (optional)"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={errors.description}
          rows={4}
          showCharCount
          maxCharacters={500}
        />

        {/* Category */}
        <Select
          label="Category"
          options={categoryOptions}
          value={formData.category}
          onChange={(value) => handleChange('category', value)}
          helpText="Select the project category for better organization"
        />

        {/* Divider */}
        <Divider />

        {/* Actions */}
        <div className="flex gap-md justify-end">
          <Button
            variant="tertiary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isLoading}
          >
            {isEditing ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default CreateProjectModal;
