
import { AnalysisReport } from '../types';

// Simple lists of words for basic tone analysis
const POSITIVE_WORDS = new Set(['love', 'happy', 'joy', 'beautiful', 'sun', 'light', 'hope', 'dream', 'good', 'great']);
const NEGATIVE_WORDS = new Set(['hate', 'sad', 'pain', 'dark', 'lost', 'fear', 'bad', 'cry', 'storm', 'end']);

/**
 * Tokenizes text into words, removing punctuation and converting to lowercase.
 * @param text The input string.
 * @returns An array of words.
 */
const getWords = (text: string): string[] => {
  return text.toLowerCase().match(/\b(\w+)\b/g) || [];
};

/**
 * Finds phrases that are repeated in the text.
 * @param words An array of words from the text.
 * @returns An array of objects with the repeated phrase and its count.
 */
const findRepeatedPhrases = (words: string[]): { phrase: string; count: number }[] => {
  const phraseCounts: { [key: string]: number } = {};
  const phraseLength = 3; // Analyzes phrases of 3 words

  if (words.length < phraseLength) return [];

  for (let i = 0; i <= words.length - phraseLength; i++) {
    const phrase = words.slice(i, i + phraseLength).join(' ');
    phraseCounts[phrase] = (phraseCounts[phrase] || 0) + 1;
  }

  return Object.entries(phraseCounts)
    .filter(([, count]) => count > 1)
    .map(([phrase, count]) => ({ phrase, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Return top 5 repeated phrases
};

/**
 * Performs a basic emotional tone analysis based on keyword matching.
 * @param words An array of words from the text.
 * @returns An object with counts of positive and negative words.
 */
const getBasicTone = (words: string[]): { positive: number; negative: number } => {
  return words.reduce(
    (acc, word) => {
      if (POSITIVE_WORDS.has(word)) acc.positive++;
      if (NEGATIVE_WORDS.has(word)) acc.negative++;
      return acc;
    },
    { positive: 0, negative: 0 }
  );
};

/**
 * Analyzes a string of lyrics and returns a comprehensive report.
 * @param lyrics The lyrics to analyze.
 * @returns An AnalysisReport object.
 */
export const analyzeLyrics = (lyrics: string): AnalysisReport => {
  if (!lyrics.trim()) {
    return {
      wordCount: 0,
      lineCount: 0,
      uniqueWords: 0,
      characterCount: 0,
      repeatedPhrases: [],
      lineLengths: [],
      tone: { positive: 0, negative: 0 },
    };
  }

  const words = getWords(lyrics);
  const lines = lyrics.split('\n').filter(line => line.trim() !== '');
  const uniqueWords = new Set(words).size;

  return {
    wordCount: words.length,
    lineCount: lines.length,
    uniqueWords: uniqueWords,
    characterCount: lyrics.length,
    repeatedPhrases: findRepeatedPhrases(words),
    lineLengths: lines.map(line => line.length),
    tone: getBasicTone(words),
  };
};
