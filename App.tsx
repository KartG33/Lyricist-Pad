
import React, { useState, useMemo } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { Song, Version, ActiveView } from './types';
import { EditorView } from './components/EditorView';
import { CleanerView } from './components/CleanerView';
import { AnalyzerView } from './components/AnalyzerView';
import { PlusIcon, TrashIcon, EditIcon } from './components/icons';

const App: React.FC = () => {
  const [songs, setSongs] = useLocalStorage<Song[]>('lyric-pad-songs', []);
  const [activeSongId, setActiveSongId] = useState<string | null>(null);
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('editor');

  // Memoize current song and version to avoid re-finding them on every render
  const { currentSong, currentVersion } = useMemo(() => {
    const song = songs.find(s => s.id === activeSongId);
    if (!song) return { currentSong: null, currentVersion: null };
    
    let version = song.versions.find(v => v.id === activeVersionId);
    if (!version) {
        // Fallback to the most recent version if the active one is not found
        version = song.versions.sort((a,b) => b.createdAt - a.createdAt)[0];
    }
    return { currentSong: song, currentVersion: version };
  }, [songs, activeSongId, activeVersionId]);

  // Selects a song and its latest version
  const selectSong = (songId: string) => {
    setActiveSongId(songId);
    const song = songs.find(s => s.id === songId);
    if (song && song.versions.length > 0) {
      // Select the most recently created version by default
      const latestVersion = song.versions.sort((a,b) => b.createdAt - a.createdAt)[0];
      setActiveVersionId(latestVersion.id);
    } else {
      setActiveVersionId(null);
    }
    setActiveView('editor');
  };

  // Creates a new song
  const handleAddSong = () => {
    const newVersion: Version = { id: Date.now().toString(), name: 'Verse 1', lyrics: '', createdAt: Date.now() };
    const newSong: Song = {
      id: Date.now().toString(),
      title: 'New Song',
      versions: [newVersion],
      updatedAt: Date.now(),
    };
    setSongs(prev => [newSong, ...prev]);
    setActiveSongId(newSong.id);
    setActiveVersionId(newVersion.id);
  };
  
  // Renames a song
  const handleRenameSong = (songId: string, newTitle: string) => {
    setSongs(songs.map(s => s.id === songId ? { ...s, title: newTitle, updatedAt: Date.now() } : s));
  };
  
  // Deletes a song
  const handleDeleteSong = (songId: string) => {
    if (window.confirm('Are you sure you want to delete this song and all its versions?')) {
        setSongs(songs.filter(s => s.id !== songId));
        if (activeSongId === songId) {
            setActiveSongId(null);
            setActiveVersionId(null);
        }
    }
  };

  // Updates the lyrics of the current version
  const handleLyricsChange = (newLyrics: string) => {
    if (!currentSong || !currentVersion) return;
    setSongs(songs.map(s => s.id === currentSong.id
        ? {
            ...s,
            updatedAt: Date.now(),
            versions: s.versions.map(v => v.id === currentVersion.id
                ? { ...v, lyrics: newLyrics }
                : v
            )
        }
        : s
    ));
  };

  // Adds a new version to the current song
  const handleVersionAdd = () => {
    if (!currentSong) return;
    const newVersion: Version = {
      id: Date.now().toString(),
      name: `Version ${currentSong.versions.length + 1}`,
      lyrics: currentVersion?.lyrics || '',
      createdAt: Date.now(),
    };
    setSongs(songs.map(s => s.id === currentSong.id
      ? { ...s, versions: [...s.versions, newVersion], updatedAt: Date.now() }
      : s
    ));
    setActiveVersionId(newVersion.id);
  };
  
  // Renames a version
  const handleVersionRename = (versionId: string, newName: string) => {
     if (!currentSong) return;
     setSongs(songs.map(s => s.id === currentSong.id 
        ? {...s, updatedAt: Date.now(), versions: s.versions.map(v => v.id === versionId ? {...v, name: newName} : v)}
        : s
     ))
  }

  // Deletes a version
  const handleVersionDelete = (versionId: string) => {
    if (!currentSong || currentSong.versions.length <= 1) return;
    if (window.confirm('Are you sure you want to delete this version?')) {
        let newActiveVersionId = activeVersionId;
        const updatedSongs = songs.map(s => {
            if (s.id === currentSong.id) {
                const newVersions = s.versions.filter(v => v.id !== versionId);
                if (versionId === activeVersionId) {
                    newActiveVersionId = newVersions[0]?.id || null;
                }
                return { ...s, versions: newVersions, updatedAt: Date.now() };
            }
            return s;
        });
        setSongs(updatedSongs);
        setActiveVersionId(newActiveVersionId);
    }
  };

  return (
    <div className="flex h-screen bg-primary text-text-main font-sans">
      {/* Sidebar for Song List */}
      <aside className="w-1/3 max-w-xs min-w-[250px] bg-slate-900 flex flex-col">
        <div className="p-4 border-b border-secondary flex justify-between items-center">
          <h1 className="text-xl font-bold">Lyricist's Pad</h1>
          <button onClick={handleAddSong} className="p-2 text-text-dim hover:text-text-main hover:bg-secondary rounded-full">
            <PlusIcon />
          </button>
        </div>
        <div className="overflow-y-auto flex-grow">
          {songs.sort((a,b) => b.updatedAt - a.updatedAt).map(song => (
            <SongListItem
              key={song.id}
              song={song}
              isActive={song.id === activeSongId}
              onSelect={() => selectSong(song.id)}
              onDelete={() => handleDeleteSong(song.id)}
              onRename={(newTitle) => handleRenameSong(song.id, newTitle)}
            />
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-primary">
        {currentSong && currentVersion ? (
          <>
            <div className="flex items-center p-4 border-b border-secondary">
              <TabButton isActive={activeView === 'editor'} onClick={() => setActiveView('editor')}>Text</TabButton>
              <TabButton isActive={activeView === 'cleaner'} onClick={() => setActiveView('cleaner')}>Clean</TabButton>
              <TabButton isActive={activeView === 'analyzer'} onClick={() => setActiveView('analyzer')}>Analyze</TabButton>
            </div>
            <div className="flex-grow overflow-y-auto">
              {activeView === 'editor' && <EditorView song={currentSong} currentVersion={currentVersion} onLyricsChange={handleLyricsChange} onVersionSelect={setActiveVersionId} onVersionAdd={handleVersionAdd} onVersionRename={handleVersionRename} onVersionDelete={handleVersionDelete}/>}
              {activeView === 'cleaner' && <CleanerView lyrics={currentVersion.lyrics} onLyricsChange={handleLyricsChange} />}
              {activeView === 'analyzer' && <AnalyzerView lyrics={currentVersion.lyrics} />}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-text-dim">
            <div className="text-center">
              <h2 className="text-2xl">Welcome to Lyricist's Pad</h2>
              <p>Select a song or create a new one to begin.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Sub-component for a single song in the list
const SongListItem: React.FC<{song: Song, isActive: boolean, onSelect: () => void, onDelete: () => void, onRename: (title: string) => void}> = ({ song, isActive, onSelect, onDelete, onRename }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(song.title);
    
    const handleSave = () => {
        if(title.trim()){
            onRename(title.trim());
        }
        setIsEditing(false);
    }

    return (
        <div className={`p-3 border-b border-secondary flex items-center justify-between cursor-pointer ${isActive ? 'bg-accent text-white' : 'hover:bg-secondary'}`} >
           <div className="flex-grow" onClick={onSelect}>
             {isEditing ? (
                 <input
                     type="text"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     onBlur={handleSave}
                     onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                     className={`w-full bg-transparent outline-none ${isActive ? 'text-white' : 'text-text-main'}`}
                     autoFocus
                 />
             ) : (
                 <>
                    <p className={`font-semibold truncate ${isActive ? 'text-white' : 'text-text-main'}`}>{song.title}</p>
                    <p className={`text-xs truncate ${isActive ? 'text-indigo-200' : 'text-text-dim'}`}>
                        {song.versions.length} version(s)
                    </p>
                 </>
             )}
            </div>
            <div className="flex items-center ml-2 space-x-2">
                <button onClick={() => setIsEditing(true)} className={`p-1 rounded-md ${isActive ? 'hover:bg-indigo-500' : 'hover:bg-slate-600'}`}><EditIcon className="h-4 w-4"/></button>
                <button onClick={onDelete} className={`p-1 rounded-md ${isActive ? 'hover:bg-indigo-500' : 'hover:bg-slate-600'}`}><TrashIcon className="h-4 w-4"/></button>
            </div>
        </div>
    );
};

// Sub-component for a navigation tab
const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md ${
      isActive ? 'bg-accent text-white' : 'text-text-dim hover:bg-secondary'
    }`}
  >
    {children}
  </button>
);


export default App;
