import React from 'react';
import { DayInfo } from '../types';

interface DayCellProps {
  dayInfo: DayInfo;
  isCurrentMonth: boolean;
  onClick: (day: DayInfo) => void;
}

const DayCell: React.FC<DayCellProps> = ({ dayInfo, isCurrentMonth, onClick }) => {
  const isWeekend = new Date(dayInfo.solar.year, dayInfo.solar.month - 1, dayInfo.solar.day).getDay() === 0;
  
  // Highlighting Rules
  const isToday = dayInfo.isToday;
  const isTetRed = dayInfo.lunar.day === 1 || dayInfo.lunar.day === 15; // Mung 1 or Ram

  let containerClass = "relative h-24 md:h-32 border border-stone-100 flex flex-col justify-between p-2 cursor-pointer transition-colors hover:bg-stone-50";
  let solarTextClass = "text-xl font-semibold";
  let lunarTextClass = "text-xs md:text-sm font-medium";

  if (!isCurrentMonth) {
    containerClass += " bg-stone-50/50 text-stone-400";
    lunarTextClass += " text-stone-300";
  } else {
    containerClass += " bg-white";
    if (isWeekend) solarTextClass += " text-red-500";
    else solarTextClass += " text-stone-800";
    
    if (isTetRed) lunarTextClass += " text-tet-red";
    else lunarTextClass += " text-stone-500";
  }

  if (isToday) {
    containerClass += " ring-2 ring-tet-red/50 z-10";
  }

  return (
    <div className={containerClass} onClick={() => onClick(dayInfo)}>
      <div className="flex justify-center items-center h-full">
        <span className={solarTextClass}>{dayInfo.solar.day}</span>
      </div>
      
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-center w-full">
           <span className={lunarTextClass}>
             {dayInfo.lunar.day === 1 ? `${dayInfo.lunar.day}/${dayInfo.lunar.month}` : dayInfo.lunar.day}
           </span>
           {isTetRed && isCurrentMonth && (
             <span className="w-1.5 h-1.5 rounded-full bg-tet-red mt-1"></span>
           )}
        </div>
      </div>
      
      {dayInfo.solar.day === 1 && isCurrentMonth && (
        <span className="absolute top-1 left-2 text-[10px] uppercase font-bold text-stone-400">
           T{dayInfo.solar.month}
        </span>
      )}
    </div>
  );
};

export default DayCell;
