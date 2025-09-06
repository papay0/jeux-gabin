export interface Question {
  id: number;
  imageUrl: string;
  correctAnswer: string;
  options: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  currentQuestion: number;
  score: number;
  streak: number;
  answers: Answer[];
  startTime: Date | null;
  endTime: Date | null;
  inputMode: 'multiple-choice' | 'direct-input';
}

export interface Answer {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
  timeToAnswer: number;
}

export interface UserStats {
  highScore: number;
  gamesPlayed: number;
  totalScore: number;
  correctAnswers: number;
  totalAnswers: number;
}

export type GameScreen = 'menu' | 'game' | 'results';