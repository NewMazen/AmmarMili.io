import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Play, Trophy } from 'lucide-react';
import { getLeaderboard, LeaderboardEntry } from '../utils/leaderboard';
import { GameLogo } from './GameLogo';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    } else {
      setError(true);
    }
  };

  return (
    <div className="space-y-6 w-full relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md border border-ramadan-gold/30 p-6 md:p-10 rounded-3xl shadow-2xl text-center w-full"
      >
        <GameLogo />
        
        <p className="text-ramadan-light/80 mb-8 text-base md:text-lg font-medium">
          مرحباً بك في مسابقة رمضان الكبرى! هل أنت مستعد لاختبار معلوماتك؟
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="name" className="block text-right text-sm font-medium text-ramadan-gold mb-2">
              أدخل اسمك للمشاركة
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="اسم المتسابق..."
                className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-ramadan-gold/50'} text-white rounded-xl py-3 md:py-4 px-10 md:px-12 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-ramadan-gold transition-all text-right`}
              />
              <User className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-ramadan-gold/50" size={18} />
            </div>
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-2 text-right"
              >
                يرجى إدخال اسمك أولاً للمتابعة
              </motion.p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-ramadan-gold text-ramadan-green font-bold py-3 md:py-4 rounded-xl text-lg md:text-xl flex items-center justify-center gap-2 shadow-lg shadow-ramadan-gold/20 hover:bg-ramadan-gold/90 transition-colors"
          >
            <Play size={24} fill="currentColor" />
            ابدأ التحدي
          </motion.button>
        </form>
      </motion.div>

      {/* Leaderboard Section */}
      {leaderboard.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-ramadan-gold/20 p-6 rounded-3xl w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-ramadan-gold font-bold">
              <Trophy size={20} />
              <span>أفضل 5 متسابقين</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-ramadan-gold text-ramadan-green' : 'bg-white/10 text-white'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-white font-medium">{entry.name}</span>
                </div>
                <div className="text-ramadan-gold font-bold">
                  {entry.score} <span className="text-[10px] opacity-50">نقاط</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
