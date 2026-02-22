import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Heart, Share2, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { GameLogo } from './GameLogo';

interface ResultsScreenProps {
  userName: string;
  score: number;
  total: number;
  onRestart: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ userName, score, total, onRestart }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const getRating = () => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return { 
      text: "بطل رمضان 🏆", 
      color: "text-ramadan-gold",
      recommendation: "ما شاء الله! معلوماتك ممتازة، ننصحك بمشاركة هذه المعلومات مع أهلك وأصدقائك لتنال الأجر."
    };
    if (percentage >= 80) return { 
      text: "ممتاز 🌟", 
      color: "text-yellow-400",
      recommendation: "رائع جداً! لديك معرفة واسعة، يمكنك قراءة المزيد عن قصص الغزوات في رمضان لزيادة رصيدك المعرفي."
    };
    if (percentage >= 50) return { 
      text: "جيد 👍", 
      color: "text-blue-400",
      recommendation: "جيد! لديك أساس طيب، ننصحك بمراجعة أحكام الصيام وآدابه لتقوية معلوماتك الرمضانية."
    };
    return { 
      text: "حاول مرة أخرى 💪", 
      color: "text-orange-400",
      recommendation: "بداية جيدة! رمضان فرصة رائعة للتعلم، ننصحك بقراءة كتيبات بسيطة عن فضائل الشهر الكريم والمشاركة في المسابقات العائلية."
    };
  };

  const rating = getRating();

  const handleShare = async () => {
    if (certificateRef.current === null) return;

    try {
      const dataUrl = await toPng(certificateRef.current, { cacheBust: true });
      
      // Check if Web Share API is available
      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'ramadan-challenge.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'تحديات عمار - نتيجتي في مسابقة رمضان',
          text: `لقد حصلت على ${score} من ${total} في تحديات عمار الرمضانية! جرب حظك الآن.`,
          files: [file],
        });
      } else {
        // Fallback: Download the image
        const link = document.createElement('a');
        link.download = 'ramadan-challenge-result.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Error sharing score:', err);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        ref={certificateRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-ramadan-green border-4 border-ramadan-gold p-5 md:p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden islamic-pattern w-full"
        style={{ direction: 'rtl' }}
      >
        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 border-t-4 border-r-4 border-ramadan-gold/30 rounded-tr-3xl" />
        <div className="absolute bottom-0 left-0 w-12 h-12 md:w-16 md:h-16 border-b-4 border-l-4 border-ramadan-gold/30 rounded-bl-3xl" />

        <Trophy size={60} className="mx-auto text-ramadan-gold mb-4 md:mb-6 md:w-20 md:h-20 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">انتهى التحدي!</h2>
        <p className="text-ramadan-gold text-lg md:text-xl font-medium mb-4 md:mb-6">أحسنت يا {userName}</p>

        <div className="bg-white/5 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-white/10">
          <div className="text-xs md:text-sm text-ramadan-light/60 mb-1">النتيجة النهائية</div>
          <div className="text-4xl md:text-5xl font-black text-white mb-2">
            {score} <span className="text-xl md:text-2xl text-ramadan-light/40">/ {total}</span>
          </div>
          <div className={`text-xl md:text-2xl font-bold ${rating.color}`}>
            {rating.text}
          </div>
        </div>

        <div className="bg-ramadan-gold/5 border border-ramadan-gold/20 rounded-2xl p-6 mb-4 text-right">
          <div className="flex items-center justify-end gap-2 text-ramadan-gold mb-2 font-bold">
            <span>توصية للتقوية</span>
            <Heart size={18} fill="currentColor" />
          </div>
          <p className="text-ramadan-light/90 italic text-sm">
            {rating.recommendation}
          </p>
        </div>
        
        <div className="scale-50 -my-10">
          <GameLogo />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="bg-ramadan-gold text-ramadan-green font-bold py-3 md:py-4 rounded-xl text-base md:text-lg flex items-center justify-center gap-2 shadow-lg shadow-ramadan-gold/20 transition-all"
        >
          <Share2 size={18} className="md:w-5 md:h-5" />
          مشاركة النتيجة
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-3 md:py-4 rounded-xl text-base md:text-lg flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw size={18} className="md:w-5 md:h-5" />
          إعادة المحاولة
        </motion.button>
      </div>
    </div>
  );
};
