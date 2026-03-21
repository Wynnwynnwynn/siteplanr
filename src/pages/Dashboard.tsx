import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Clock } from 'lucide-react';
import { Button } from '../ui/components/Button';
import { TextInput } from '../ui/components/form/TextInput';
import { Card } from '../ui/components/Card';
import { Skeleton } from '../ui/components/Loading';
import { Badge } from '../ui/components/Badge';
import { Divider } from '../ui/components/Divider';

interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  tags: string[];
  lastModified: string;
  itemCount?: number;
}

interface DashboardProps {
  projects?: Project[];
  isLoading?: boolean;
  onCreateProject?: () => void;
  onProjectClick?: (projectId: string) => void;
  onDeleteProject?: (projectId: string) => void;
  onDuplicateProject?: (projectId: string) => void;
  onEditProject?: (projectId: string) => void;
}

/**
 * Dashboard Page
 *
 * Main dashboard showing project grid, search, filters, and quick actions.
 * Responsive layout with project cards, create button, and search/filter controls.
 */
export const Dashboard: React.FC<DashboardProps> = ({
  projects = [],
  isLoading = false,
  onCreateProject,
  onProjectClick,
  onDeleteProject,
  onDuplicateProject,
  onEditProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Filter projects based on search and selected tag
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || project.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Get all unique tags
  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.tags))
  );

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900">
      {/* Header Section */}
      <div className="sticky top-16 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-lg z-20">
        <div className="flex items-center justify-between mb-lg">
          <div>
            <h1 className="text-h3 font-bold text-neutral-900 dark:text-neutral-50">
              Projects
            </h1>
            <p className="text-body_sm text-neutral-500 dark:text-neutral-400 mt-xs">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <Button
            variant="primary"
            icon={<Plus size={20} />}
            onClick={onCreateProject}
          >
            New Project
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col gap-md">
          {/* Search Input */}
          <TextInput
            placeholder="Search projects..."
            icon={<Search size={18} />}
            iconPosition="left"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />

          {/* Tag Filters */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-sm">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-md py-xs rounded-full text-body_sm transition-colors ${
                  selectedTag === null
                    ? 'bg-primary text-neutral-0'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                All
              </button>

              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-md py-xs rounded-full text-body_sm transition-colors ${
                    selectedTag === tag
                      ? 'bg-primary text-neutral-0'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-auto">
        <div className="p-lg">
          {isLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
              {[...Array(8)].map((_, i) => (
                <Card key={i} variant="elevated">
                  <Skeleton variant="rect" height={180} className="rounded-t-lg -m-lg mb-md" />
                  <Card.Body>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" count={2} />
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-lg">
                <Plus size={32} className="text-neutral-400" />
              </div>
              <h3 className="text-h4 font-semibold text-neutral-900 dark:text-neutral-50 mb-sm">
                No projects yet
              </h3>
              <p className="text-body_md text-neutral-600 dark:text-neutral-400 mb-lg max-w-sm">
                {searchQuery
                  ? 'No projects match your search. Try adjusting your filters.'
                  : 'Get started by creating your first project.'}
              </p>
              {!searchQuery && (
                <Button variant="primary" icon={<Plus size={20} />} onClick={onCreateProject}>
                  Create Project
                </Button>
              )}
            </div>
          ) : (
            // Projects grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => onProjectClick?.(project.id)}
                  onDelete={() => onDeleteProject?.(project.id)}
                  onDuplicate={() => onDuplicateProject?.(project.id)}
                  onEdit={() => onEditProject?.(project.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * ProjectCard Component
 *
 * Individual project card displaying thumbnail, name, description, tags, and actions.
 */
interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onEdit?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onDelete, onDuplicate, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Card
      variant="elevated"
      clickable
      onClick={onClick}
      className="flex flex-col overflow-hidden h-full hover:shadow-lg transition-shadow"
    >
      {/* Thumbnail */}
      <div className="relative bg-neutral-100 dark:bg-neutral-800 aspect-video overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <span className="text-h4">📦</span>
          </div>
        )}

        {/* Action Menu Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="absolute top-md right-md p-xs bg-neutral-0/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-md hover:bg-neutral-0 dark:hover:bg-neutral-800 transition-colors"
          aria-label="More options"
        >
          <MoreVertical size={18} />
        </button>

        {/* Quick Actions Menu */}
        {showMenu && (
          <div className="absolute top-12 right-md bg-neutral-0 dark:bg-neutral-800 rounded-lg shadow-lg z-10 min-w-32 overflow-hidden border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
                setShowMenu(false);
              }}
              className="w-full text-left px-md py-sm hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors text-body_sm text-neutral-900 dark:text-neutral-50"
            >
              Edit
            </button>
            <Divider className="my-0" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate?.();
                setShowMenu(false);
              }}
              className="w-full text-left px-md py-sm hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors text-body_sm text-neutral-900 dark:text-neutral-50"
            >
              Duplicate
            </button>
            <Divider className="my-0" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
                setShowMenu(false);
              }}
              className="w-full text-left px-md py-sm hover:bg-error-100 dark:hover:bg-error-900/30 transition-colors text-body_sm text-error"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <Card.Body className="flex-1 flex flex-col">
        <h3 className="text-label_lg font-semibold text-neutral-900 dark:text-neutral-50 line-clamp-1">
          {project.name}
        </h3>

        <p className="text-body_sm text-neutral-600 dark:text-neutral-400 mt-xs line-clamp-2">
          {project.description || 'No description'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-xs mt-md">
          {project.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="subtle" color="primary" size="sm">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 2 && (
            <Badge variant="subtle" color="neutral" size="sm">
              +{project.tags.length - 2}
            </Badge>
          )}
        </div>
      </Card.Body>

      {/* Footer - Metadata */}
      <Card.Footer className="flex items-center justify-between text-caption text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-xs">
          <Clock size={14} />
          {new Date(project.lastModified).toLocaleDateString()}
        </div>
        {project.itemCount && (
          <span className="font-medium">
            {project.itemCount} item{project.itemCount !== 1 ? 's' : ''}
          </span>
        )}
      </Card.Footer>
    </Card>
  );
};

export default Dashboard;
