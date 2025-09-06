'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Brain, Gamepad2, Sparkles } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  available: boolean;
}

const games: Game[] = [
  {
    id: 'car-game',
    title: '🚗 Devine la voiture',
    description: 'Reconnais les marques de voitures!',
    icon: <Car className="h-12 w-12" />,
    color: 'from-blue-400 to-purple-400',
    path: '/car-game',
    available: true,
  },
  {
    id: 'simon-game',
    title: '🎨 Simon',
    description: 'Mémorise les couleurs!',
    icon: <Brain className="h-12 w-12" />,
    color: 'from-green-400 to-blue-400',
    path: '/simon-game',
    available: true,
  },
  {
    id: 'coming-soon',
    title: '🎮 Bientôt...',
    description: 'Nouveau jeu arrive!',
    icon: <Gamepad2 className="h-12 w-12" />,
    color: 'from-gray-300 to-gray-400',
    path: '#',
    available: false,
  },
];

export default function HomePage() {
  const router = useRouter();

  const handleGameClick = (game: Game) => {
    if (game.available) {
      router.push(game.path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animate-bounce">
            <Sparkles className="inline h-12 w-12 sm:h-16 sm:w-16 text-yellow-300 mr-2" />
            Les jeux de Gabin
            <Sparkles className="inline h-12 w-12 sm:h-16 sm:w-16 text-yellow-300 ml-2" />
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-white/90">
            Choisis ton jeu préféré! 🎮
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {games.map((game) => (
            <Card
              key={game.id}
              className={`relative overflow-hidden cursor-pointer transform transition-all duration-300 ${
                game.available
                  ? 'hover:scale-105 hover:shadow-2xl'
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => handleGameClick(game)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-20`}
              />
              <div className="relative p-6 sm:p-8">
                <div className="flex flex-col items-center space-y-4">
                  {/* Icon with animation */}
                  <div
                    className={`p-4 rounded-full bg-gradient-to-br ${game.color} ${
                      game.available ? 'animate-pulse' : ''
                    }`}
                  >
                    <div className="text-white">{game.icon}</div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
                    {game.title}
                  </h2>

                  {/* Description */}
                  <p className="text-lg sm:text-xl text-gray-600 text-center">
                    {game.description}
                  </p>

                  {/* Play Button */}
                  <Button
                    disabled={!game.available}
                    className={`w-full py-4 sm:py-6 text-xl sm:text-2xl font-bold rounded-xl ${
                      game.available
                        ? `bg-gradient-to-r ${game.color} hover:opacity-90 text-white`
                        : 'bg-gray-300 text-gray-500'
                    }`}
                  >
                    {game.available ? 'JOUER! 🎮' : 'Bientôt... ⏳'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Fun animations */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-4">
            <div className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>
              🚗
            </div>
            <div className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>
              🎨
            </div>
            <div className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>
              🎮
            </div>
            <div className="text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>
              🎯
            </div>
            <div className="text-4xl animate-bounce" style={{ animationDelay: '0.8s' }}>
              🏆
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}