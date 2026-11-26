import React, { useEffect, useState } from 'react';
import { Flame, Shield, Trophy, Calendar, Check, X, Sparkles } from 'lucide-react';
import { storageService } from '../../utils/storage';
import { audioService } from '../../utils/audio';
import type { StreakDetails } from '../../types';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({ isOpen, onClose }) => {
  const [details, setDetails] = useState<StreakDetails>(() => storageService.getStreakDetails());

  useEffect(() => {
    if (isOpen) {
      setDetails(storageService.getStreakDetails());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Generate current week days (Mon -> Sun)
  const today = new Date();
  const currentDayOfWeek = (today.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((label, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (currentDayOfWeek - idx));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const isToday = idx === currentDayOfWeek;
    const isCompleted = details.history.includes(dateStr);
    return { label, dateStr, isToday, isCompleted };
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          audioService.playClick();
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-modal-title"
    >
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 overflow-hidden text-slate-100 animate-scale-up">
        {/* Glow ambient background */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header with Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Flame className="w-4 h-4 fill-amber-500" />
            </span>
            <h2 id="streak-modal-title" className="text-base font-bold text-slate-100">
              Chuỗi Học & Khiên Bảo Vệ
            </h2>
          </div>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="w-11 h-11 rounded-2xl flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors touch-manipulation active:scale-90 shrink-0"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Streak Counter Hero */}
        <div className="text-center py-5">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-amber-500/10 border border-amber-500/30 shadow-lg shadow-amber-500/10 mb-3 animate-pulse">
            <Flame className="w-12 h-12 text-amber-500 fill-amber-500 drop-shadow" />
          </div>
          <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300">
            {details.currentStreak} Ngày
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {details.currentStreak > 0
              ? 'Chuỗi học tập liên tiếp đang hoạt động!'
              : 'Hãy bắt đầu chuỗi ngày học ngay hôm nay!'}
          </p>
        </div>

        {/* 7-Day Weekly Tracker */}
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-800 mb-4">
          <div className="flex items-center justify-between mb-2 text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Tuần này
            </span>
            <span className="text-[11px] text-amber-400">
              {weekDays.filter((d) => d.isCompleted).length}/7 ngày hoàn thành
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {weekDays.map((d, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className={`text-[10px] font-medium mb-1 ${d.isToday ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                  {d.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    d.isCompleted
                      ? 'bg-gradient-to-br from-amber-500 to-rose-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : d.isToday
                      ? 'bg-slate-800 border-2 border-dashed border-amber-500/60 text-amber-400'
                      : 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                  }`}
                  title={`${d.label} (${d.dateStr}): ${d.isCompleted ? 'Đã học' : 'Chưa học'}`}
                >
                  {d.isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : d.isToday ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  ) : (
                    <span>•</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Freeze Shield Info */}
        <div className="bg-gradient-to-r from-sky-950/40 to-indigo-950/30 rounded-xl p-3.5 border border-sky-500/30 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shrink-0 text-sky-400 shadow-sm shadow-sky-500/20">
              <Shield className="w-5 h-5 fill-sky-400/20" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-sky-200 flex items-center gap-1">
                  Khiên Bảo Vệ Chuỗi (Freeze)
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {details.freezeCount}/2 Sẵn sàng
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Tự động kích hoạt để <span className="text-sky-300 font-semibold">giữ nguyên chuỗi</span> nếu bạn bận hoặc quên mở app 1 ngày.
              </p>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-sky-400/80 font-medium">
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>Cứ mỗi chuỗi 7 ngày liên tục được tặng thêm 1 Khiên.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Best Record & Action */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Kỷ lục cao nhất:</span>
            <span className="font-bold text-slate-200">{details.bestStreak} ngày</span>
          </div>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-xs shadow-md shadow-rose-900/30 transition-all active:scale-95 touch-manipulation select-none"
          >
            Tiếp tục học
          </button>
        </div>
      </div>
    </div>
  );
};
