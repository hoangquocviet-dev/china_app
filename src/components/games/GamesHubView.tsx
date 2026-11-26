import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Zap,
  Puzzle,
  Rocket,
  Trophy,
  Play,
  Eye,
  EyeOff,
  Flame,
  Sparkles,
  BookOpen,
  Crown,
  RefreshCw,
  Cloud,
  Award,
  Volume2,
  Headphones,
} from 'lucide-react';
import type { ChineseWord, MiniGameId, GameScores, HanziLeaderboardEntry } from '../../types';
import { storageService } from '../../utils/storage';
import { audioService } from '../../utils/audio';
import { cloudSyncService, computePlayerTag } from '../../utils/cloudSync';
import { INITIAL_WORDS } from '../../data/hsk1Words';
import { TrueFalseBlitzGame } from './TrueFalseBlitzGame';
import { SpeedMatchGame } from './SpeedMatchGame';
import { WordRunnerGame } from './WordRunnerGame';
import { MiniExamGame } from './MiniExamGame';
import { ToneMasterGame } from './ToneMasterGame';
import { ListeningMasterGame } from './ListeningMasterGame';
import { PinyinChartModal } from '../speaking/PinyinChartModal';
import { RadicalsModal } from '../writer/RadicalsModal';
import { StrokeRulesModal } from '../writer/StrokeRulesModal';
import { MeasureWordsModal } from '../common/MeasureWordsModal';
import { GrammarHandbookModal } from '../common/GrammarHandbookModal';
import { AntonymsModal } from '../common/AntonymsModal';
import { ConfusingWordsModal } from '../common/ConfusingWordsModal';
import { DialoguesModal } from '../common/DialoguesModal';
import { HanziDecompositionModal } from '../common/HanziDecompositionModal';
import { ChengyuModal } from '../common/ChengyuModal';
import { NumbersTimeModal } from '../common/NumbersTimeModal';
import { SpokenResponsesModal } from '../common/SpokenResponsesModal';
import { ParticlesModal } from '../common/ParticlesModal';
import { PolyphonicModal } from '../common/PolyphonicModal';
import { ConnectorsModal } from '../common/ConnectorsModal';
import { ReduplicationModal } from '../common/ReduplicationModal';
import { ComplementsModal } from '../common/ComplementsModal';
import { BaBeiModal } from '../common/BaBeiModal';
import { ComparativesModal } from '../common/ComparativesModal';
import { SpatialModal } from '../common/SpatialModal';

interface GamesHubViewProps {
  activeWords: ChineseWord[];
  allWords: ChineseWord[];
  onRefreshWords?: () => void;
  onOpenCloudSync?: () => void;
}

type WordPoolSource = 'active' | 'notebook' | 'dictionary';

