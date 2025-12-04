export interface LunarDate {
  day: number;
  month: number;
  year: number;
  leap: boolean;
  jd: number;
}

export interface SolarDate {
  day: number;
  month: number;
  year: number;
}

export interface DayInfo {
  solar: SolarDate;
  lunar: LunarDate;
  canChi: string; // e.g., "Giáp Thìn"
  isToday: boolean;
}

export interface NotificationEvent {
  type: 'RAM' | 'MUNG_1';
  daysUntil: number; // 0 = today, 1 = tomorrow, 2 = day after
  dateStr: string;
}

export enum ViewMode {
  MONTH = 'MONTH',
  DAY = 'DAY'
}

export type ZodiacSign = 
  | 'Bạch Dương' | 'Kim Ngưu' | 'Song Tử' | 'Cự Giải' 
  | 'Sư Tử' | 'Xử Nữ' | 'Thiên Bình' | 'Bọ Cạp' 
  | 'Nhân Mã' | 'Ma Kết' | 'Bảo Bình' | 'Song Ngư';

export const ZODIAC_LIST: ZodiacSign[] = [
  'Bạch Dương', 'Kim Ngưu', 'Song Tử', 'Cự Giải', 
  'Sư Tử', 'Xử Nữ', 'Thiên Bình', 'Bọ Cạp', 
  'Nhân Mã', 'Ma Kết', 'Bảo Bình', 'Song Ngư'
];
