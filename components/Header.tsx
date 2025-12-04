import React from 'react';
import { ZodiacSign, ZODIAC_LIST } from '../types';

interface HeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  selectedZodiac: ZodiacSign | null;
  onSelectZodiac: (z: ZodiacSign) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentDate, 
  onPrevMonth, 
  onNextMonth, 
  onToday,
  selectedZodiac,
  onSelectZodiac
}) => {
  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-center px-6 py-6 bg-white shadow-sm border-b border-stone-200 gap-4">
      {/* Logo & Title */}
      <div className="flex items-center space-x-2">
         <div className="bg-tet-red w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
            V
         </div>
         <div className="flex flex-col">
            <h1 className="text-xl font-serif font-bold text-stone-800 leading-tight">Lịch Vạn Niên</h1>
            <span className="text-xs text-stone-500 font-sans">AI Phong Thủy</span>
         </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center space-x-4 bg-stone-100 p-1.5 rounded-full shadow-inner order-3 md:order-2">
        <button 
          onClick={onPrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow text-stone-600 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        
        <span className="font-sans font-semibold text-lg w-32 text-center select-none text-stone-700">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>

        <button 
          onClick={onNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow text-stone-600 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      {/* Zodiac & Today Button */}
      <div className="flex items-center gap-3 order-2 md:order-3 w-full md:w-auto justify-center">
        <div className="relative group">
            <select 
              className="appearance-none bg-stone-50 border border-stone-200 text-stone-700 text-sm rounded-lg focus:ring-tet-red focus:border-tet-red block p-2 pr-8 cursor-pointer hover:bg-stone-100 transition-colors"
              value={selectedZodiac || ""}
              onChange={(e) => onSelectZodiac(e.target.value as ZodiacSign)}
            >
              <option value="" disabled>Chọn cung hoàng đạo</option>
              {ZODIAC_LIST.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>

        <button 
          onClick={onToday}
          className="hidden md:block px-4 py-2 text-sm font-medium text-tet-red border border-tet-red/30 rounded-full hover:bg-tet-red hover:text-white transition-colors whitespace-nowrap"
        >
          Hôm nay
        </button>
      </div>
    </div>
  );
};

export default Header;
