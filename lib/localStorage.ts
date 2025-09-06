import { UserStats } from './types';

const STATS_KEY = 'car-game-stats';

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') {
    return getDefaultStats();
  }

  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }

  return getDefaultStats();
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
}

export function updateUserStats(score: number, correctAnswers: number, totalQuestions: number): UserStats {
  const stats = loadUserStats();
  
  stats.gamesPlayed++;
  stats.totalScore += score;
  stats.correctAnswers += correctAnswers;
  stats.totalAnswers += totalQuestions;
  
  if (score > stats.highScore) {
    stats.highScore = score;
  }
  
  saveUserStats(stats);
  return stats;
}

function getDefaultStats(): UserStats {
  return {
    highScore: 0,
    gamesPlayed: 0,
    totalScore: 0,
    correctAnswers: 0,
    totalAnswers: 0,
  };
}