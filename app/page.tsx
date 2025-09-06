'use client';

import { useState, useEffect } from 'react';
import MainMenu from '@/components/MainMenu';
import GameScreen from '@/components/GameScreen';
import ResultsScreen from '@/components/ResultsScreen';
import { GameScreen as GameScreenType, GameState, UserStats, Question } from '@/lib/types';
import { loadUserStats, updateUserStats } from '@/lib/localStorage';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<GameScreenType>('menu');
  const [userStats, setUserStats] = useState<UserStats>(loadUserStats());
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserStats(loadUserStats());
  }, []);

  const handleStartGame = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/game-questions');
      const data = await response.json();
      
      if (data.success) {
        setGameQuestions(data.questions);
        setCurrentScreen('game');
      } else {
        console.error('Failed to load game questions');
      }
    } catch (error) {
      console.error('Error loading game questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameEnd = (finalState: GameState) => {
    setGameState(finalState);
    const correctAnswers = finalState.answers.filter(a => a.isCorrect).length;
    const updatedStats = updateUserStats(finalState.score, correctAnswers, finalState.answers.length);
    setUserStats(updatedStats);
    setCurrentScreen('results');
  };

  const handlePlayAgain = () => {
    setCurrentScreen('game');
    setGameState(null);
  };

  const handleMainMenu = () => {
    setCurrentScreen('menu');
    setGameState(null);
  };

  return (
    <main className="min-h-screen">
      {currentScreen === 'menu' && (
        <MainMenu onStartGame={handleStartGame} stats={userStats} loading={loading} />
      )}
      {currentScreen === 'game' && gameQuestions.length > 0 && (
        <GameScreen questions={gameQuestions} onGameEnd={handleGameEnd} />
      )}
      {currentScreen === 'results' && gameState && (
        <ResultsScreen 
          gameState={gameState}
          stats={userStats}
          onPlayAgain={handlePlayAgain}
          onMainMenu={handleMainMenu}
        />
      )}
    </main>
  );
}