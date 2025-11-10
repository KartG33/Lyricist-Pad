
import React, { useState } from 'react';
import { Version, Song } from '../types';
import { EditIcon, TrashIcon, WandIcon } from './icons';

interface EditorViewProps {
  song: Song;
  currentVersion: Version;
  onLyricsChange: (newLyrics: string) => void;
  onVersionSelect: (versionId: string) => void;
  onVersionAdd: () => void;
  onVersionRename: (versionId: string, newName: string) => void;
  onVersionDelete: (versionId: string) => void;
}

/**
 * The view for editing lyrics and managing song versions.
 */
export const EditorView: React.FC<EditorViewProps> = ({
  song,
  currentVersion,
  onLyricsChange,
  onVersionSelect,
  onVersionAdd,
  onVersionRename,
  onVersionDelete,
}) => {
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [tempVersionName, setTempVersionName] = useState('');

  // Handles starting the rename process for a version
  const handleStartRename = (version: Version) => {
    setEditingVersionId(version.id);
    setTempVersionName(version.name);
  };

  // Handles saving the new name for a version
  const handleSaveRename = (versionId: string) => {
    if (tempVersionName.trim()) {
      onVersionRename(versionId, tempVersionName.trim());
    }
    setEditingVersionId(null);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Version Management Header */}
      <div className="flex items-center justify-between p-3 border-b border-secondary">
        <div className="flex items-center gap-2">
          <label htmlFor="version-select" className="text-sm text-text-dim">Version:</label>
          <select
            id="version-select"
            value={currentVersion.id}
            onChange={(e) => onVersionSelect(e.target.value)}
            className="bg-primary border border-secondary rounded-md px-2 py-1 text-text-main focus:ring-1 focus:ring-accent focus:outline-none"
          >
            {song.versions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
          <button onClick={() => handleStartRename(currentVersion)} className="text-text-dim hover:text-text-main"><EditIcon/></button>
          {song.versions.length > 1 && (
            <button onClick={() => onVersionDelete(currentVersion.id)} className="text-text-dim hover:text-red-500"><TrashIcon/></button>
          )}
        </div>
        <button
          onClick={onVersionAdd}
          className="bg-accent hover:bg-indigo-500 text-white text-sm font-semibold py-1 px-3 rounded-md transition-colors"
        >
          New Version
        </button>
      </div>

      {editingVersionId === currentVersion.id && (
         <div className="p-2 bg-slate-900/50 flex items-center gap-2">
            <input
                type="text"
                value={tempVersionName}
                onChange={(e) => setTempVersionName(e.target.value)}
                onBlur={() => handleSaveRename(currentVersion.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(currentVersion.id)}
                className="bg-primary w-full border border-secondary rounded-md px-2 py-1 text-text-main"
                autoFocus
            />
            <button onClick={() => handleSaveRename(currentVersion.id)} className="bg-green-600 hover:bg-green-500 text-white text-sm px-3 py-1 rounded-md">Save</button>
         </div>
      )}

      {/* Lyrics Text Area */}
      <div className="flex-grow relative">
        <textarea
          value={currentVersion.lyrics}
          onChange={(e) => onLyricsChange(e.target.value)}
          className="w-full h-full p-4 bg-primary text-text-main text-lg resize-none focus:outline-none placeholder-text-dim font-mono"
          placeholder="Start writing..."
        />
        {/* Placeholder for future Gemini AI integration */}
        <button
            title="AI Tools (Coming Soon)"
            disabled
            className="absolute bottom-4 right-4 bg-secondary text-text-dim p-3 rounded-full cursor-not-allowed opacity-50 flex items-center gap-2"
        >
            <WandIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
