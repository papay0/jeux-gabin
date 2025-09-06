'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GameState, UserStats } from '@/lib/types';
import { Trophy, Target, Zap, RotateCcw, Home, CheckCircle2, XCircle } from 'lucide-react';

interface ResultsScreenProps {
  gameState: GameState;
  stats: UserStats;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export default function ResultsScreen({ gameState, stats, onPlayAgain, onMainMenu }: ResultsScreenProps) {
  const correctAnswers = gameState.answers.filter(a => a.isCorrect).length;
  const accuracy = Math.round((correctAnswers / gameState.answers.length) * 100);
  const isNewHighScore = gameState.score === stats.highScore && stats.gamesPlayed > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-2 sm:p-4 flex items-center justify-center">
      <Card className="w-full max-w-4xl p-4 sm:p-6 md:p-8 lg:p-12 bg-white/95 backdrop-blur">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Title & Score */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-tight">
              Partie Terminée! 🏁
            </h1>
            
            {isNewHighScore && (
              <div className="animate-pulse mb-3 sm:mb-4">
                <p className="text-2xl sm:text-3xl font-bold text-yellow-500">
                  🌟 NOUVEAU RECORD! 🌟
                </p>
              </div>
            )}
            
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-purple-600 mb-2">
              {gameState.score} points
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Card className="p-4 sm:p-5 md:p-6 bg-green-100 border-green-300 border-2 sm:col-span-2 lg:col-span-1">
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <Target className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-green-600" />
                <p className="text-lg sm:text-xl font-semibold">Précision</p>
                <p className="text-3xl sm:text-4xl font-bold text-green-600">{accuracy}%</p>
                <p className="text-sm sm:text-base md:text-lg text-gray-600">
                  {correctAnswers}/{gameState.answers.length} correctes
                </p>
              </div>
            </Card>

            <Card className="p-4 sm:p-5 md:p-6 bg-yellow-100 border-yellow-300 border-2">
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <Trophy className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-yellow-600" />
                <p className="text-lg sm:text-xl font-semibold">Meilleur Score</p>
                <p className="text-3xl sm:text-4xl font-bold text-yellow-600">{stats.highScore}</p>
              </div>
            </Card>

            <Card className="p-4 sm:p-5 md:p-6 bg-orange-100 border-orange-300 border-2">
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <Zap className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-orange-600" />
                <p className="text-lg sm:text-xl font-semibold">Meilleure Série</p>
                <p className="text-3xl sm:text-4xl font-bold text-orange-600">
                  {Math.max(...gameState.answers.map((_, i) => {
                    let streak = 0;
                    for (let j = i; j < gameState.answers.length; j++) {
                      if (gameState.answers[j].isCorrect) streak++;
                      else break;
                    }
                    return streak;
                  }))}
                </p>
              </div>
            </Card>
          </div>

          {/* Answer Review */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-700">Tes Réponses:</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3">
              {gameState.answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-2 sm:p-3 rounded-lg border-2 ${
                    answer.isCorrect
                      ? 'bg-green-100 border-green-400'
                      : 'bg-red-100 border-red-400'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    {answer.isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-600" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-center">
                    Q{index + 1}
                  </p>
                  <p className="text-xs text-center text-gray-600 truncate">
                    {answer.isCorrect ? `+${answer.points}` : answer.correctAnswer.length > 8 ? `${answer.correctAnswer.substring(0, 6)}...` : answer.correctAnswer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 sm:space-y-4">
            <Button
              onClick={onPlayAgain}
              className="w-full py-4 sm:py-6 md:py-8 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform transition active:scale-95 sm:hover:scale-105"
            >
              <RotateCcw className="mr-2 sm:mr-3 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
              Rejouer! 🎮
            </Button>
            
            <Button
              onClick={onMainMenu}
              variant="outline"
              className="w-full py-3 sm:py-4 md:py-6 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold border-4"
            >
              <Home className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
              Menu Principal
            </Button>
          </div>

          {/* Encouragement Message */}
          <div className="pt-3 sm:pt-4">
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 font-medium px-2">
              {accuracy >= 80 ? '🏆 Incroyable! Tu es un expert des voitures!' :
               accuracy >= 60 ? '👏 Bravo! Tu connais bien les voitures!' :
               accuracy >= 40 ? '💪 Pas mal! Continue à t\'entraîner!' :
               '🚀 Continue à jouer pour t\'améliorer!'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}