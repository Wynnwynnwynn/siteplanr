import React, { useRef, useState } from 'react';
import { useProjectsStore } from '../../store/projectsStore';
import { Card } from './Card';
import { Button } from './Button';

interface FileBrowserProps {
  projectId: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const FileBrowser: React.FC<FileBrowserProps> = ({ projectId }) => {
  const { getProjectFiles, addFile, deleteFile } = useProjectsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const files = getProjectFiles(projectId);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.currentTarget.files;
    if (!selectedFiles) return;

    setIsLoading(true);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const reader = new FileReader();

        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          addFile(projectId, {
            id: Date.now().toString() + i,
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            dataUrl,
          });
        };

        reader.readAsDataURL(file);
      }
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = (fileId: string) => {
    if (window.confirm('Delete this file?')) {
      deleteFile(projectId, fileId);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-pf-white mb-3">Project Files</h3>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            disabled={isLoading}
            className="hidden"
            accept="*/*"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="secondary"
            disabled={isLoading}
            isLoading={isLoading}
          >
            Upload Files
          </Button>
          <p className="text-xs text-pf-steel flex items-center">
            {files.length} {files.length === 1 ? 'file' : 'files'}
          </p>
        </div>
      </div>

      {files.length > 0 ? (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-pf-steel/10 rounded-lg
                         hover:bg-pf-steel/20 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-pf-sand font-medium truncate">{file.name}</p>
                <p className="text-xs text-pf-steel">
                  {formatFileSize(file.size)} •{' '}
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => {
                    if (file.dataUrl) {
                      const a = document.createElement('a');
                      a.href = file.dataUrl;
                      a.download = file.name;
                      a.click();
                    }
                  }}
                  title="Download"
                  className="w-7 h-7 flex items-center justify-center rounded text-xs
                             text-pf-steel hover:text-pf-sand hover:bg-pf-steel/20 transition-colors"
                >
                  ↓
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  title="Delete"
                  className="w-7 h-7 flex items-center justify-center rounded text-xs
                             text-pf-steel hover:text-pf-orange hover:bg-pf-steel/20 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-pf-steel mb-2">No files uploaded yet</p>
          <p className="text-xs text-pf-steel/60">
            Upload site plans, renderings, or other project files
          </p>
        </div>
      )}
    </Card>
  );
};
