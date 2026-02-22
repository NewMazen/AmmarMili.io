import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';

interface QuizScreenProps {
  onComplete: (score: number) => void;
  questions: Question[];
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ onComplete, questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const playCorrect = useAudio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
  const playIncorrect = useAudio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3');

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
      playCorrect();
    } else {
      playIncorrect();
    }

    // Wait a bit before moving to next question
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        onComplete(score + (index === currentQuestion.correctAnswer ? 1 : 0));
      }
    }, 1200);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center p-10 bg-white/10 rounded-3xl border border-ramadan-gold/30">
        <p className="text-white text-xl mb-4">لا توجد أسئلة حالياً</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-ramadan-gold underline"
        >
          تحديث الصفحة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Background Flash Effect */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 pointer-events-none z-0 ${
              selectedOption === currentQuestion.correctAnswer ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="bg-white/10 rounded-full h-3 overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="bg-ramadan-gold h-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"
        />
      </div>
      
      <div className="flex justify-between items-center text-ramadan-gold/80 text-sm font-medium">
        <span>السؤال {currentIndex + 1} من {questions.length}</span>
        <span>النتيجة الحالية: {score}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/10 backdrop-blur-md border border-ramadan-gold/20 p-5 md:p-10 rounded-3xl shadow-xl w-full"
        >
          <h2 className="text-xl md:text-3xl font-bold text-white mb-6 md:mb-8 leading-relaxed text-right">
            {currentQuestion.text}
          </h2>

          <div className="grid gap-4">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = index === currentQuestion.correctAnswer;
              const isSelected = index === selectedOption;
              
              let bgColor = "bg-white/5 hover:bg-white/10 border-white/10";
              let animation = {};

              if (isAnswered) {
                if (isCorrect) {
                  bgColor = "bg-green-500/20 border-green-500/50 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]";
                  if (isSelected) animation = { scale: [1, 1.05, 1], transition: { duration: 0.3 } };
                } else if (isSelected) {
                  bgColor = "bg-red-500/20 border-red-500/50 text-red-400";
                  animation = { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } };
                } else {
                  bgColor = "bg-white/5 opacity-30 border-white/5";
                }
              }

              return (
                <motion.button
                  key={index}
                  animate={animation}
                  whileHover={!isAnswered ? { scale: 1.01, x: -5 } : {}}
                  whileTap={!isAnswered ? { scale: 0.99 } : {}}
                  onClick={() => handleOptionClick(index)}
                  disabled={isAnswered}
                  className={`w-full p-4 md:p-5 rounded-2xl border text-right text-base md:text-lg font-medium transition-all flex items-center justify-between gap-4 ${bgColor}`}
                >
                  <span className="flex-1">{option}</span>
                  <AnimatePresence>
                    {isAnswered && isCorrect && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-green-500 shrink-0"
                      >
                        <CheckCircle2 size={24} />
                      </motion.div>
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-red-500 shrink-0"
                      >
                        <XCircle size={24} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback Message Overlay */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 text-center"
              >
                <span className={`text-lg md:text-xl font-bold px-4 md:px-6 py-2 rounded-full ${
                  selectedOption === currentQuestion.correctAnswer 
                    ? 'text-green-400 bg-green-500/10' 
                    : 'text-red-400 bg-red-500/10'
                }`}>
                  {selectedOption === currentQuestion.correctAnswer ? 'أحسنت! إجابة صحيحة ✨' : 'للأسف! إجابة خاطئة 🌙'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
