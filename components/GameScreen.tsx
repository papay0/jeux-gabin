'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GameState, Question, Answer } from '@/lib/types';
import { CheckCircle2, XCircle, Zap, ToggleLeft, ToggleRight } from 'lucide-react';
import Image from 'next/image';

interface GameScreenProps {
  questions: Question[];
  onGameEnd: (state: GameState) => void;
}

export default function GameScreen({ questions, onGameEnd }: GameScreenProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    streak: 0,
    answers: [],
    startTime: new Date(),
    endTime: null,
    inputMode: 'multiple-choice',
  });

  const [directInput, setDirectInput] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  const [clickedOption, setClickedOption] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [timeBonus, setTimeBonus] = useState<number>(0);

  const currentQ = questions[gameState.currentQuestion];
  const progress = ((gameState.currentQuestion + 1) / questions.length) * 100;

  const nextQuestion = useCallback(() => {
    if (gameState.currentQuestion < questions.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
      setDirectInput('');
      setShowFeedback(false);
      setClickedOption('');
    } else {
      setGameState(prev => {
        const finalState = {
          ...prev,
          endTime: new Date(),
        };
        onGameEnd(finalState);
        return finalState;
      });
    }
  }, [gameState.currentQuestion, questions.length, onGameEnd, setGameState]);

  // Countdown timer effect - only start when image is loaded
  useEffect(() => {
    if (showFeedback || imageLoading) return; // Don't countdown during feedback or while image loads
    
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback) {
      // Time's up - auto submit as wrong answer
      const answer = {
        questionId: currentQ.id,
        userAnswer: '',
        correctAnswer: currentQ.correctAnswer,
        isCorrect: false,
        points: 0,
        timeToAnswer: 10 // 10 seconds
      };
      
      setIsCorrect(false);
      setShowFeedback(true);
      
      setGameState(prev => ({
        ...prev,
        answers: [...prev.answers, answer],
        streak: 0 // Break streak on timeout
      }));

      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
  }, [timeLeft, showFeedback, imageLoading, currentQ, setGameState, nextQuestion]);

  // Reset timer and loading state when question changes
  useEffect(() => {
    setTimeLeft(10);
    setImageLoading(true);
    setQuestionStartTime(new Date());
    setTimeBonus(0);
  }, [gameState.currentQuestion]);

  const calculateTimeBonus = () => {
    const secondsLeft = timeLeft;
    if (secondsLeft >= 8) return 10; // Super fast bonus
    if (secondsLeft >= 6) return 7;  // Fast bonus
    if (secondsLeft >= 4) return 5;  // Medium bonus
    if (secondsLeft >= 2) return 3;  // Slow bonus
    return 1; // Last second bonus
  };

  // Safety check
  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4 flex items-center justify-center">
        <div className="text-white text-2xl">Chargement...</div>
      </div>
    );
  }

  const handleOptionClick = (option: string) => {
    if (showFeedback) return; // Prevent multiple clicks during feedback
    
    setClickedOption(option);
    const correct = option.toLowerCase() === currentQ.correctAnswer.toLowerCase();
    const timeTaken = (new Date().getTime() - questionStartTime.getTime()) / 1000;
    
    let points = 0;
    let bonus = 0;
    
    if (correct) {
      points = 10; // Multiple choice points
      
      // Time bonus based on seconds left (not time taken)
      bonus = calculateTimeBonus();
      setTimeBonus(bonus);
      points += bonus;
      
      const newStreak = gameState.streak + 1;
      if (newStreak === 3) points += 15;
      else if (newStreak === 5) points += 30;
      else if (newStreak === 10) points += 75;
    }

    const answer: Answer = {
      questionId: currentQ.id,
      userAnswer: option,
      correctAnswer: currentQ.correctAnswer,
      isCorrect: correct,
      points,
      timeToAnswer: timeTaken,
    };

    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      streak: correct ? prev.streak + 1 : 0,
      answers: [...prev.answers, answer],
    }));

    setIsCorrect(correct);
    setShowFeedback(true);

    // Move to next question after showing feedback
    setTimeout(() => {
      if (gameState.currentQuestion < questions.length - 1) {
        setGameState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
        }));
          setClickedOption('');
        setShowFeedback(false);
        setQuestionStartTime(new Date());
      } else {
        // End game
        setGameState(prev => {
          const finalState = {
            ...prev,
            score: prev.score + points,
            answers: [...prev.answers, answer],
            endTime: new Date(),
          };
          onGameEnd(finalState);
          return finalState;
        });
      }
    }, 1500);
  };

  const handleDirectInputSubmit = () => {
    if (showFeedback || !directInput.trim()) return;
    
    const correct = directInput.trim().toLowerCase() === currentQ.correctAnswer.toLowerCase();
    const timeToAnswer = (new Date().getTime() - questionStartTime.getTime()) / 1000;
    
    let points = 0;
    if (correct) {
      points = 20; // Direct input points
      
      const newStreak = gameState.streak + 1;
      if (newStreak === 3) points += 15;
      else if (newStreak === 5) points += 30;
      else if (newStreak === 10) points += 75;
      
      if (timeToAnswer < 5) points += 5;
      else if (timeToAnswer < 10) points += 2;
    }

    const answer: Answer = {
      questionId: currentQ.id,
      userAnswer: directInput.trim(),
      correctAnswer: currentQ.correctAnswer,
      isCorrect: correct,
      points,
      timeToAnswer,
    };

    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      streak: correct ? prev.streak + 1 : 0,
      answers: [...prev.answers, answer],
    }));

    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      if (gameState.currentQuestion < questions.length - 1) {
        setGameState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
        }));
        setDirectInput('');
        setShowFeedback(false);
        setQuestionStartTime(new Date());
      } else {
        setGameState(prev => {
          const finalState = {
            ...prev,
            score: prev.score + points,
            answers: [...prev.answers, answer],
            endTime: new Date(),
          };
          onGameEnd(finalState);
          return finalState;
        });
      }
    }, 1500);
  };

  const toggleInputMode = () => {
    setGameState(prev => ({
      ...prev,
      inputMode: prev.inputMode === 'multiple-choice' ? 'direct-input' : 'multiple-choice',
    }));
    setDirectInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-2 sm:p-4 lg:p-2 xl:p-3">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        <Card className="p-3 sm:p-4 md:p-4 lg:p-4 xl:p-5 bg-white/95 backdrop-blur flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-2 sm:mb-4 lg:mb-2 xl:mb-3 flex-shrink-0">
            {/* Mobile: Stack vertically, Desktop: Side by side */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-3 lg:mb-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                  Question {gameState.currentQuestion + 1}/{questions.length}
                </span>
                {gameState.streak > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 sm:px-3 bg-orange-100 rounded-full self-start">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                    <span className="text-sm sm:text-base md:text-lg font-bold text-orange-600">
                      Série: {gameState.streak}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">
                  Score: {gameState.score}
                </div>
                {!showFeedback && (
                  <div className="flex items-center gap-2">
                    <div className={`text-lg sm:text-xl font-bold ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                      ⏱️ {timeLeft}s
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Progress bar for overall game */}
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 sm:h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Countdown timer progress bar */}
            {!showFeedback && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    timeLeft <= 3 ? 'bg-red-500' : timeLeft <= 6 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(timeLeft / 10) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Image */}
          <div className="relative h-64 sm:h-72 md:h-80 lg:h-80 xl:h-96 mb-2 sm:mb-4 lg:mb-2 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <div className="text-gray-500 font-medium">Chargement de l&apos;image...</div>
                </div>
              </div>
            )}
            <Image
              src={currentQ.imageUrl}
              alt="Voiture mystère"
              fill
              className={`object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              priority
              onLoad={() => {
                setImageLoading(false);
                console.log(`Image loaded successfully: ${currentQ.imageUrl}`);
              }}
              onError={(e) => {
                console.error(`Image failed to load: ${currentQ.imageUrl}`, e);
                setImageLoading(false);
              }}
            />
            {showFeedback && (
              <div className={`absolute inset-0 flex items-center justify-center ${
                isCorrect ? 'bg-green-500/80' : 'bg-red-500/80'
              }`}>
                <div className="text-center text-white p-4">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 mx-auto mb-2" />
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold">Bravo! 🎉</p>
                      <p className="text-lg sm:text-xl md:text-2xl">+{gameState.answers[gameState.answers.length - 1]?.points || 0} points</p>
                      {timeBonus > 0 && (
                        <p className="text-md sm:text-lg md:text-xl text-yellow-200">🚀 Bonus vitesse: +{timeBonus} pts!</p>
                      )}
                    </>
                  ) : (
                    <>
                      <XCircle className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 mx-auto mb-2" />
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold">Pas tout à fait!</p>
                      <p className="text-lg sm:text-xl md:text-2xl">C&apos;était : {currentQ.correctAnswer}</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Input Mode Toggle */}
          <div className="mb-2 sm:mb-4 lg:mb-2 flex justify-center flex-shrink-0">
            <Button
              onClick={toggleInputMode}
              variant="outline"
              className="text-sm sm:text-base md:text-lg py-2 px-3 sm:py-3 sm:px-4 lg:py-2 lg:px-3"
              disabled={showFeedback}
            >
              {gameState.inputMode === 'multiple-choice' ? (
                <>
                  <ToggleLeft className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Mode: Choix Multiple (10 pts)</span>
                  <span className="sm:hidden">Multiple (10 pts)</span>
                </>
              ) : (
                <>
                  <ToggleRight className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Mode: Écrire la Réponse (20 pts)</span>
                  <span className="sm:hidden">Écrire (20 pts)</span>
                </>
              )}
            </Button>
          </div>

          {/* Answer Input */}
          <div className="flex-1 flex flex-col justify-center">
            {!showFeedback && (
              <>
                {gameState.inputMode === 'multiple-choice' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-2 mb-0">
                  {currentQ.options.map((option) => {
                    const isClicked = clickedOption === option;
                    const isCorrect = option.toLowerCase() === currentQ.correctAnswer.toLowerCase();
                    
                    let buttonStyle = "flex items-center justify-center w-full p-3 sm:p-4 lg:p-3 xl:p-4 text-lg sm:text-xl lg:text-xl xl:text-2xl font-bold rounded-xl border-4 cursor-pointer transition-all duration-300 transform active:scale-95 sm:hover:scale-105";
                    
                    if (isClicked) {
                      if (isCorrect) {
                        buttonStyle += " bg-green-500 border-green-600 text-white animate-pulse";
                      } else {
                        buttonStyle += " bg-red-500 border-red-600 text-white animate-pulse";
                      }
                    } else {
                      buttonStyle += " border-gray-300 hover:border-purple-400 hover:bg-purple-50";
                    }
                    
                    return (
                      <button
                        key={option}
                        onClick={() => handleOptionClick(option)}
                        className={buttonStyle}
                        disabled={showFeedback}
                      >
                        {option}
                        {isClicked && isCorrect && " ✅"}
                        {isClicked && !isCorrect && " ❌"}
                      </button>
                    );
                  })}
                  </div>
                ) : (
                  <div className="mb-2 sm:mb-4">
                  <Input
                    type="text"
                    value={directInput}
                    onChange={(e) => setDirectInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleDirectInputSubmit()}
                    placeholder="Écris le nom de la marque..."
                    className="w-full text-lg sm:text-xl lg:text-xl xl:text-2xl p-3 sm:p-4 lg:p-3 text-center font-bold border-4 border-purple-400"
                    autoFocus
                  />
                  </div>
                )}

                {gameState.inputMode === 'direct-input' && (
                  <Button
                    onClick={handleDirectInputSubmit}
                    disabled={!directInput.trim()}
                    className="w-full py-3 sm:py-4 lg:py-3 text-xl sm:text-2xl lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500"
                  >
                    Valider! ✅
                  </Button>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}