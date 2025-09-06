'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, RotateCcw, Volume2, VolumeX, Trophy } from 'lucide-react';

type Color = 'red' | 'blue' | 'green' | 'yellow';

interface ColorButton {
  color: Color;
  bgColor: string;
  activeColor: string;
  emoji: string;
}

const colorButtons: ColorButton[] = [
  { color: 'red', bgColor: 'bg-red-500', activeColor: 'bg-red-300 ring-8 ring-red-400 ring-opacity-75', emoji: '🔴' },
  { color: 'blue', bgColor: 'bg-blue-500', activeColor: 'bg-blue-300 ring-8 ring-blue-400 ring-opacity-75', emoji: '🔵' },
  { color: 'green', bgColor: 'bg-green-500', activeColor: 'bg-green-300 ring-8 ring-green-400 ring-opacity-75', emoji: '🟢' },
  { color: 'yellow', bgColor: 'bg-yellow-500', activeColor: 'bg-yellow-300 ring-8 ring-yellow-400 ring-opacity-75', emoji: '🟡' },
];

export default function SimonGame() {
  const router = useRouter();
  const [sequence, setSequence] = useState<Color[]>([]);
  const [playerSequence, setPlayerSequence] = useState<Color[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentShowIndex, setCurrentShowIndex] = useState(0);
  const audioContext = useRef<AudioContext | null>(null);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('simon-highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Initialize audio context
  useEffect(() => {
    audioContext.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    return () => {
      audioContext.current?.close();
    };
  }, []);

  // Play sound for each color
  const playSound = useCallback((color: Color) => {
    if (!soundEnabled || !audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    // Different frequencies for each color
    const frequencies: Record<Color, number> = {
      red: 329.63,    // E4
      blue: 392.00,   // G4
      green: 440.00,  // A4
      yellow: 493.88, // B4
    };

    oscillator.frequency.value = frequencies[color];
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.5);
    
    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + 0.5);
  }, [soundEnabled]);

  // Generate next color in sequence
  const generateNextColor = useCallback(() => {
    const colors: Color[] = ['red', 'blue', 'green', 'yellow'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  // Show the sequence to the player
  const showSequence = useCallback(async (seq: Color[]) => {
    setIsShowingSequence(true);
    setPlayerSequence([]);
    setCurrentShowIndex(0);

    // Longer pause before starting
    await new Promise(resolve => setTimeout(resolve, 1000));

    for (let i = 0; i < seq.length; i++) {
      setCurrentShowIndex(i + 1);
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveColor(seq[i]);
      playSound(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 800)); // Longer display time
      setActiveColor(null);
    }

    setCurrentShowIndex(0);
    setIsShowingSequence(false);
  }, [playSound]);

  // Start new game
  const startGame = useCallback(() => {
    const firstColor = generateNextColor();
    setSequence([firstColor]);
    setPlayerSequence([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setTimeout(() => showSequence([firstColor]), 1000);
  }, [generateNextColor, showSequence]);

  // Handle player clicking a color
  const handleColorClick = useCallback((color: Color) => {
    if (!isPlaying || isShowingSequence || gameOver) return;

    playSound(color);
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 300);

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    // Check if the player's move is correct
    const currentIndex = newPlayerSequence.length - 1;
    
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      // Wrong move - game over
      setGameOver(true);
      setIsPlaying(false);
      
      // Update high score if needed
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('simon-highscore', score.toString());
      }
      
      // Play error sound
      if (soundEnabled && audioContext.current) {
        const oscillator = audioContext.current.createOscillator();
        const gainNode = audioContext.current.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.current.destination);
        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';
        gainNode.gain.value = 0.2;
        oscillator.start();
        oscillator.stop(audioContext.current.currentTime + 0.5);
      }
      return;
    }

    // Check if player completed the sequence
    if (newPlayerSequence.length === sequence.length) {
      // Correct! Add next color
      const newScore = score + 1;
      setScore(newScore);
      setPlayerSequence([]);
      
      const nextColor = generateNextColor();
      const newSequence = [...sequence, nextColor];
      setSequence(newSequence);
      
      setTimeout(() => showSequence(newSequence), 1000);
    }
  }, [isPlaying, isShowingSequence, gameOver, playerSequence, sequence, score, highScore, soundEnabled, playSound, generateNextColor, showSequence]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="bg-white/90"
          >
            <Home className="h-5 w-5 mr-2" />
            Menu
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              variant="outline"
              className="bg-white/90"
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Game Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2">
            🎨 Simon 🎨
          </h1>
          <p className="text-xl sm:text-2xl text-white/90">
            Mémorise la séquence!
          </p>
        </div>

        {/* Score Display */}
        <div className="flex justify-center gap-8 mb-8">
          <Card className="px-6 py-3 bg-white/90">
            <div className="text-center">
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-3xl font-bold text-purple-600">{score}</p>
            </div>
          </Card>
          <Card className="px-6 py-3 bg-white/90">
            <div className="text-center">
              <p className="text-sm text-gray-600">Record</p>
              <p className="text-3xl font-bold text-orange-600">
                <Trophy className="inline h-6 w-6 mr-1" />
                {highScore}
              </p>
            </div>
          </Card>
        </div>

        {/* Game Board */}
        <Card className="p-8 bg-white/95 backdrop-blur">
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {colorButtons.map((btn) => (
              <button
                key={btn.color}
                onClick={() => handleColorClick(btn.color)}
                disabled={!isPlaying || isShowingSequence}
                className={`
                  aspect-square rounded-2xl text-6xl
                  transition-all duration-200 transform
                  ${activeColor === btn.color ? btn.activeColor : btn.bgColor}
                  ${activeColor === btn.color ? 'scale-110 brightness-150 shadow-2xl animate-pulse z-10' : 'shadow-lg'}
                  ${(!isPlaying || isShowingSequence) && activeColor !== btn.color ? 'opacity-30 cursor-not-allowed' : ''}
                  ${isPlaying && !isShowingSequence ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''}
                  flex items-center justify-center relative
                `}
                style={{
                  fontSize: activeColor === btn.color ? '5rem' : '3.75rem',
                  filter: activeColor === btn.color ? 'drop-shadow(0 0 40px rgba(255,255,255,0.8))' : 'none'
                }}
              >
                {btn.emoji}
              </button>
            ))}
          </div>

          {/* Game Status */}
          <div className="mt-8 text-center">
            {!isPlaying && !gameOver && (
              <Button
                onClick={startGame}
                className="px-8 py-6 text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                COMMENCER! 🎮
              </Button>
            )}

            {isShowingSequence && (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600 animate-pulse">
                  Regarde bien... 👀
                </div>
                {currentShowIndex > 0 && (
                  <div className="text-2xl font-bold text-purple-500">
                    Couleur {currentShowIndex} sur {sequence.length}
                  </div>
                )}
              </div>
            )}

            {isPlaying && !isShowingSequence && !gameOver && (
              <div className="text-2xl font-bold text-green-600">
                À ton tour! 🎯
              </div>
            )}

            {gameOver && (
              <div className="space-y-4">
                <div className="text-2xl font-bold text-red-600">
                  Oops! Essaie encore! 😊
                </div>
                {score > 0 && score === highScore && (
                  <div className="text-xl font-bold text-yellow-600 animate-bounce">
                    🏆 Nouveau record! 🏆
                  </div>
                )}
                <Button
                  onClick={startGame}
                  className="px-8 py-6 text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500"
                >
                  <RotateCcw className="h-6 w-6 mr-2" />
                  REJOUER! 🎮
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Fun decorations - just static emojis, not the answer! */}
        <div className="mt-8 text-center">
          <div className="text-4xl space-x-2">
            <span className="inline-block animate-bounce" style={{ animationDelay: '0s' }}>
              🎮
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>
              🌟
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>
              🏆
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.6s' }}>
              🎯
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.8s' }}>
              🎨
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}