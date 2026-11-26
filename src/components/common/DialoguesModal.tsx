import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, Play, Pause, Eye, EyeOff, MessageSquare, BookOpen } from 'lucide-react';
import { SITUATIONAL_DIALOGUES, type SituationalDialogue } from '../../data/dialoguesData';
import { audioService } from '../../utils/audio';

interface DialoguesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDialogueId?: string;
}

export const DialoguesModal: React.FC<DialoguesModalProps> = ({
  isOpen,
  onClose,
  initialDialogueId,
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [roleplayMode, setRoleplayMode] = useState<'both' | 'A' | 'B'>('both');

  const playTimerRef = useRef<number | null>(null);

  const currentDialogue: SituationalDialogue =
    SITUATIONAL_DIALOGUES[selectedScenarioIndex] || SITUATIONAL_DIALOGUES[0];

  useEffect(() => {
    if (initialDialogueId) {
      const idx = SITUATIONAL_DIALOGUES.findIndex((d) => d.id === initialDialogueId);
      if (idx !== -1) setSelectedScenarioIndex(idx);
    }
  }, [initialDialogueId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Stop auto play when switching dialogue or closing
  useEffect(() => {
    if (playTimerRef.current) {
      window.clearTimeout(playTimerRef.current);
      playTimerRef.current = null;
    }
    setIsPlayingAll(false);
    setActiveLineIndex(null);
  }, [selectedScenarioIndex, isOpen]);

  if (!isOpen) return null;

  const handleSpeakLine = (e: React.MouseEvent, text: string, idx: number) => {
    e.stopPropagation();
    audioService.playClick();
    setActiveLineIndex(idx);
    audioService.speakChinese(text);
  };

  const handleToggleAutoPlay = () => {
    audioService.playClick();
    if (isPlayingAll) {
      if (playTimerRef.current) {
        window.clearTimeout(playTimerRef.current);
        playTimerRef.current = null;
      }
      setIsPlayingAll(false);
      setActiveLineIndex(null);
      return;
    }

    // Start auto playing sequential lines
    setIsPlayingAll(true);
    let currentIdx = 0;

    const playNext = () => {
      if (currentIdx >= currentDialogue.lines.length) {
        setIsPlayingAll(false);
        setActiveLineIndex(null);
        return;
      }

      setActiveLineIndex(currentIdx);
      const line = currentDialogue.lines[currentIdx];
      audioService.speakChinese(line.hanzi);

      // Estimate line duration based on character count + pause
      const durationMs = Math.max(1600, line.hanzi.length * 320) + 1000;
      currentIdx += 1;
      playTimerRef.current = window.setTimeout(playNext, durationMs);
    };

    playNext();
  };

  return (
    <div
      role="dialog"
      data-testid="dialogues-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Hội Thoại Tình Huống Thực Tế HSK 1 - 2</h3>
              <p className="text-[11px] text-slate-400">10 Chủ đề giao tiếp thường ngày & Luyện đóng vai nhân vật</p>
            </div>
          </div>
          <button
            data-testid="close-dialogues-modal-btn"
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

        {/* Horizontal Scenario Carousel / Picker */}
        <div className="p-2.5 bg-slate-850/80 border-b border-slate-800 overflow-x-auto scrollbar-none flex items-center space-x-2 shrink-0">
          {SITUATIONAL_DIALOGUES.map((item, idx) => {
            const isSelected = selectedScenarioIndex === idx;
            return (
              <button
                key={item.id}
                data-testid={`scenario-btn-${item.id}`}
                onClick={() => {
                  audioService.playClick();
                  setSelectedScenarioIndex(idx);
                }}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1.5 text-xs font-semibold shrink-0 border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-750'
                }`}
              >
                <span>{item.icon}</span>
                <span className="truncate max-w-[130px]">{item.title}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-bold ${
                  isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.level}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toolbar: Toggle Pinyin, Translation, Auto-play & Roleplay Mode */}
        <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs shrink-0">
          {/* Audio Auto-play */}
          <div className="flex items-center space-x-1.5">
            <button
              data-testid="autoplay-dialogue-btn"
              onClick={handleToggleAutoPlay}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                isPlayingAll
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30 animate-pulse'
                  : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30'
              }`}
            >
              {isPlayingAll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlayingAll ? 'Tạm dừng' : 'Nghe toàn bài'}</span>
            </button>

            {/* Roleplay Selector */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-750 text-[11px] font-semibold">
              <button
                data-testid="roleplay-btn-both"
                onClick={() => setRoleplayMode('both')}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  roleplayMode === 'both' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Cả 2
              </button>
              <button
                data-testid="roleplay-btn-A"
                onClick={() => setRoleplayMode('A')}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  roleplayMode === 'A' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Đóng vai A
              </button>
              <button
                data-testid="roleplay-btn-B"
                onClick={() => setRoleplayMode('B')}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  roleplayMode === 'B' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Đóng vai B
              </button>
            </div>
          </div>

          {/* Visibility Toggles */}
          <div className="flex items-center space-x-1">
            <button
              data-testid="toggle-dialogue-pinyin"
              onClick={() => setShowPinyin((prev) => !prev)}
              className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center space-x-1 ${
                showPinyin
                  ? 'bg-slate-800 text-slate-200 border-slate-700'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
              title="Bật/Tắt Pinyin"
            >
              {showPinyin ? <Eye className="w-3.5 h-3.5 text-rose-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="text-[10px]">Pinyin</span>
            </button>

            <button
              data-testid="toggle-dialogue-translation"
              onClick={() => setShowMeaning((prev) => !prev)}
              className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center space-x-1 ${
                showMeaning
                  ? 'bg-slate-800 text-slate-200 border-slate-700'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
              title="Bật/Tắt Nghĩa tiếng Việt"
            >
              {showMeaning ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="text-[10px]">Nghĩa</span>
            </button>
          </div>
        </div>

        {/* Scrollable Dialogue Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3.5 text-xs">
          {/* Scenario Context Card */}
          <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750 text-slate-300 text-xs flex items-start gap-2.5">
            <span className="text-xl shrink-0 mt-0.5">{currentDialogue.icon}</span>
            <div className="min-w-0">
              <div className="font-bold text-slate-100 text-xs flex items-center gap-2">
                <span>{currentDialogue.title}</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  {currentDialogue.topic}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {currentDialogue.description}
              </p>
              <div className="mt-2 flex items-center space-x-4 text-[11px] text-slate-400 font-medium">
                <span>A: <strong className="text-teal-400">{currentDialogue.characters.nameA}</strong> ({currentDialogue.characters.roleA})</span>
                <span>B: <strong className="text-amber-400">{currentDialogue.characters.nameB}</strong> ({currentDialogue.characters.roleB})</span>
              </div>
            </div>
          </div>

          {/* Chat Bubbles */}
          <div className="space-y-3 pt-1">
            {currentDialogue.lines.map((line, idx) => {
              const isSpeakerA = line.speaker === 'A';
              const isUserRole =
                (roleplayMode === 'A' && isSpeakerA) || (roleplayMode === 'B' && !isSpeakerA);
              const isActivePlaying = activeLineIndex === idx;

              return (
                <div
                  key={line.id}
                  onClick={(e) => handleSpeakLine(e, line.hanzi, idx)}
                  className={`flex items-start gap-2.5 transition-all cursor-pointer ${
                    isSpeakerA ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm shrink-0 shadow-xs">
                    {isSpeakerA ? currentDialogue.characters.avatarA : currentDialogue.characters.avatarB}
                  </div>

                  {/* Message Bubble */}
                  <div
                    data-testid="dialogue-line-bubble"
                    className={`max-w-[82%] p-3 rounded-2xl border transition-all shadow-xs relative ${
                      isSpeakerA
                        ? 'bg-slate-850/90 border-teal-500/30 rounded-tl-sm'
                        : 'bg-slate-800/90 border-amber-500/30 rounded-tr-sm'
                    } ${
                      isActivePlaying ? 'ring-2 ring-emerald-400 scale-[1.01] shadow-emerald-950/50' : ''
                    } ${
                      isUserRole ? 'border-dashed border-rose-400/60 bg-rose-950/10' : ''
                    }`}
                  >
                    {/* Speaker Header */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-[10px] font-bold ${isSpeakerA ? 'text-teal-400' : 'text-amber-400'}`}>
                        {isSpeakerA ? currentDialogue.characters.nameA : currentDialogue.characters.nameB}
                      </span>
                      {isUserRole && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                          Lượt của bạn 🎭
                        </span>
                      )}
                    </div>

                    {/* Hanzi Text */}
                    <div className="text-base sm:text-lg font-bold text-slate-100 font-sans tracking-wide">
                      {line.hanzi}
                    </div>

                    {/* Pinyin Text */}
                    {showPinyin && (
                      <div className="text-[11px] text-rose-400/90 font-medium pinyin-text mt-0.5">
                        {line.pinyin}
                      </div>
                    )}

                    {/* Vietnamese Meaning */}
                    {showMeaning && (
                      <div className="text-[11px] text-slate-300 mt-1 pt-1 border-t border-slate-750/70">
                        {line.meaning}
                      </div>
                    )}

                    {/* Audio Icon indicator */}
                    <Volume2 className="w-3.5 h-3.5 text-slate-500 hover:text-white absolute bottom-2 right-2 transition-colors opacity-70" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Vocabulary Box */}
          <div className="mt-4 p-3 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Từ vựng & Mẫu câu bỏ túi của tình huống này:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {currentDialogue.keyVocabulary.map((v, i) => (
                <div
                  key={i}
                  data-testid="pocket-vocab-badge"
                  onClick={(e) => handleSpeakLine(e, v.hanzi, -1)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-750 hover:border-slate-700 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-100 text-xs">{v.hanzi}</span>
                    <span className="text-[10px] text-rose-400 ml-1.5 pinyin-text">{v.pinyin}</span>
                    <div className="text-[10px] text-slate-400">{v.meaning}</div>
                  </div>
                  <Volume2 className="w-3 h-3 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-850/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>Tình huống {selectedScenarioIndex + 1} / {SITUATIONAL_DIALOGUES.length}</span>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all active:scale-95"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