export const GamesHubView: React.FC<GamesHubViewProps> = ({
  activeWords,
  allWords,
  onRefreshWords,
  onOpenCloudSync,
}) => {
  const [selectedGame, setSelectedGame] = useState<MiniGameId | null>(null);
  const [poolSource, setPoolSource] = useState<WordPoolSource>('active');
  const [showPinyinHint, setShowPinyinHint] = useState<boolean>(true);
  const [scores, setScores] = useState<GameScores>(() => storageService.getGameScores());
  const [bestExamScore, setBestExamScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('hanziflow_exam_best_score');
      if (saved) return parseInt(saved, 10) || 0;
    }
    return 0;
  });
  const [bestToneScore, setBestToneScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('hanziflow_tone_best_score');
      if (saved) return parseInt(saved, 10) || 0;
    }
    return 0;
  });
  const [bestListeningScore, setBestListeningScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('hanziflow_listening_best_score');
      if (saved) return parseInt(saved, 10) || 0;
    }
    return 0;
  });
  const [leaderboard, setLeaderboard] = useState<HanziLeaderboardEntry[]>([]);
  const [loadingBoard, setLoadingBoard] = useState<boolean>(true);
  const [myPlayerTag, setMyPlayerTag] = useState<string>('');
  const [myNickname, setMyNickname] = useState<string>(() => cloudSyncService.getNickname());
  const [dictTick, setDictTick] = useState(0);
  const [isPinyinModalOpen, setIsPinyinModalOpen] = useState(false);
  const [isRadicalsModalOpen, setIsRadicalsModalOpen] = useState(false);
  const [isStrokeRulesModalOpen, setIsStrokeRulesModalOpen] = useState(false);
  const [isMeasureWordsModalOpen, setIsMeasureWordsModalOpen] = useState(false);
  const [isGrammarHandbookOpen, setIsGrammarHandbookOpen] = useState(false);
  const [isAntonymsModalOpen, setIsAntonymsModalOpen] = useState(false);
  const [isConfusingWordsOpen, setIsConfusingWordsOpen] = useState(false);
  const [isDialoguesModalOpen, setIsDialoguesModalOpen] = useState(false);
  const [isDecompositionOpen, setIsDecompositionOpen] = useState(false);
  const [isChengyuOpen, setIsChengyuOpen] = useState(false);
  const [isNumbersTimeOpen, setIsNumbersTimeOpen] = useState(false);
  const [isSpokenModalOpen, setIsSpokenModalOpen] = useState(false);
  const [isParticlesModalOpen, setIsParticlesModalOpen] = useState(false);
  const [isPolyphonicOpen, setIsPolyphonicOpen] = useState(false);
  const [isConnectorsOpen, setIsConnectorsOpen] = useState(false);
  const [isReduplicationOpen, setIsReduplicationOpen] = useState(false);
  const [isComplementsOpen, setIsComplementsOpen] = useState(false);
  const [isBaBeiOpen, setIsBaBeiOpen] = useState(false);
  const [isComparativesOpen, setIsComparativesOpen] = useState(false);
  const [isSpatialOpen, setIsSpatialOpen] = useState(false);

  const refreshLeaderboard = useCallback(async () => {
    setLoadingBoard(true);
    try {
      const [rows, tag] = await Promise.all([
        cloudSyncService.fetchLeaderboard(10),
        computePlayerTag(cloudSyncService.getSyncCode()),
      ]);
      setLeaderboard(rows);
      setMyPlayerTag(tag);
      setMyNickname(cloudSyncService.getNickname());
    } finally {
      setLoadingBoard(false);
    }
  }, []);

  useEffect(() => {
    setScores(storageService.getGameScores());
  }, [allWords]);

  useEffect(() => {
    void refreshLeaderboard();
    const unsub = cloudSyncService.subscribe(() => {
      const snap = cloudSyncService.getSnapshot();
      setScores(storageService.getGameScores());
      setMyNickname(snap.nickname);
      setDictTick((t) => t + 1);
      if (snap.status === 'synced') {
        void refreshLeaderboard();
      }
    });
    return unsub;
  }, [refreshLeaderboard]);

  const dictionaryWords = useMemo(
    () => storageService.getDictionaryWords(),
    [allWords, dictTick]
  );

  // Ensure at least 8 words with distinct Hanzi AND distinct Meaning so 6-pair Speed Match & 3-lane Runner never have duplicate options
  const effectivePlayWords = useMemo(() => {
    let base: ChineseWord[] = [];
    if (poolSource === 'active') {
      base = activeWords.length > 0 ? activeWords : allWords;
    } else if (poolSource === 'notebook') {
      base = allWords;
    } else {
      base = dictionaryWords;
    }

    const uniqueValid: ChineseWord[] = [];
    const seenHanzis = new Set<string>();
    const seenMeanings = new Set<string>();

    for (const item of base) {
      const hKey = item.hanzi.trim();
      const mKey = item.meaning.trim().toLowerCase();
      if (hKey && mKey && !seenHanzis.has(hKey) && !seenMeanings.has(mKey)) {
        seenHanzis.add(hKey);
        seenMeanings.add(mKey);
        uniqueValid.push(item);
      }
    }

    if (uniqueValid.length >= 8) return uniqueValid;

    const fallbackSource = allWords.length >= 8 ? [...allWords, ...INITIAL_WORDS] : INITIAL_WORDS;
    for (const item of fallbackSource) {
      const hKey = item.hanzi.trim();
      const mKey = item.meaning.trim().toLowerCase();
      if (hKey && mKey && !seenHanzis.has(hKey) && !seenMeanings.has(mKey)) {
        seenHanzis.add(hKey);
        seenMeanings.add(mKey);
        uniqueValid.push(item);
      }
      if (uniqueValid.length >= 10) break;
    }
    return uniqueValid;
  }, [activeWords, allWords, dictionaryWords, poolSource]);

  const batchRewardSRS = (masteredIds: string[]) => {
    if (!masteredIds.length) return;
    const idSet = new Set(masteredIds);
    const currentNotebook = storageService.getWords();
    let changed = false;
    const now = Date.now();

    const updated = currentNotebook.map((w) => {
      if (idSet.has(w.id)) {
        changed = true;
        return {
          ...w,
          box: Math.min(5, (w.box || 1) + 1),
          lastReviewed: now,
        };
      }
      return w;
    });

    if (changed) {
      storageService.saveWords(updated);
      onRefreshWords?.();
    }
  };

  if (selectedGame === 'blitz') {
    return (
      <TrueFalseBlitzGame
        words={effectivePlayWords}
        showPinyinHint={showPinyinHint}
        bestScore={scores.blitzBestScore}
        onBack={() => setSelectedGame(null)}
        onFinishGame={(score, maxCombo, masteredIds) => {
          storageService.recordStudyActivity();
          const updated = storageService.updateGameScores({
            blitzBestScore: score,
            blitzBestCombo: maxCombo,
          });
          setScores(updated);
          batchRewardSRS(masteredIds);
        }}
      />
    );
  }

  if (selectedGame === 'match') {
    return (
      <SpeedMatchGame
        words={effectivePlayWords}
        showPinyinHint={showPinyinHint}
        bestScore={scores.matchBestScore}
        onBack={() => setSelectedGame(null)}
        onFinishGame={(score, wavesCleared, masteredIds) => {
          storageService.recordStudyActivity();
          const updated = storageService.updateGameScores({
            matchBestScore: score,
            matchBestWaves: wavesCleared,
          });
          setScores(updated);
          batchRewardSRS(masteredIds);
        }}
      />
    );
  }

  if (selectedGame === 'runner') {
    return (
      <WordRunnerGame
        words={effectivePlayWords}
        showPinyinHint={showPinyinHint}
        bestScore={scores.runnerBestScore}
        bestDistance={scores.runnerBestDistance}
        onBack={() => setSelectedGame(null)}
        onFinishGame={(score, distanceMeters, masteredIds) => {
          storageService.recordStudyActivity();
          const updated = storageService.updateGameScores({
            runnerBestScore: score,
            runnerBestDistance: distanceMeters,
          });
          setScores(updated);
          batchRewardSRS(masteredIds);
        }}
      />
    );
  }

  if (selectedGame === 'exam') {
    return (
      <MiniExamGame
        words={effectivePlayWords}
        bestScore={bestExamScore}
        onBack={() => setSelectedGame(null)}
        onFinishExam={(finalScore) => {
          setBestExamScore((prev) => Math.max(prev, finalScore));
        }}
      />
    );
  }

  if (selectedGame === 'tone') {
    return (
      <ToneMasterGame
        words={effectivePlayWords}
        onBack={() => {
          setSelectedGame(null);
          if (typeof window !== 'undefined') {
            const saved = window.localStorage.getItem('hanziflow_tone_best_score');
            if (saved) setBestToneScore(parseInt(saved, 10) || 0);
          }
        }}
      />
    );
  }

  if (selectedGame === 'listening') {
    return (
      <ListeningMasterGame
        words={effectivePlayWords}
        onBack={() => {
          setSelectedGame(null);
          if (typeof window !== 'undefined') {
            const saved = window.localStorage.getItem('hanziflow_listening_best_score');
            if (saved) setBestListeningScore(parseInt(saved, 10) || 0);
          }
        }}
        onComplete={(score) => {
          setBestListeningScore((prev) => Math.max(prev, score));
        }}
      />
    );
  }

  const totalRecordScore =
    scores.blitzBestScore + scores.matchBestScore + scores.runnerBestScore;

  return (
    <div className="flex-1 max-w-md mx-auto w-full p-4 pb-24 flex flex-col space-y-3.5 animate-fadeIn">
      {/* Top Arcade Stats Banner */}
      <div className="p-3.5 rounded-3xl bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border border-slate-750 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-950/40 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400">Tổng điểm Kỷ lục Arcade</div>
            <div className="text-lg font-black text-amber-400 tabular-nums leading-tight">
              {totalRecordScore.toLocaleString('vi-VN')} điểm
            </div>
          </div>
        </div>

        <div className="text-right px-2.5 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-700/70">
          <div className="text-[10px] text-slate-400">Đã chơi</div>
          <div className="text-xs font-extrabold text-rose-400 tabular-nums">
            {scores.totalGamesPlayed} trận
          </div>
        </div>
      </div>

      {/* Quick Reference Tools: Pinyin, Radicals, Stroke Rules, Measure Words, Grammar & Antonyms */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          type="button"
          data-testid="games-pinyin-chart-btn"
          onClick={() => {
            audioService.playClick();
            setIsPinyinModalOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-rose-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            🔤
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Pinyin</div>
            <div className="text-[10px] text-slate-400 truncate">Biến điệu</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-radicals-btn"
          onClick={() => {
            audioService.playClick();
            setIsRadicalsModalOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-amber-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            🏮
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">50 Bộ Thủ</div>
            <div className="text-[10px] text-slate-400 truncate">Cấu tạo chữ</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-stroke-rules-btn"
          onClick={() => {
            audioService.playClick();
            setIsStrokeRulesModalOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-emerald-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            ✍️
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Bút Thuận</div>
            <div className="text-[10px] text-slate-400 truncate">7 Quy tắc</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-measure-words-btn"
          onClick={() => {
            audioService.playClick();
            setIsMeasureWordsModalOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-indigo-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            📏
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Lượng Từ</div>
            <div className="text-[10px] text-slate-400 truncate">16 Loại HSK</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-grammar-handbook-btn"
          onClick={() => {
            audioService.playClick();
            setIsGrammarHandbookOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-blue-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            📘
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Ngữ Pháp</div>
            <div className="text-[10px] text-slate-400 truncate">20 Cấu trúc</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-antonyms-btn"
          onClick={() => {
            audioService.playClick();
            setIsAntonymsModalOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-teal-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            ↔️
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Từ Trái Nghĩa</div>
            <div className="text-[10px] text-slate-400 truncate">24 Cặp HSK</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-confusing-words-btn"
          onClick={() => {
            audioService.playClick();
            setIsConfusingWordsOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-violet-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            🔍
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Từ Dễ Nhầm</div>
            <div className="text-[10px] text-slate-400 truncate">16 Cặp HSK</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-dialogues-btn"
          onClick={() => {
            audioService.playClick();
            setIsDialoguesModalOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-emerald-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            💬
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Hội Thoại</div>
            <div className="text-[10px] text-slate-400 truncate">10 Tình huống</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-decomposition-btn"
          onClick={() => {
            audioService.playClick();
            setIsDecompositionOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-amber-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            🧩
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Chiết Tự</div>
            <div className="text-[10px] text-slate-400 truncate">Nhớ chữ lâu</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-chengyu-btn"
          onClick={() => {
            audioService.playClick();
            setIsChengyuOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-rose-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            🏮
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Thành Ngữ</div>
            <div className="text-[10px] text-slate-400 truncate">24 Điển cố</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-numbers-time-btn"
          onClick={() => {
            audioService.playClick();
            setIsNumbersTimeOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-cyan-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            ⏰
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Số & Giờ</div>
            <div className="text-[10px] text-slate-400 truncate">Tiền tệ RMB</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-spoken-btn"
          onClick={() => {
            audioService.playClick();
            setIsSpokenModalOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-emerald-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            💬
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Khẩu ngữ</div>
            <div className="text-[10px] text-slate-400 truncate">Hỏi & Đáp</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-particles-btn"
          onClick={() => {
            audioService.playClick();
            setIsParticlesModalOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-violet-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            🔤
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Trợ từ</div>
            <div className="text-[10px] text-slate-400 truncate">的·得·地</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-polyphonic-btn"
          onClick={() => {
            audioService.playClick();
            setIsPolyphonicOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-amber-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            🎭
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Đa âm tiết</div>
            <div className="text-[10px] text-slate-400 truncate">多音字</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-connectors-btn"
          onClick={() => {
            audioService.playClick();
            setIsConnectorsOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-indigo-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            🔗
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Liên từ</div>
            <div className="text-[10px] text-slate-400 truncate">关联词</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-reduplication-btn"
          onClick={() => {
            audioService.playClick();
            setIsReduplicationOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-emerald-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            ✨
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Trùng điệp</div>
            <div className="text-[10px] text-slate-400 truncate">重叠词</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-complements-btn"
          onClick={() => {
            audioService.playClick();
            setIsComplementsOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-blue-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            🎯
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Bổ ngữ</div>
            <div className="text-[10px] text-slate-400 truncate">补语宝典</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-babei-btn"
          onClick={() => {
            audioService.playClick();
            setIsBaBeiOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-rose-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            🛡️
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Câu 把·被</div>
            <div className="text-[10px] text-slate-400 truncate">把字与被字</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-comparatives-btn"
          onClick={() => {
            audioService.playClick();
            setIsComparativesOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-sky-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            ⚖️
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">So sánh</div>
            <div className="text-[10px] text-slate-400 truncate">比较句</div>
          </div>
        </button>

        <button
          type="button"
          data-testid="games-spatial-btn"
          onClick={() => {
            audioService.playClick();
            setIsSpatialOpen(true);
          }}
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-750 hover:border-teal-500/40 text-left transition-all active:scale-[0.98] shadow-xs flex items-center space-x-2"
        >
          <div className="w-7 h-7 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            🧭
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-100 truncate">Phương Vị</div>
            <div className="text-[10px] text-slate-400 truncate">存现句</div>
          </div>
        </button>
      </div>

      {/* Game Deck Source & Pinyin Hint Controls */}
      <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-750 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
            <BookOpen className="w-3.5 h-3.5 text-rose-400" />
            <span>Bộ từ dùng chơi ({effectivePlayWords.length} từ):</span>
          </div>

          <button
            type="button"
            data-testid="toggle-game-pinyin"
            onClick={() => {
              audioService.playClick();
              setShowPinyinHint((prev) => !prev);
            }}
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
              showPinyinHint
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            {showPinyinHint ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>Pinyin: {showPinyinHint ? 'Bật' : 'Ẩn'}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              setPoolSource('active');
            }}
            className={`py-1.5 px-2 rounded-xl font-semibold border transition-all ${
              poolSource === 'active'
                ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                : 'bg-slate-850 text-slate-400 border-slate-750 hover:text-slate-200'
            }`}
          >
            Đang học ({activeWords.length})
          </button>
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              setPoolSource('notebook');
            }}
            className={`py-1.5 px-2 rounded-xl font-semibold border transition-all ${
              poolSource === 'notebook'
                ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                : 'bg-slate-850 text-slate-400 border-slate-750 hover:text-slate-200'
            }`}
          >
            Sổ từ ({allWords.length})
          </button>
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              setPoolSource('dictionary');
            }}
            className={`py-1.5 px-2 rounded-xl font-semibold border transition-all ${
              poolSource === 'dictionary'
                ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                : 'bg-slate-850 text-slate-400 border-slate-750 hover:text-slate-200'
            }`}
          >
            Từ điển ({dictionaryWords.length}+)
          </button>
        </div>
      </div>

      {/* FEATURED: KỲ THI THỬ HSK 1 TỔNG HỢP (10 CÂU) */}
      <div
        data-testid="game-card-exam"
        onClick={() => {
          audioService.playClick();
          setSelectedGame('exam');
        }}
        className="group cursor-pointer p-4 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-850 to-rose-950/40 border-2 border-amber-500/40 hover:border-amber-400 shadow-xl transition-all active:scale-[0.98]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-rose-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-950/50 shrink-0">
            <Award className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm sm:text-base font-extrabold text-amber-200 flex items-center gap-1">
                Thi Thử HSK 1 Tổng Hợp
              </h3>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-500/25 text-amber-300 border border-amber-400/40 animate-pulse">
                HOT
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Đề thi 10 câu ngẫu nhiên phối hợp 4 kỹ năng: Nhận diện chữ Hán, Nghe phát âm, Ghép câu & Phản xạ Đúng/Sai.
            </p>

            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-700/60">
              <div className="flex items-center space-x-2 text-[11px]">
                <span className="text-amber-300 font-bold">
                  🏆 Điểm cao nhất: {bestExamScore}/100
                </span>
              </div>

              <span className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 group-hover:from-amber-400 group-hover:to-rose-500 text-slate-950 text-xs font-black shadow-md shadow-amber-950/40">
                <Play className="w-3 h-3 fill-slate-950" />
                <span>Vào thi</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 MINI-GAME CARDS */}
      <div className="space-y-3">
        {/* GAME: Luyện Nghe Phản Xạ HSK (Listening Master) */}
        <div
          data-testid="game-card-listening"
          onClick={() => {
            audioService.playClick();
            setSelectedGame('listening');
          }}
          className="group cursor-pointer p-4 rounded-3xl bg-gradient-to-br from-slate-800/95 to-indigo-950/30 border border-indigo-500/25 hover:border-indigo-400/60 shadow-md transition-all active:scale-[0.98]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-950/50 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Luyện Nghe Phản Xạ HSK
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                  HOT · Luyện tai bản xứ
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Nghe phát âm chuẩn bản xứ, đoán nghĩa & chữ Hán với chế độ nghe lại, nghe chậm 0.75x và gợi ý Pinyin!
              </p>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-700/60">
                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="text-indigo-300 font-bold">
                    🎧 Kỷ lục: {bestListeningScore}đ
                  </span>
                </div>

                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white text-xs font-bold shadow-sm">
                  <Play className="w-3 h-3 fill-white" />
                  <span>Luyện ngay</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* GAME 0: Luyện Phản Xạ 4 Thanh Điệu (Tone Master) */}
        <div
          data-testid="game-card-tone"
          onClick={() => {
            audioService.playClick();
            setSelectedGame('tone');
          }}
          className="group cursor-pointer p-4 rounded-3xl bg-gradient-to-br from-slate-800/95 to-amber-950/30 border border-amber-500/25 hover:border-amber-400/60 shadow-md transition-all active:scale-[0.98]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-amber-950/50 shrink-0">
              <Volume2 className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Luyện Phản Xạ 4 Thanh Điệu
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                  Tone Master
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Nghe phát âm, nhận diện 4 thanh điệu (1, 2, 3, 4) và khắc sâu ngữ điệu qua sơ đồ cao độ trực quan!
              </p>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-700/60">
                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="text-amber-300 font-bold">
                    🏆 Kỷ lục: {bestToneScore}đ
                  </span>
                </div>

                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-amber-600 group-hover:bg-amber-500 text-white text-xs font-bold shadow-sm">
                  <Play className="w-3 h-3 fill-white" />
                  <span>Luyện ngay</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* GAME 1 (Option 2): Chớp Nhoáng 2 Giây */}
        <div
          data-testid="game-card-blitz"
          onClick={() => {
            audioService.playClick();
            setSelectedGame('blitz');
          }}
          className="group cursor-pointer p-4 rounded-3xl bg-gradient-to-br from-slate-800/95 to-rose-950/30 border border-rose-500/25 hover:border-rose-400/60 shadow-md transition-all active:scale-[0.98]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-950/50 shrink-0">
              <Zap className="w-6 h-6 fill-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Chớp Nhoáng 2 Giây
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                  Đúng / Sai
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Phán đoán tức thì cặp Chữ Hán & Nghĩa Việt trong 2.0s để tích lũy chuỗi Fever Combo!
              </p>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-700/60">
                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="text-amber-300 font-bold">
                    🏆 Kỷ lục: {scores.blitzBestScore}đ
                  </span>
                  {scores.blitzBestCombo > 0 && (
                    <span className="inline-flex items-center text-rose-300 font-semibold">
                      <Flame className="w-3 h-3 mr-0.5 text-amber-400" />
                      Combo x{scores.blitzBestCombo}
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-rose-600 group-hover:bg-rose-500 text-white text-xs font-bold shadow-sm">
                  <Play className="w-3 h-3 fill-white" />
                  <span>Chơi</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* GAME 2 (Option 3): Ghép Thẻ Tốc Độ 60 Giây */}
        <div
          data-testid="game-card-match"
          onClick={() => {
            audioService.playClick();
            setSelectedGame('match');
          }}
          className="group cursor-pointer p-4 rounded-3xl bg-gradient-to-br from-slate-800/95 to-indigo-950/35 border border-indigo-500/25 hover:border-indigo-400/60 shadow-md transition-all active:scale-[0.98]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-950/50 shrink-0">
              <Puzzle className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Ghép Thẻ Tốc Độ 60s
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  12 Ô Siêu Tốc
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Quét mắt ghép nhanh các cặp Hán tự & Nghĩa trong 60 giây. Phá đảo mỗi bàn cộng thêm
                +4s!
              </p>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-700/60">
                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="text-amber-300 font-bold">
                    🏆 Kỷ lục: {scores.matchBestScore}đ
                  </span>
                  {scores.matchBestWaves > 0 && (
                    <span className="inline-flex items-center text-indigo-300 font-semibold">
                      <Sparkles className="w-3 h-3 mr-0.5" />
                      {scores.matchBestWaves} bàn
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white text-xs font-bold shadow-sm">
                  <Play className="w-3 h-3 fill-white" />
                  <span>Chơi</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* GAME 3 (Option 4): Vượt Cầu Sinh Tử */}
        <div
          data-testid="game-card-runner"
          onClick={() => {
            audioService.playClick();
            setSelectedGame('runner');
          }}
          className="group cursor-pointer p-4 rounded-3xl bg-gradient-to-br from-slate-800/95 to-cyan-950/35 border border-cyan-500/25 hover:border-cyan-400/60 shadow-md transition-all active:scale-[0.98]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-950/50 shrink-0">
              <Rocket className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Vượt Cầu Sinh Tử
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Đua 3 Làn 60fps
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Lái phi thuyền lách 3 làn cầu ánh sáng, kích hoạt Turbo phóng xuyên qua cánh cổng từ
                vựng đúng!
              </p>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-700/60">
                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="text-amber-300 font-bold">
                    🏆 Kỷ lục: {scores.runnerBestScore}đ
                  </span>
                  {scores.runnerBestDistance > 0 && (
                    <span className="text-cyan-300 font-semibold">
                      🚀 Xa nhất: {scores.runnerBestDistance}m
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-cyan-600 group-hover:bg-cyan-500 text-white text-xs font-bold shadow-sm">
                  <Play className="w-3 h-3 fill-white" />
                  <span>Chơi</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE CLOUD ARCADE LEADERBOARD */}
      <div
        data-testid="arcade-leaderboard-section"
        className="p-4 rounded-3xl bg-slate-800/80 border border-slate-750 shadow-md space-y-3"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Crown className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-slate-100 truncate">
                Bảng Phong Thần
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                {myNickname ? `Bạn: ${myNickname}` : 'Xếp hạng Cloud trực tiếp'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              type="button"
              data-testid="refresh-leaderboard-btn"
              onClick={() => {
                audioService.playClick();
                void refreshLeaderboard();
              }}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
              title="Làm mới Bảng xếp hạng"
              aria-label="Làm mới Bảng xếp hạng"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingBoard ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            {onOpenCloudSync && (
              <button
                type="button"
                data-testid="leaderboard-open-cloud-btn"
                onClick={() => {
                  audioService.playClick();
                  onOpenCloudSync();
                }}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 text-[11px] font-bold transition-colors"
              >
                <Cloud className="w-3.5 h-3.5 text-rose-400" />
                <span>{myNickname ? 'Đổi tên' : 'Đặt tên'}</span>
              </button>
            )}
          </div>
        </div>

        {loadingBoard && leaderboard.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            Đang tải Bảng Phong Thần từ Cloud...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="py-5 px-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-300 font-medium">
              Chưa có cao thủ nào ghi danh trên Bảng Phong Thần!
            </p>
            <p className="text-[11px] text-slate-400">
              Hãy chơi 1 ván bất kỳ hoặc đặt biệt danh để chiếm ngôi Quán Quân #1 đầu tiên.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, idx) => {
              const rank = idx + 1;
              const isMe = Boolean(myPlayerTag && entry.player_tag === myPlayerTag);
              const badgeStyle =
                rank === 1
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black shadow-sm shadow-amber-500/30'
                  : rank === 2
                  ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 font-black'
                  : rank === 3
                  ? 'bg-gradient-to-br from-orange-400 to-amber-700 text-white font-black'
                  : 'bg-slate-900 border border-slate-700 text-slate-400 font-bold';

              return (
                <div
                  key={entry.player_tag}
                  data-testid={`leaderboard-row-${rank}`}
                  className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2.5 transition-colors ${
                    isMe
                      ? 'bg-rose-950/35 border-rose-500/40'
                      : 'bg-slate-900/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <div
                      className={`w-7 h-7 rounded-xl text-xs flex items-center justify-center shrink-0 tabular-nums ${badgeStyle}`}
                    >
                      {rank}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-100 truncate">
                          {entry.nickname}
                        </span>
                        {isMe && (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold shrink-0">
                            Bạn
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5 tabular-nums">
                        ⚡{entry.blitz_score} • 🧩{entry.match_score} • 🚀{entry.runner_score}
                        {entry.mastered_count > 0 ? ` • ${entry.mastered_count} từ thuộc` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-black text-amber-400 tabular-nums">
                      {entry.total_score.toLocaleString('vi-VN')}
                    </div>
                    <div className="text-[10px] text-slate-500">tổng điểm</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Study Modals */}
      <PinyinChartModal
        isOpen={isPinyinModalOpen}
        onClose={() => setIsPinyinModalOpen(false)}
      />
      <RadicalsModal
        isOpen={isRadicalsModalOpen}
        onClose={() => setIsRadicalsModalOpen(false)}
      />
      <StrokeRulesModal
        isOpen={isStrokeRulesModalOpen}
        onClose={() => setIsStrokeRulesModalOpen(false)}
      />
      <MeasureWordsModal
        isOpen={isMeasureWordsModalOpen}
        onClose={() => setIsMeasureWordsModalOpen(false)}
      />
      <GrammarHandbookModal
        isOpen={isGrammarHandbookOpen}
        onClose={() => setIsGrammarHandbookOpen(false)}
      />
      <AntonymsModal
        isOpen={isAntonymsModalOpen}
        onClose={() => setIsAntonymsModalOpen(false)}
      />
      <ConfusingWordsModal
        isOpen={isConfusingWordsOpen}
        onClose={() => setIsConfusingWordsOpen(false)}
      />
      <DialoguesModal
        isOpen={isDialoguesModalOpen}
        onClose={() => setIsDialoguesModalOpen(false)}
      />
      <HanziDecompositionModal
        isOpen={isDecompositionOpen}
        onClose={() => setIsDecompositionOpen(false)}
      />
      <ChengyuModal
        isOpen={isChengyuOpen}
        onClose={() => setIsChengyuOpen(false)}
      />
      <NumbersTimeModal
        isOpen={isNumbersTimeOpen}
        onClose={() => setIsNumbersTimeOpen(false)}
      />
      <SpokenResponsesModal
        isOpen={isSpokenModalOpen}
        onClose={() => setIsSpokenModalOpen(false)}
      />
      <ParticlesModal
        isOpen={isParticlesModalOpen}
        onClose={() => setIsParticlesModalOpen(false)}
      />
      <PolyphonicModal
        isOpen={isPolyphonicOpen}
        onClose={() => setIsPolyphonicOpen(false)}
      />
      <ConnectorsModal
        isOpen={isConnectorsOpen}
        onClose={() => setIsConnectorsOpen(false)}
      />
      <ReduplicationModal
        isOpen={isReduplicationOpen}
        onClose={() => setIsReduplicationOpen(false)}
      />
      <ComplementsModal
        isOpen={isComplementsOpen}
        onClose={() => setIsComplementsOpen(false)}
      />
      <BaBeiModal
        isOpen={isBaBeiOpen}
        onClose={() => setIsBaBeiOpen(false)}
      />
      <ComparativesModal
        isOpen={isComparativesOpen}
        onClose={() => setIsComparativesOpen(false)}
      />
      <SpatialModal
        isOpen={isSpatialOpen}
        onClose={() => setIsSpatialOpen(false)}
      />
    </div>
  );
};
