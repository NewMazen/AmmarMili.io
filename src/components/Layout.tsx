import React from 'react';
import { Moon, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  onMoonClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onMoonClick }) => {
  return (
    <div className="min-h-screen bg-ramadan-green relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8 islamic-pattern">
      {/* Decorative Elements */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onMoonClick}
        className="absolute top-4 right-4 md:top-8 md:right-8 text-ramadan-gold cursor-pointer z-50"
      >
        <Moon size={48} fill="currentColor" className="opacity-20 md:w-16 md:h-16 hover:opacity-40 transition-opacity" />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-ramadan-gold"
      >
        <Star size={24} fill="currentColor" className="opacity-10 md:w-8 md:h-8" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute top-24 left-24 text-ramadan-gold"
      >
        <Star size={24} fill="currentColor" className="opacity-10" />
      </motion.div>

      {/* Main Content */}
      <main className="w-full max-w-2xl z-10">
        {children}
      </main>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 w-full h-1 bg-ramadan-gold opacity-20" />
    </div>
  );
};
