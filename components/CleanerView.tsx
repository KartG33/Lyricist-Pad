
import React from 'react';

interface CleanerViewProps {
  lyrics: string;
  onLyricsChange: (newLyrics: string) => void;
}

// A map of cleaning functions and their descriptions
const CLEANING_ACTIONS = [
  {
    name: "Trim Whitespace",
    description: "Remove space from start/end of each line.",
    action: (text: string) => text.split('\n').map(line => line.trim()).join('\n'),
  },
  {
    name: "Remove Empty Lines",
    description: "Delete all lines that are completely empty.",
    action: (text: string) => text.split('\n').filter(line => line.trim() !== '').join('\n'),
  },
  {
    name: "Collapse Spaces",
    description: "Replace multiple spaces with a single space.",
    action: (text: string) => text.replace(/ +/g, ' '),
  },
  {
    name: "Remove Punctuation",
    description: "Removes .,?!()[]{} and other symbols.",
    action: (text: string) => text.replace(/[.,?!()[\]{}"']/g, ''),
  },
];

/**
 * The view for applying manual cleaning operations to lyrics.
 */
export const CleanerView: React.FC<CleanerViewProps> = ({ lyrics, onLyricsChange }) => {
  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-text-main">Lyric Cleaner</h2>
        <p className="text-text-dim mt-1">Apply manual formatting rules to the current version.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CLEANING_ACTIONS.map(({ name, description, action }) => (
          <button
            key={name}
            onClick={() => onLyricsChange(action(lyrics))}
            className="p-4 bg-secondary rounded-lg text-left hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <p className="font-semibold text-text-main">{name}</p>
            <p className="text-sm text-text-dim">{description}</p>
          </button>
        ))}
      </div>
      <div className="flex-grow mt-4">
        <h3 className="text-lg font-semibold text-text-main mb-2">Preview</h3>
        <pre className="w-full h-64 p-4 bg-slate-900 rounded-md overflow-y-auto text-text-dim font-mono">{lyrics || "No lyrics to clean."}</pre>
      </div>
    </div>
  );
};
