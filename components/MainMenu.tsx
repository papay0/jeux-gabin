'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserStats } from '@/lib/types';
import { Trophy, PlayCircle, Star } from 'lucide-react';

interface MainMenuProps {
  onStartGame: () => void;
  stats: UserStats;
  loading?: boolean;
}

export default function MainMenu({ onStartGame, stats, loading = false }: MainMenuProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-2 sm:p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-4 sm:p-6 md:p-8 lg:p-12 bg-white/95 backdrop-blur shadow-2xl">
        <div className="text-center space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-tight">
              🚗 Gabin, devine la voiture
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 px-2">
              Peux-tu reconnaître toutes les marques de voitures?
            </p>
          </div>

          <Button
            onClick={onStartGame}
            disabled={loading}
            className="w-full py-6 sm:py-8 md:py-10 lg:py-12 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg transform transition active:scale-95 sm:hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlayCircle className="mr-2 sm:mr-3 md:mr-4 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
            {loading ? 'Chargement...' : 'JOUER! 🎮'}
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 pt-6 sm:pt-8">
            <Card className="p-4 sm:p-5 md:p-6 bg-yellow-100 border-yellow-300 border-2">
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <Trophy className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-yellow-600" />
                <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">Meilleur Score</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-600">{stats.highScore}</p>
              </div>
            </Card>

            <Card className="p-4 sm:p-5 md:p-6 bg-blue-100 border-blue-300 border-2">
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <Star className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-600" />
                <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">Parties Jouées</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">{stats.gamesPlayed}</p>
              </div>
            </Card>

            <Card className="p-4 sm:p-5 md:p-6 bg-green-100 border-green-300 border-2 sm:col-span-2 md:col-span-1">
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl md:text-4xl">✅</div>
                <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">Précision</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">
                  {stats.totalAnswers > 0
                    ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100)
                    : 0}%
                </p>
              </div>
            </Card>
          </div>

          <div className="pt-3 sm:pt-4">
            <p className="text-base sm:text-lg text-gray-600 px-2">
              💡 Astuce: Écris toi-même la réponse pour gagner plus de points!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}