import React, { useState, useMemo } from 'react';
import { X, Volume2, Clock, Calendar, DollarSign, HelpCircle, CheckCircle2, RotateCcw, Hash, Flame, Sparkles } from 'lucide-react';
import {
  convertNumberToChinese,
  TIME_CLOCK_SAMPLES,
  DAY_PERIODS,
  CURRENCY_GUIDE,
  NUMBERS_QUIZ_LIST,
  type TimeClockSample,
} from '../../data/numbersTimeData';
import { audioService } from '../../utils/audio';

interface NumbersTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NumbersTimeModal: React.FC<NumbersTimeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'numbers' | 'clock' | 'dates_currency' | 'quiz'>('numbers');

  // Tab 1: Number Converter state
  const [inputNumber, setInputNumber] = useState<string>('2026');
  const convertedResult = useMemo(() => {
    const val = parseInt(inputNumber, 10);
    if (isNaN(val)) return { hanzi: 'Vui lòng nhập số nguyên', pinyin: '' };
    return convertNumberToChinese(val);
  }, [inputNumber]);

  // Tab 2: Clock state
  const [selectedTimeSample, setSelectedTimeSample] = useState<TimeClockSample>(TIME_CLOCK_SAMPLES[1]); // 08:15

  // Tab 4: Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);

  const currentQuestion = NUMBERS_QUIZ_LIST[currentQuizIndex % NUMBERS_QUIZ_LIST.length];

  if (!isOpen) return null;

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.speakChinese(text);
  };

  const handleSelectQuizOption = (option: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(option);
    setIsAnswerChecked(true);

    const isCorrect = option === currentQuestion.targetAnswer;
    if (isCorrect) {
      audioService.playSuccessChime();
      setQuizScore((prev) => prev + 10);
      setQuizStreak((prev) => prev + 1);
    } else {
      audioService.playErrorBuzz();
      setQuizStreak(0);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setCurrentQuizIndex((prev) => (prev + 1) % NUMBERS_QUIZ_LIST.length);
  };

  const handleResetQuiz = () => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizStreak(0);
  };

  return (
    <div
      role="dialog"
      data-testid="numbers-time-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs">
              ⏰
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Số Đếm, Giờ Giấc, Ngày Tháng & Tiền Tệ</h3>
              <p className="text-[11px] text-slate-400">Quy tắc đọc số vạn/ức, cách xem giờ chuẩn bản xứ & tiền RMB</p>
            </div>
          </div>
          <button
            data-testid="close-numbers-time-modal-btn"
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher: 4 tabs */}
        <div className="px-3 py-2 bg-slate-850/80 border-b border-slate-800 overflow-x-auto scrollbar-none flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-750 text-xs font-semibold shrink-0">
            <button
              data-testid="tab-numbers-converter"
              onClick={() => {
                audioService.playClick();
                setActiveTab('numbers');
              }}
              className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'numbers'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Số Đếm & Đổi Số</span>
            </button>

            <button
              data-testid="tab-clock-time"
              onClick={() => {
                audioService.playClick();
                setActiveTab('clock');
              }}
              className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'clock'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Xem Giờ & Buổi</span>
            </button>

            <button
              data-testid="tab-dates-currency"
              onClick={() => {
                audioService.playClick();
                setActiveTab('dates_currency');
              }}
              className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'dates_currency'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Ngày & Tiền Tệ</span>
            </button>

            <button
              data-testid="tab-numbers-quiz"
              onClick={() => {
                audioService.playClick();
                setActiveTab('quiz');
              }}
              className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Trắc Nghiệm Phản Xạ ⏱️</span>
            </button>
          </div>

          {activeTab === 'quiz' && (
            <div className="flex items-center space-x-2 text-xs shrink-0">
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {quizScore} điểm
              </span>
              {quizStreak > 1 && (
                <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 font-bold flex items-center gap-1 animate-pulse">
                  <Flame className="w-3 h-3 fill-rose-400" /> {quizStreak}
                </span>
              )}
            </div>
          )}
        </div>

        {/* TAB 1: NUMBERS & CONVERTER */}
        {activeTab === 'numbers' && (
          <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
            {/* Interactive Number Converter Tool */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/25 via-slate-850 to-slate-900 border border-cyan-500/30 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Bộ Chuyển Đổi Số Sang Tiếng Trung Thông Minh:</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Hỗ trợ từ 0 đến 999 triệu</span>
              </div>

              {/* Number Input */}
              <div className="relative">
                <input
                  data-testid="number-converter-input"
                  type="number"
                  min="0"
                  max="999999999"
                  value={inputNumber}
                  onChange={(e) => setInputNumber(e.target.value)}
                  placeholder="Nhập số bất kỳ (vd: 2026, 520, 10000)..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono text-base font-bold focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-[11px]">
                {[
                  { label: '520 (Tôi yêu bạn)', val: '520' },
                  { label: '1314 (Trọn đời)', val: '1314' },
                  { label: '2026 (Năm nay)', val: '2026' },
                  { label: '10,000 (1 Vạn)', val: '10000' },
                  { label: '88,888 (Phát tài)', val: '88888' },
                  { label: '1,000,000 (1 Triệu)', val: '1000000' },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      audioService.playClick();
                      setInputNumber(preset.val);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700 whitespace-nowrap active:scale-95 transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Output Display Card */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-750 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-lg sm:text-xl font-bold text-cyan-300 font-sans tracking-wide">
                    {convertedResult.hanzi}
                  </div>
                  {convertedResult.pinyin && (
                    <div className="text-xs text-rose-400 font-medium pinyin-text mt-0.5">
                      {convertedResult.pinyin}
                    </div>
                  )}
                </div>

                {convertedResult.hanzi && convertedResult.hanzi !== '—' && (
                  <button
                    onClick={(e) => handleSpeak(e, convertedResult.hanzi)}
                    className="p-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 transition-all active:scale-95 shrink-0"
                    title="Phát âm con số này"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Core Counting Rules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 二 vs 两 Rule Card */}
              <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 space-y-2">
                <div className="font-bold text-slate-100 flex items-center gap-1.5 text-xs text-amber-300">
                  <span>⚖️ Phân biệt số 2: 二 (èr) vs 两 (liǎng)</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
                  <p>
                    • <strong>Dùng 二 (èr):</strong> Số đếm đơn thuần (1, 2, 3), số thứ tự (第二), số phòng, số điện thoại, hàng chục (20 - 二十).
                  </p>
                  <p>
                    • <strong>Dùng 两 (liǎng):</strong> Khi đứng trước <em>lượng từ</em> (两个 - 2 cái), chỉ giờ giấc (两点 - 2 giờ), hoặc hàng nghìn/vạn (两千, 两万).
                  </p>
                </div>
              </div>

              {/* Rule of Zero (零) */}
              <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 space-y-2">
                <div className="font-bold text-slate-100 flex items-center gap-1.5 text-xs text-emerald-300">
                  <span>💡 Quy tắc đọc số 0 (零 líng)</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
                  <p>
                    • <strong>Số 0 ở giữa:</strong> Phải đọc là 零 (líng). Ví dụ: 105 đọc là <em>一百零五</em> (nếu đọc 一百五 người ta sẽ hiểu là 150).
                  </p>
                  <p>
                    • <strong>Nhiều số 0 liên tiếp:</strong> Chỉ đọc một chữ 零 duy nhất. Ví dụ: 1005 đọc là <em>一千零五</em>.
                  </p>
                </div>
              </div>
            </div>

            {/* Units Scale Guide */}
            <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 space-y-2">
              <div className="font-bold text-slate-200 text-xs">
                Hệ thống đếm 4 chữ số của người Trung Quốc (Hàng Vạn & Ức):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-center">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-base font-bold text-slate-100">十 (shí)</div>
                  <div className="text-slate-400 text-[10px]">10 (Mười)</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-base font-bold text-slate-100">百 (bǎi)</div>
                  <div className="text-slate-400 text-[10px]">100 (Trăm)</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-base font-bold text-slate-100">千 (qiān)</div>
                  <div className="text-slate-400 text-[10px]">1,000 (Nghìn)</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold">
                  <div className="text-base">万 (wàn)</div>
                  <div className="text-[10px] text-cyan-400/90">10,000 (Vạn)</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 font-bold">
                  <div className="text-base">亿 (yì)</div>
                  <div className="text-[10px] text-amber-400/90">100 Triệu (Ức)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLOCK & TIME */}
        {activeTab === 'clock' && (
          <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
            {/* Interactive Time Picker Display Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/25 via-slate-850 to-slate-900 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Cách Nói Giờ Thực Tế Chuẩn Bản Xứ:
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium text-[10px]">
                  {selectedTimeSample.period}
                </span>
              </div>

              {/* Big Clock Display */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-750 flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-indigo-400 font-mono tracking-wider">
                    {selectedTimeSample.time}
                  </div>
                  <div className="text-lg font-bold text-slate-100 font-sans mt-1">
                    {selectedTimeSample.hanzi}
                  </div>
                  <div className="text-xs text-rose-400 pinyin-text">
                    {selectedTimeSample.pinyin}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    {selectedTimeSample.vietnamese}
                  </div>
                </div>

                <button
                  onClick={(e) => handleSpeak(e, selectedTimeSample.hanzi)}
                  className="p-3 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all active:scale-95"
                  title="Nghe phát âm giờ này"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Time Preset Buttons */}
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-[11px]">
                {TIME_CLOCK_SAMPLES.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      audioService.playClick();
                      setSelectedTimeSample(sample);
                    }}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium border transition-all ${
                      selectedTimeSample.time === sample.time
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border-slate-750 hover:text-slate-200'
                    }`}
                  >
                    {sample.time} ({sample.hanzi})
                  </button>
                ))}
              </div>
            </div>

            {/* Time Units Formula Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
                <span className="font-bold text-slate-100 text-xs">点 (diǎn)</span>
                <span className="text-rose-400 ml-1">Giờ</span>
                <div className="text-[10px] text-slate-400 mt-1">八点 (8 giờ)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
                <span className="font-bold text-slate-100 text-xs">分 (fēn)</span>
                <span className="text-rose-400 ml-1">Phút</span>
                <div className="text-[10px] text-slate-400 mt-1">十分 (10 phút)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
                <span className="font-bold text-slate-100 text-xs">刻 (kè)</span>
                <span className="text-rose-400 ml-1">Khắc (15p)</span>
                <div className="text-[10px] text-slate-400 mt-1">一刻 (15 phút)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
                <span className="font-bold text-slate-100 text-xs">半 (bàn)</span>
                <span className="text-rose-400 ml-1">Rưỡi (30p)</span>
                <div className="text-[10px] text-slate-400 mt-1">八点半 (8 rưỡi)</div>
              </div>
            </div>

            {/* 6 Periods of the Day */}
            <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 space-y-2.5">
              <div className="font-bold text-slate-200 text-xs flex items-center justify-between">
                <span>Phân chia 6 buổi trong ngày (Thứ tự từ sớm đến đêm):</span>
                <span className="text-[10px] text-slate-400">Đặt trước giờ: [Buổi] + [Giờ]</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {DAY_PERIODS.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => handleSpeak(e, p.example)}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-cyan-300 text-xs">{p.period}</span>
                        <span className="text-[10px] text-rose-400 pinyin-text">({p.pinyin})</span>
                        <span className="text-[10px] text-slate-500 font-mono">{p.hoursRange}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{p.vietnamese}</div>
                      <div className="text-[10px] text-slate-300 font-medium mt-1">
                        Ví dụ: {p.example} ({p.examplePinyin})
                      </div>
                    </div>
                    <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DATES & CURRENCY */}
        {activeTab === 'dates_currency' && (
          <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
            {/* Dates & Calendar Formula */}
            <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 space-y-2.5">
              <div className="font-bold text-slate-100 text-xs flex items-center gap-1.5 text-cyan-300">
                <Calendar className="w-4 h-4" />
                <span>Trật tự ngày tháng trong tiếng Trung: [Năm 年] + [Tháng 月] + [Ngày 日/号] + [Thứ 星期]</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Người Trung Quốc luôn nói từ đơn vị <strong>lớn đến nhỏ</strong>: Ví dụ: <em>2026年11月26日 星期四</em> (Năm 2026, tháng 11, ngày 26, Thứ Năm).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] text-center pt-1">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-slate-200">前天 (qiántiān)</div>
                  <div className="text-[10px] text-slate-400">Hôm kia</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-slate-200">昨天 (zuótiān)</div>
                  <div className="text-[10px] text-slate-400">Hôm qua</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 font-bold">
                  <div>今天 (jīntiān)</div>
                  <div className="text-[10px]">Hôm nay</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-slate-200">明天 (míngtiān)</div>
                  <div className="text-[10px] text-slate-400">Ngày mai</div>
                </div>
              </div>
            </div>

            {/* Currency RMB Guide */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-850 to-slate-900 border border-amber-500/30 space-y-3">
              <div className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                <span>Tiền Tệ Nhân Dân Tệ (RMB - 人民币):</span>
              </div>

              <div className="space-y-2">
                {CURRENCY_GUIDE.map((cur, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-750 flex items-center justify-between gap-2.5"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100 text-xs">{cur.officialUnit}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                          Khẩu ngữ: {cur.colloquialUnit}
                        </span>
                        <span className="text-[10px] text-slate-500">{cur.ratio}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1">{cur.vietnamese}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Mẫu: <strong>{cur.example}</strong> ➔ {cur.exampleReading} ({cur.exampleMeaning})
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleSpeak(e, cur.exampleReading)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Shopping Tip Box */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 leading-relaxed">
                💡 <strong>Mẹo giao tiếp đi chợ:</strong> Câu hỏi giá phổ biến nhất là <em>"这个多少钱？"</em> (Zhè ge duōshao qián? - Cái này bao nhiêu tiền?). Trả giá: <em>"太贵了，便宜一点儿吧！"</em> (Tài guì le, piányi yìdiǎnr ba! - Đắt quá, bớt chút đi!).
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: QUIZ */}
        {activeTab === 'quiz' && (
          <div className="p-4 flex-1 overflow-y-auto flex flex-col justify-between text-xs space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Câu đố {currentQuizIndex + 1} / {NUMBERS_QUIZ_LIST.length}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                  Phản xạ Số & Giờ
                </span>
              </div>

              {/* Question Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/25 via-slate-850 to-slate-900 border border-cyan-500/30 text-center space-y-2">
                <div className="flex items-center justify-center space-x-1.5 text-cyan-400 font-bold text-xs">
                  <HelpCircle className="w-4 h-4" />
                  <span>Câu hỏi:</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-100">
                  {currentQuestion.question}
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === currentQuestion.targetAnswer;

                  let btnStyle = 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-slate-600';
                  if (isAnswerChecked) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200 font-bold';
                    } else {
                      btnStyle = 'bg-slate-850/50 border-slate-800 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      data-testid={`number-quiz-option-${idx}`}
                      disabled={isAnswerChecked}
                      onClick={() => handleSelectQuizOption(option)}
                      className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between gap-2 ${btnStyle}`}
                    >
                      <span className="font-semibold text-xs sm:text-sm">{option}</span>
                      {isAnswerChecked && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon answer */}
              {isAnswerChecked && (
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed animate-fadeIn ${
                  selectedOption === currentQuestion.targetAnswer
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}>
                  <div className="font-bold mb-1">
                    {selectedOption === currentQuestion.targetAnswer ? '🎉 Chính xác!' : 'Chưa đúng rồi!'}
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    {currentQuestion.explanation}
                  </div>
                </div>
              )}
            </div>

            {/* Quiz Footer actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handleResetQuiz}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại từ đầu</span>
              </button>

              {isAnswerChecked && (
                <button
                  data-testid="next-number-quiz-btn"
                  onClick={handleNextQuizQuestion}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all active:scale-95 shadow-md shadow-cyan-950/40"
                >
                  Câu tiếp theo →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modal Bottom Footer */}
        <div className="p-3 bg-slate-850/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>Trung tâm Số đếm & Thời gian HSK 1 - 2</span>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all active:scale-95"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
