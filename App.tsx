import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import DayCell from './components/DayCell';
import DetailModal from './components/DetailModal';
import Notifications from './components/Notifications';
import { convertSolarToLunar, getCanChi } from './utils/lunar';
import { DayInfo, NotificationEvent, SolarDate, ZodiacSign } from './types';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<NotificationEvent[]>([]);
  
  // Settings State
  const [zodiac, setZodiac] = useState<ZodiacSign | null>(null);
  const [notifyDaysBefore, setNotifyDaysBefore] = useState<number>(2); // Default to 2 days
  
  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Load Settings from LocalStorage
  useEffect(() => {
    const savedZodiac = localStorage.getItem('user_zodiac');
    if (savedZodiac) setZodiac(savedZodiac as ZodiacSign);

    const savedDays = localStorage.getItem('notify_days_before');
    if (savedDays) setNotifyDaysBefore(parseInt(savedDays, 10));
  }, []);

  // Handle Install Prompt Event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleZodiacChange = (newZodiac: ZodiacSign) => {
    setZodiac(newZodiac);
    localStorage.setItem('user_zodiac', newZodiac);
  };

  const handleNotifyDaysChange = (days: number) => {
    setNotifyDaysBefore(days);
    localStorage.setItem('notify_days_before', days.toString());
    // Force re-check of notifications will happen on next render/interval
  };

  // 1. Calculate Grid Data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-11
    
    const days: DayInfo[] = [];
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startDayOfWeek = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1; // Mon=0
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Previous month padding
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevMonthDate = new Date(year, month - 1, d);
      const solar: SolarDate = { day: d, month: month === 0 ? 12 : month, year: month === 0 ? year - 1 : year };
      const lunar = convertSolarToLunar(solar.day, solar.month, solar.year);
      days.push({
        solar,
        lunar,
        canChi: getCanChi(lunar),
        isToday: false
      });
    }

    // Current month
    const today = new Date();
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
       const solar: SolarDate = { day: d, month: month + 1, year };
       const lunar = convertSolarToLunar(solar.day, solar.month, solar.year);
       const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
       days.push({
         solar,
         lunar,
         canChi: getCanChi(lunar),
         isToday
       });
    }

    // Next month padding
    const remainingSlots = 42 - days.length; // 6 rows * 7 cols
    for (let d = 1; d <= remainingSlots; d++) {
       const solar: SolarDate = { day: d, month: month === 11 ? 1 : month + 2, year: month === 11 ? year + 1 : year };
       const lunar = convertSolarToLunar(solar.day, solar.month, solar.year);
       days.push({
         solar,
         lunar,
         canChi: getCanChi(lunar),
         isToday: false
       });
    }

    return days;
  }, [currentDate]);

  // 2. Check Upcoming Events (Rằm / Mùng 1)
  useEffect(() => {
    const checkUpcomingEvents = () => {
      const events: NotificationEvent[] = [];
      const today = new Date();
      
      // Look ahead up to 3 days to cover all settings
      for (let i = 0; i <= 3; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() + i);
        
        const solarD = checkDate.getDate();
        const solarM = checkDate.getMonth() + 1;
        const solarY = checkDate.getFullYear();
        
        const lunar = convertSolarToLunar(solarD, solarM, solarY);
        
        let type: 'RAM' | 'MUNG_1' | null = null;
        if (lunar.day === 1) type = 'MUNG_1';
        if (lunar.day === 15) type = 'RAM';

        if (type) {
           const eventKey = `${type}-${solarD}-${solarM}-${solarY}-alerted-day-${i}`;
           
           // Only add to "Upcoming Events" UI if it's within relevant range (0-2 usually fine for UI, but let's show all)
           if (i <= 3) {
             events.push({
               type,
               daysUntil: i,
               dateStr: `${solarD}/${solarM}`
             });
           }
           
           // Notification Logic
           if ('Notification' in window && Notification.permission === 'granted') {
             // Logic:
             // 1. Notify if i == notifyDaysBefore (e.g., 2 days away)
             // 2. Notify if i == 0 (It's today!)
             
             // Check if we already alerted for THIS specific countdown day (to avoid spamming every hour)
             const alreadyNotified = localStorage.getItem(eventKey);
             
             if (!alreadyNotified) {
                 let shouldNotify = false;
                 let body = "";

                 if (i === notifyDaysBefore) {
                    shouldNotify = true;
                    body = `Còn ${i} ngày nữa là đến ${type === 'RAM' ? 'Rằm' : 'Mùng 1'} (${solarD}/${solarM}).`;
                 } else if (i === 0) {
                    shouldNotify = true;
                    body = `Hôm nay là ngày ${type === 'RAM' ? 'Rằm' : 'Mùng 1'}! Chúc bạn ngày mới tốt lành.`;
                 }

                 if (shouldNotify) {
                    new Notification(`📅 Lịch Vạn Niên Nhắc Nhở`, {
                      body: body,
                      icon: 'https://cdn-icons-png.flaticon.com/512/4256/4256900.png',
                      vibrate: [200, 100, 200, 100, 200],
                      requireInteraction: true,
                      tag: `event-${solarD}-${solarM}` // Overwrite prev notification for same event
                    } as any);
                    
                    localStorage.setItem(eventKey, 'true');
                 }
             }
           }
        }
      }
      setUpcomingEvents(events);
    };

    checkUpcomingEvents();
    
    // Check every hour
    const interval = setInterval(checkUpcomingEvents, 3600000); 
    return () => clearInterval(interval);
  }, [notifyDaysBefore]); // Re-run if user changes setting

  // Handlers
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

  return (
    <div className="min-h-screen flex flex-col max-w-5xl mx-auto bg-stone-100 shadow-xl my-0 md:my-8 rounded-none md:rounded-2xl overflow-hidden border border-stone-200">
      <Header 
        currentDate={currentDate} 
        onPrevMonth={handlePrevMonth} 
        onNextMonth={handleNextMonth} 
        onToday={handleToday}
        selectedZodiac={zodiac}
        onSelectZodiac={handleZodiacChange}
      />

      <main className="flex-1 p-4 md:p-6 bg-white">
        <Notifications 
          events={upcomingEvents} 
          installPrompt={deferredPrompt}
          onInstallClick={handleInstallClick}
          notifyDaysBefore={notifyDaysBefore}
          onNotifyDaysChange={handleNotifyDaysChange}
        />

        {/* Weekday Header */}
        <div className="grid grid-cols-7 mb-2">
           {weekDays.map((day, idx) => (
             <div key={day} className={`text-center text-sm font-bold uppercase tracking-wider py-2 ${idx === 6 ? 'text-red-500' : 'text-stone-500'}`}>
               {day}
             </div>
           ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-stone-200 border border-stone-200">
           {calendarData.map((day, idx) => {
             // Determine if this cell belongs to the currently viewed month
             const isCurrentMonth = day.solar.month === currentDate.getMonth() + 1;
             return (
               <DayCell 
                 key={idx} 
                 dayInfo={day} 
                 isCurrentMonth={isCurrentMonth}
                 onClick={setSelectedDay}
               />
             );
           })}
        </div>
        
        <div className="mt-6 text-center text-stone-400 text-xs italic">
           * Dữ liệu âm lịch được tính toán dựa trên thuật toán cơ bản. 
           {zodiac ? ` Đang hiển thị lời khuyên cho cung ${zodiac}.` : ' Chọn cung hoàng đạo để xem lời khuyên riêng.'}
        </div>
      </main>

      {selectedDay && (
        <DetailModal 
          day={selectedDay} 
          zodiac={zodiac}
          onClose={() => setSelectedDay(null)} 
        />
      )}
    </div>
  );
}

export default App;
