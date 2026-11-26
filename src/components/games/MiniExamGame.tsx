import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  Volume2,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Flame,
  ArrowRight,
  Headphones,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ChineseWord, SentenceExercise } from '../../types';
import { audioService } from '../../utils/audio';
import { storageService } from '../../utils/storage';
import { INITIAL_WORDS } from '../../data/hsk1Words';
import { INITIAL_SENTENCES } from '../../data/hsk1Sentences';

interface MiniExamGameProps {
  words: ChineseWord[];
  bestScore?: number;
  onBack: () => void;
  onFinishExam?: (score: number) => void;
}

interface ExamOption {
  id: string;
  text: string;
  subText?: string;
  isCorrect: boolean;
}

interface ExamQuestion {
  id: string;
  category: 'meaning' | 'pinyin' | 'audio' | 'tf' | 'fill';
  categoryLabel: string;
  instruction: string;
  prompt: string;
  subPrompt?: string;
  pinyin?: string;
  audioText?: string;
  options: ExamOption[];
  explanation?: string;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateExamQuestions(wordList: ChineseWord[], sentList: SentenceExercise[]): ExamQuestion[] {
  const words = wordList && wordList.length >= 10 ? wordList : INITIAL_WORDS;
  const sents = sentList && sentList.length >= 5 ? sentList : INITIAL_SENTENCES;
  const shuffledWords = shuffleArray(words);
  const shuffledSents = shuffleArray(sents);

  const questions: ExamQuestion[] = [];

  // Q1, Q2, Q3: Meaning Recognition (Chữ Hán -> Chọn nghĩa tiếng Việt)
  for (let i = 0; i < 3; i++) {
    const target = shuffledWords[i];
    const distractors = shuffleArray(words.filter((w) => w.id !== target.id)).slice(0, 3);
    const options: ExamOption[] = shuffleArray([
      { id: target.id, text: target.meaning, subText: target.hanviet, isCorrect: true },
      ...distractors.map((d) => ({
        id: d.id,
        text: d.meaning,
        subText: d.hanviet,
        isCorrect: false,
      })),
    ]);

    questions.push({
      id: `q_meaning_${i}`,
      category: 'meaning',
      categoryLabel: 'Nhận diện Hán tự',
      instruction: 'Chọn nghĩa tiếng Việt chính xác của chữ Hán sau:',
      prompt: target.hanzi,
      pinyin: target.pinyin,
      audioText: target.hanzi,
      options,
      explanation: `${target.hanzi} (${target.pinyin}) có nghĩa là: ${target.meaning}`,
    });
  }

  // Q4, Q5: Listening Comprehension (Nghe âm thanh -> Chọn đáp án đúng)
  for (let i = 3; i < 5; i++) {
    const target = shuffledWords[i];
    const distractors = shuffleArray(words.filter((w) => w.id !== target.id)).slice(0, 3);
    const options: ExamOption[] = shuffleArray([
      { id: target.id, text: `${target.hanzi} (${target.meaning})`, isCorrect: true },
      ...distractors.map((d) => ({
        id: d.id,
        text: `${d.hanzi} (${d.meaning})`,
        isCorrect: false,
      })),
    ]);

    questions.push({
      id: `q_audio_${i}`,
      category: 'audio',
      categoryLabel: 'Nghe hiểu âm Hán',
      instruction: 'Bấm nút loa nghe phát âm và chọn từ vựng tương ứng:',
      prompt: '🎧 Bấm nghe phát âm',
      audioText: target.hanzi,
      options,
      explanation: `Phát âm "${target.pinyin}" tương ứng với chữ: ${target.hanzi} - ${target.meaning}`,
    });
  }

  // Q6, Q7: Pinyin -> Hanzi Matching (Pinyin -> Chọn chữ Hán)
  for (let i = 5; i < 7; i++) {
    const target = shuffledWords[i];
    const distractors = shuffleArray(words.filter((w) => w.id !== target.id)).slice(0, 3);
    const options: ExamOption[] = shuffleArray([
      { id: target.id, text: target.hanzi, subText: target.meaning, isCorrect: true },
      ...distractors.map((d) => ({
        id: d.id,
        text: d.hanzi,
        subText: d.meaning,
        isCorrect: false,
      })),
    ]);

    questions.push({
      id: `q_pinyin_${i}`,
      category: 'pinyin',
      categoryLabel: 'Phiên âm & Nét chữ',
      instruction: 'Chọn chữ Hán có phiên âm Pinyin sau:',
      prompt: target.pinyin,
      audioText: target.hanzi,
      options,
      explanation: `Phiên âm ${target.pinyin} là của chữ ${target.hanzi} (${target.meaning})`,
    });
  }

  // Q8, Q9: True / False Verification (Phán đoán Đúng / Sai)
  for (let i = 7; i < 9; i++) {
    const target = shuffledWords[i];
    const isActuallyTrue = Math.random() > 0.5;
    let displayedMeaning = target.meaning;
    if (!isActuallyTrue) {
      const otherWord = words.find((w) => w.id !== target.id);
      displayedMeaning = otherWord ? otherWord.meaning : 'Không xác định';
    }

    const options: ExamOption[] = [
      { id: 'opt_true', text: 'Đúng (正确)', isCorrect: isActuallyTrue },
      { id: 'opt_false', text: 'Sai (错误)', isCorrect: !isActuallyTrue },
    ];

    questions.push({
      id: `q_tf_${i}`,
      category: 'tf',
      categoryLabel: 'Phán đoán Đúng / Sai',
      instruction: `Cặp chữ Hán và nghĩa dịch dưới đây có khớp nhau không?`,
      prompt: `${target.hanzi} = "${displayedMeaning}"`,
      pinyin: target.pinyin,
      audioText: target.hanzi,
      options,
      explanation: isActuallyTrue
        ? `Chính xác! ${target.hanzi} đúng nghĩa là "${target.meaning}".`
        : `Chưa chính xác! ${target.hanzi} có nghĩa là "${target.meaning}".`,
    });
  }

  // Q10: Fill in the blank / Context Sentence (Điền từ vào câu)
  const sentTarget = shuffledSents[0] || INITIAL_SENTENCES[0];
  const tokens = sentTarget.tokens && sentTarget.tokens.length > 0 ? sentTarget.tokens : ['我', '很', '好'];
  const missingToken = tokens[Math.floor(Math.random() * tokens.length)];
  const maskedSentence = sentTarget.targetSentence.replace(missingToken, ' [ ___ ] ');

  // Create distractors from word pool
  const distractors = shuffleArray(words.filter((w) => w.hanzi !== missingToken)).slice(0, 3);
  const fillOptions: ExamOption[] = shuffleArray([
    { id: 'fill_correct', text: missingToken, isCorrect: true },
    ...distractors.map((d, idx) => ({ id: `fill_dist_${idx}`, text: d.hanzi, isCorrect: false })),
  ]);

  questions.push({
    id: `q_fill_10`,
    category: 'fill',
    categoryLabel: 'Hoàn thành câu',
    instruction: `Chọn từ thích hợp điền vào chỗ trống để tạo thành câu hoàn chỉnh:`,
    prompt: maskedSentence,
    subPrompt: `Dịch nghĩa: "${sentTarget.sourceSentence}"`,
    audioText: sentTarget.targetSentence,
    options: fillOptions,
    explanation: `Câu hoàn chỉnh: "${sentTarget.targetSentence}" (${sentTarget.sourceSentence})`,
  });

  return questions;
}

export const MiniExamGame: React.FC<MiniExamGameProps> = ({
  words,
  bestScore = 0,
  onBack,
  onFinishExam,
}) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>(() =>
    generateExamQuestions(words, storageService.getSentences())
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [localBest, setLocalBest] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('hanziflow_exam_best_score');
      if (saved) return parseInt(saved, 10) || bestScore;
    }
    return bestScore;
  });

  const currentQ = questions[currentIndex];

  // Auto-play audio when entering audio-type question
  useEffect(() => {
    if (currentQ?.category === 'audio' && currentQ.audioText && !isAnswered) {
      const timer = setTimeout(() => {
        audioService.speakChinese(currentQ.audioText!);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentQ, isAnswered]);

  const handleSelectOption = (option: ExamOption) => {
    if (isAnswered) return;
    audioService.playClick();
    setSelectedOptionId(option.id);
    setIsAnswered(true);

    if (option.isCorrect) {
      audioService.playSuccessChime();
      try {
        navigator.vibrate?.([20, 30, 20]);
      } catch {}
      setScore((prev) => prev + 10);
      setCorrectCount((prev) => prev + 1);
    } else {
      audioService.playErrorBuzz();
      try {
        navigator.vibrate?.([40, 40, 40]);
      } catch {}
    }
  };

  const handleNextQuestion = () => {
    audioService.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      // Completed the 10 questions!
      const finalScore = score + (currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect ? 10 : 0);
      finishExam(finalScore);
    }
  };

  const finishExam = (finalScore: number) => {
    setIsExamCompleted(true);
    storageService.recordStudyActivity();
    if (finalScore > localBest) {
      setLocalBest(finalScore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('hanziflow_exam_best_score', String(finalScore));
      }
    }
    onFinishExam?.(finalScore);

    if (finalScore >= 80) {
      setTimeout(() => {
        audioService.playSuccessChime();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      }, 200);
    }
  };

  const handleRestart = () => {
    audioService.playClick();
    setQuestions(generateExamQuestions(words, storageService.getSentences()));
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setCorrectCount(0);
    setIsExamCompleted(false);
  };

  // Evaluation Title & Rank
  const evaluationRank = useMemo(() => {
    if (score >= 90) {
      return {
        badge: '🏆 Xuất Sắc - HSK 1 Master',
        desc: 'Bạn nắm vững toàn diện từ vựng, âm Hán và ngữ cảnh câu!',
        color: 'from-amber-400 to-rose-500 text-amber-300',
      };
    } else if (score >= 70) {
      return {
        badge: '🌟 Đạt Chuẩn Tiêu Chuẩn',
        desc: 'Kiến thức vững vàng, hãy duy trì thêm phản xạ nghe hiểu nhé!',
        color: 'from-emerald-400 to-teal-500 text-emerald-300',
      };
    } else {
      return {
        badge: '📚 Cần Ôn Tập Thêm',
        desc: 'Hãy ôn lại Flashcard và Luyện viết để củng cố các chữ còn nhầm lẫn nhé!',
        color: 'from-slate-400 to-slate-200 text-slate-300',
      };
    }
  }, [score]);

  if (isExamCompleted) {
    return (
      <div className="flex-1 max-w-md mx-auto w-full p-4 pb-24 flex flex-col items-center justify-center animate-fadeIn text-slate-100">
        <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Trophy Hero */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-amber-500/10 border border-amber-500/30 shadow-lg shadow-amber-500/10 mb-4 animate-bounce">
            <Trophy className="w-10 h-10 text-amber-400 fill-amber-400" />
          </div>

          <h2 className="text-xl font-black text-slate-100">KẾT QUẢ THI THỬ HSK 1</h2>
          <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-amber-200 mt-2">
            {score} / 100
          </div>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            Đúng {correctCount}/10 câu hỏi
          </p>

          {/* Rank Badge */}
          <div className="my-4 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className={`text-sm font-extrabold ${evaluationRank.color}`}>
              {evaluationRank.badge}
            </div>
            <p className="text-xs text-slate-300 mt-1">{evaluationRank.desc}</p>
          </div>

          {/* Highest Score Info */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-6 font-semibold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Kỷ lục cao nhất:</span>
            <span className="text-amber-300 font-bold">{localBest}/100</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center justify-center space-x-1.5 min-h-[50px] py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 transition-all active:scale-95 touch-manipulation select-none"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Thi Đề Mới</span>
            </button>

            <button
              onClick={onBack}
              className="flex items-center justify-center space-x-1.5 min-h-[50px] py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-md shadow-rose-950/40 transition-all active:scale-95 touch-manipulation select-none"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Hoàn Thành</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-md mx-auto w-full p-4 pb-24 flex flex-col space-y-4 animate-fadeIn text-slate-100">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => {
            audioService.playClick();
            onBack();
          }}
          className="flex items-center space-x-1 min-h-[40px] px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all active:scale-95 touch-manipulation select-none"
          aria-label="Thoát bài thi"
        >
          <ChevronLeft className="w-4 h-4 text-slate-400" />
          <span>Thoát</span>
        </button>

        <div className="text-center">
          <div className="text-xs font-extrabold text-amber-300 flex items-center justify-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>THI THỬ HSK 1</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Câu {currentIndex + 1} / {questions.length}
          </div>
        </div>

        <div className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-extrabold tabular-nums">
          {score}đ
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-750">
        <div
          className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 relative overflow-hidden">
        {/* Category Chip */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/25">
            {currentQ.category === 'audio' && <Headphones className="w-3 h-3 text-rose-400" />}
            {currentQ.category === 'meaning' && <BookOpen className="w-3 h-3 text-rose-400" />}
            {currentQ.category === 'tf' && <Flame className="w-3 h-3 text-amber-400" />}
            <span>{currentQ.categoryLabel}</span>
          </span>

          {currentQ.audioText && (
            <button
              onClick={() => {
                audioService.playClick();
                audioService.speakChinese(currentQ.audioText!);
              }}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 transition-all active:scale-90 flex items-center justify-center touch-manipulation select-none"
              title="Nghe phát âm"
              aria-label="Phát âm"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Instruction */}
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          {currentQ.instruction}
        </p>

        {/* Main Prompt */}
        <div className="text-center py-3 bg-slate-850/80 rounded-2xl border border-slate-800/80">
          <div className="text-3xl font-black text-slate-100 tracking-wide select-none">
            {currentQ.prompt}
          </div>
          {currentQ.pinyin && (
            <div className="text-xs text-amber-400 font-semibold mt-1 select-none">
              {currentQ.pinyin}
            </div>
          )}
          {currentQ.subPrompt && (
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              {currentQ.subPrompt}
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-2 pt-1">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            let btnStyle = 'bg-slate-800/80 hover:bg-slate-750 border-slate-700/80 text-slate-200';

            if (isAnswered) {
              if (option.isCorrect) {
                btnStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-bold';
              } else if (isSelected && !option.isCorrect) {
                btnStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-200 font-bold';
              } else {
                btnStyle = 'bg-slate-850/50 border-slate-800 text-slate-500';
              }
            }

            return (
              <button
                key={option.id}
                disabled={isAnswered}
                onClick={() => handleSelectOption(option)}
                className={`w-full min-h-[56px] p-3.5 rounded-2xl border text-left flex items-center justify-between gap-2 text-xs transition-all active:scale-95 touch-manipulation select-none ${btnStyle}`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900/60 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div>
                    <span className="font-semibold text-sm leading-tight block">{option.text}</span>
                    {option.subText && (
                      <span className="text-[10px] text-slate-400 block mt-0.5">{option.subText}</span>
                    )}
                  </div>
                </div>

                {isAnswered && (
                  <div className="shrink-0">
                    {option.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Next Button */}
        {isAnswered && (
          <div className="pt-2 animate-fadeIn space-y-3">
            {currentQ.explanation && (
              <div className="p-3 rounded-2xl bg-slate-850 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-amber-400 block mb-0.5">Giải thích:</span>
                {currentQ.explanation}
              </div>
            )}

            <button
              onClick={handleNextQuestion}
              className="w-full min-h-[50px] py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-950/40 flex items-center justify-center space-x-2 transition-all active:scale-95 touch-manipulation select-none"
            >
              <span>{currentIndex + 1 === questions.length ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
