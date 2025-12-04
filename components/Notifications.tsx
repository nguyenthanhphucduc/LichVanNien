import React, { useEffect, useState } from 'react';
import { NotificationEvent } from '../types';

interface NotificationsProps {
  events: NotificationEvent[];
  installPrompt: any; // BeforeInstallPromptEvent
  onInstallClick: () => void;
  notifyDaysBefore: number;
  onNotifyDaysChange: (days: number) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ 
  events, 
  installPrompt, 
  onInstallClick,
  notifyDaysBefore,
  onNotifyDaysChange
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    // Simple iOS detection
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert("Trình duyệt của bạn không hỗ trợ thông báo.");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      new Notification("Lịch Vạn Niên AI", {
        body: `Đã bật! Sẽ nhắc trước ${notifyDaysBefore} ngày dịp Rằm/Mùng 1.`,
        icon: 'https://cdn-icons-png.flaticon.com/512/4256/4256900.png',
        vibrate: [200, 100, 200]
      } as any);
    }
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Settings Panel */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex flex-col gap-4">
        
        {/* Row 1: Notification Timing */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3 last:border-0 last:pb-0">
           <div className="text-sm text-stone-600 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
             <span>Báo ngày Rằm/Mùng 1 trước:</span>
           </div>
           <div className="flex items-center gap-2 bg-stone-50 p-1 rounded-lg self-start sm:self-auto">
              {[1, 2, 3].map(d => (
                <button
                  key={d}
                  onClick={() => onNotifyDaysChange(d)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    notifyDaysBefore === d 
                    ? 'bg-tet-red text-white shadow-md' 
                    : 'text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {d} ngày
                </button>
              ))}
           </div>
        </div>

        {/* Row 2: Installation / Permission */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
           <div className="text-sm text-stone-600 flex items-center gap-2">
             {permission === 'granted' ? (
                <span className="text-green-600 flex items-center gap-1 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Đã bật thông báo
                </span>
             ) : (
                <span className="text-stone-500">Chưa bật thông báo</span>
             )}
           </div>

           <div className="flex gap-2 self-start sm:self-auto">
             {permission !== 'granted' && (
               <button 
                 onClick={requestPermission}
                 className="px-3 py-1.5 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 text-sm font-medium transition-colors"
               >
                 Bật thông báo
               </button>
             )}

             {installPrompt && (
               <button 
                 onClick={onInstallClick}
                 className="px-3 py-1.5 bg-tet-red text-white rounded-lg hover:bg-red-700 text-sm font-bold shadow-md animate-pulse"
               >
                 📥 Cài đặt ứng dụng
               </button>
             )}
           </div>
        </div>

        {/* iOS Instruction Fallback */}
        {isIOS && !installPrompt && (
           <div className="text-xs text-stone-400 bg-stone-50 p-2 rounded border border-dashed border-stone-200">
             Mẹo: Trên iPhone, nhấn nút <strong>Chia sẻ</strong> <span className="inline-block align-middle"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></span> sau đó chọn <strong>"Thêm vào màn hình chính"</strong> để ứng dụng chạy mượt mà hơn.
           </div>
        )}
      </div>

      {/* Actual Event Banners */}
      {events.map((event, index) => (
        <div key={index} className="bg-gradient-to-r from-yellow-50 to-white border-l-4 border-yellow-400 p-4 rounded-r-xl shadow-sm flex items-start animate-in slide-in-from-top duration-300">
          <div className="bg-yellow-100 p-2 rounded-full mr-3 text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </div>
          <div>
            <h4 className="font-bold text-lg text-yellow-800 uppercase tracking-tight">
              Sắp đến {event.type === 'RAM' ? 'ngày Rằm' : 'Mùng 1'}
            </h4>
            <p className="text-stone-700 mt-1">
              {event.daysUntil === 0 
                ? <span className="font-bold text-red-600">Hôm nay là ngày chính lễ!</span> 
                : <span>Chỉ còn <strong className="text-red-600 text-lg">{event.daysUntil} ngày</strong> nữa ({event.dateStr}).</span>
              }
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
