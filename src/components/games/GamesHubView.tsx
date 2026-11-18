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
} from 'lucide-react';
import type { ChineseWord, MiniGameId, GameScores, HanziLeaderboardEntry } from '../../types';
import { storageService } from '../../utils/storage';
import { audioService } from '../../utils/audio';
import { cloudSyncService, computePlayerTag } from '../../utils/cloudSync';
import { INITIAL_WORDS } from '../../data/hsk1Words';
import { TrueFalseBlitzGame } from './TrueFalseBlitzGame';
import { SpeedMatchGame } from './SpeedMatchGame';
import { WordRunnerGame } from './WordRunnerGame';

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
  const [leaderboard, setLeaderboard] = useState<HanziLeaderboardEntry[]>([]);
  const [loadingBoard, setLoadingBoard] = useState<boolean>(true);
  const [myPlayerTag, setMyPlayerTag] = useState<string>('');
  const [myNickname, setMyNickname] = useState<string>(() => cloudSyncService.getNickname());
  const [dictTick, setDictTick] = useState(0);

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

      {/* 3 MINI-GAME CARDS */}
      <div className="space-y-3">
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
    </div>
  );
};
