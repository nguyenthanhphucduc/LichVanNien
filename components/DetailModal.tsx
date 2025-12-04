import React, { useEffect, useState } from 'react';
import { DayInfo, ZodiacSign } from '../types';
import { getDailyWisdom } from '../services/geminiService';
import { getDayOfWeek } from '../utils/lunar';

interface DetailModalProps {
  day: DayInfo | null;
  zodiac: ZodiacSign | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ day, zodiac, onClose }) => {
  const [wisdom, setWisdom] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (day) {
      setLoading(true);
      setWisdom("");
      getDailyWisdom(day.solar, day.lunar, day.canChi, zodiac)
        .then(text => setWisdom(text))
        .finally(() => setLoading(false));
    }
  }, [day, zodiac]);

  if (!day) return null;

  const dayOfWeek = getDayOfWeek(day.solar.day, day.solar.month, day.solar.year);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Image / Color Block */}
        <div className="h-32 bg-gradient-to-br from-tet-red to-red-800 flex items-center justify-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <div className="text-center text-tet-gold">
            <div className="text-6xl font-serif font-bold drop-shadow-md">{day.solar.day}</div>
            <div className="text-sm font-medium uppercase tracking-widest text-white/90">{dayOfWeek}, Tháng {day.solar.month}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 relative">
          <div className="flex justify-between items-center mb-6 border-b border-dashed border-stone-200 pb-4">
             <div className="text-center flex-1">
               <span className="block text-xs text-stone-500 uppercase">Năm Dương</span>
               <span className="text-lg font-semibold text-stone-800">{day.solar.year}</span>
             </div>
             <div className="w-px h-10 bg-stone-200"></div>
             <div className="text-center flex-1">
               <span className="block text-xs text-stone-500 uppercase">Âm Lịch</span>
               <div className="flex flex-col items-center">
                 <span className="text-2xl font-serif font-bold text-stone-800">{day.lunar.day}</span>
                 <span className="text-sm text-stone-600">Tháng {day.lunar.month}</span>
               </div>
             </div>
             <div className="w-px h-10 bg-stone-200"></div>
             <div className="text-center flex-1">
               <span className="block text-xs text-stone-500 uppercase">Năm</span>
               <span className="text-lg font-semibold text-stone-800">{day.canChi}</span>
             </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tet-red"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5c0-5.523 4.477-10 10-10Z"/></svg>
                Lời khuyên {zodiac ? `cho ${zodiac}` : 'hôm nay'}
              </h3>
              <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 min-h-[80px] flex items-center justify-center">
                {loading ? (
                  <div className="flex items-center gap-2 text-stone-400 text-sm">
                    <div className="animate-spin h-4 w-4 border-2 border-stone-400 border-t-transparent rounded-full"></div>
                    Đang luận giải cho {zodiac || "bạn"}...
                  </div>
                ) : (
                  <p className="text-stone-700 italic font-serif text-center leading-relaxed">
                    "{wisdom}"
                  </p>
                )}
              </div>
            </div>
            
             <div className="grid grid-cols-2 gap-2 text-xs text-stone-500 mt-4">
               <div className="bg-stone-50 p-2 rounded text-center">
                  Cung hoàng đạo: <span className="font-semibold text-stone-700">{zodiac || "Chưa chọn"}</span>
               </div>
               <div className="bg-stone-50 p-2 rounded text-center">
                  Trực: Kiên
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
