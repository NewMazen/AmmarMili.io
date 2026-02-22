import React from 'react';
import { motion } from 'motion/react';

export const GameLogo: React.FC = () => {
  const shadowStyle = {
    textShadow: '5px 5px 0px #042f24', // Strong dark green shadow for 3D effect
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 select-none">
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="flex flex-col items-center gap-0 leading-[0.7] font-game font-black tracking-tighter transform -rotate-6 -skew-x-6"
      >
        <span
          className="text-6xl md:text-7xl text-ramadan-gold z-30 drop-shadow-xl"
          style={shadowStyle}
        >
          تحديات
        </span>
        <span
          className="text-4xl md:text-5xl text-ramadan-light z-20 -my-1 drop-shadow-xl"
          style={shadowStyle}
        >
          مع
        </span>
        <span
          className="text-7xl md:text-8xl text-ramadan-gold z-10 -my-2 drop-shadow-xl"
          style={shadowStyle}
        >
          عمار
        </span>
      </motion.div>
      
      {/* Subtle depth shadow */}
      <div className="w-24 h-3 bg-black/10 blur-lg rounded-full mt-2" />
    </div>
  );
};
