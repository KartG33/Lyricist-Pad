
import React, { useMemo } from 'react';
import { analyzeLyrics } from '../services/analysisService';

interface AnalyzerViewProps {
  lyrics: string;
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-secondary p-4 rounded-lg">
    <p className="text-sm text-text-dim">{label}</p>
    <p className="text-2xl font-bold text-text-main">{value}</p>
  </div>
);

/**
 * The view for displaying analysis of the current lyrics.
 */
export const AnalyzerView: React.FC<AnalyzerViewProps> = ({ lyrics }) => {
  // Memoize the analysis to avoid re-calculating on every render
  const report = useMemo(() => analyzeLyrics(lyrics), [lyrics]);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-text-main mb-4">Lyric Analysis</h2>
      
      {/* Basic Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Word Count" value={report.wordCount} />
        <StatCard label="Line Count" value={report.lineCount} />
        <StatCard label="Unique Words" value={report.uniqueWords} />
        <StatCard label="Characters" value={report.characterCount} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Repeated Phrases */}
        <div className="bg-secondary p-4 rounded-lg">
          <h3 className="font-semibold text-text-main mb-2">Repeated Phrases (3 words)</h3>
          {report.repeatedPhrases.length > 0 ? (
            <ul className="space-y-2">
              {report.repeatedPhrases.map(({ phrase, count }) => (
                <li key={phrase} className="flex justify-between items-center text-sm">
                  <span className="text-text-dim italic">"{phrase}"</span>
                  <span className="font-mono bg-primary px-2 py-0.5 rounded text-accent">{count}x</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-dim">No repeated phrases found.</p>
          )}
        </div>

        {/* Basic Tone */}
        <div className="bg-secondary p-4 rounded-lg">
          <h3 className="font-semibold text-text-main mb-2">Basic Tone Analysis</h3>
           <p className="text-xs text-text-dim mb-2">(Based on simple keyword matching)</p>
          <div className="flex gap-4">
            <div className="flex-1">
                <p className="text-sm text-green-400">Positive Words: {report.tone.positive}</p>
                <div className="w-full bg-primary rounded-full h-2.5 mt-1">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, report.tone.positive * 5)}%` }}></div>
                </div>
            </div>
             <div className="flex-1">
                <p className="text-sm text-red-400">Negative Words: {report.tone.negative}</p>
                 <div className="w-full bg-primary rounded-full h-2.5 mt-1">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, report.tone.negative * 5)}%` }}></div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Line Symmetry */}
      <div className="bg-secondary p-4 rounded-lg mt-6">
          <h3 className="font-semibold text-text-main mb-2">Line Lengths</h3>
           {report.lineLengths.length > 0 ? (
            <div className="space-y-1">
              {report.lineLengths.map((length, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-text-dim">
                  <span className="w-6 font-mono text-right">{index + 1}</span>
                  <div className="flex-grow bg-primary rounded-full h-3">
                    <div
                      className="bg-accent h-3 rounded-full"
                      style={{ width: `${(length / Math.max(...report.lineLengths, 1)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-8 font-mono">{length}</span>
                </div>
              ))}
            </div>
           ) : (
             <p className="text-sm text-text-dim">No lines to analyze.</p>
           )}
        </div>
    </div>
  );
};
