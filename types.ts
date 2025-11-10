
/**
 * Represents a single version of a song's lyrics.
 */
export interface Version {
  id: string;
  name: string;
  lyrics: string;
  createdAt: number;
}

/**
 * Represents a song, which can contain multiple versions of lyrics.
 */
export interface Song {
  id: string;
  title: string;
  versions: Version[];
  updatedAt: number;
}

/**
 * Defines the possible active views in the main content area.
 */
export type ActiveView = 'editor' | 'cleaner' | 'analyzer';

/**
 * Represents the structure of a basic analysis report for a set of lyrics.
 */
export interface AnalysisReport {
  wordCount: number;
  lineCount: number;
  uniqueWords: number;
  characterCount: number;
  repeatedPhrases: { phrase: string; count: number }[];
  lineLengths: number[];
  tone: {
    positive: number;
    negative: number;
  };
}
