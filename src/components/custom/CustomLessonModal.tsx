import React, { useState } from 'react';
import {
  X,
  Plus,
  Layers,
  PenTool,
  Puzzle,
  Mic,
  Volume2,
  Trash2,
  Search,
  Check,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { ChineseWord, SentenceExercise, LessonCustomConfig } from '../../types';
import { audioService } from '../../utils/audio';
import {
  autoGenerateWordFromVietnamese,
  autoGenerateSentenceFromVietnamese,
  batchGenerateWordsFromVietnamese,
  batchGenerateSentencesFromVietnamese,
} from '../../utils/vietnameseAutoGenerator';

interface CustomLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: ChineseWord[];
  sentences: SentenceExercise[];
  lessonConfig: LessonCustomConfig;
  onSaveConfig: (config: LessonCustomConfig) => void;
  onAddWord: (word: Omit<ChineseWord, 'id'>) => { success: boolean; message: string; word?: ChineseWord };
  onAddSentence: (sentence: Omit<SentenceExercise, 'id'>) => { success: boolean; message: string; sentence?: SentenceExercise };
  onAddBatchWords?: (words: Omit<ChineseWord, 'id'>[]) => number;
  onAddBatchSentences?: (sentences: Omit<SentenceExercise, 'id'>[]) => number;
  onDeleteSentence: (sentenceId: string) => void;
  onResetAll: () => void;
}

type ModalTab = 'flashcard' | 'writing' | 'assembly' | 'speaking';

export const CustomLessonModal: React.FC<CustomLessonModalProps> = ({
  isOpen,
  onClose,
  words,
  sentences,
  lessonConfig,
  onSaveConfig,
  onAddWord,
  onAddSentence,
  onAddBatchWords,
  onAddBatchSentences,
  onDeleteSentence,
  onResetAll,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('flashcard');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Forms Collapsible States
  const [isWordFormOpen, setIsWordFormOpen] = useState(false);
  const [isSentenceFormOpen, setIsSentenceFormOpen] = useState(false);

  // Vietnamese Auto-Generation State
  const [addWordMode, setAddWordMode] = useState<'vietnamese' | 'batch' | 'manual'>('vietnamese');
  const [vietnameseInput, setVietnameseInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [batchWordsInput, setBatchWordsInput] = useState('');
  const [batchWordProgress, setBatchWordProgress] = useState<{ current: number; total: number; last?: string } | null>(null);
  const [isBatchGeneratingWords, setIsBatchGeneratingWords] = useState(false);

  // Word Form State
  const [wordHanzi, setWordHanzi] = useState('');
  const [wordPinyin, setWordPinyin] = useState('');
  const [wordHanviet, setWordHanviet] = useState('');
  const [wordMeaning, setWordMeaning] = useState('');

  // Sentence Form State (for Assembly & Speaking)
  const [addSentenceMode, setAddSentenceMode] = useState<'vietnamese' | 'batch' | 'manual'>('vietnamese');
  const [vietnameseSentenceInput, setVietnameseSentenceInput] = useState('');
  const [isGeneratingSentence, setIsGeneratingSentence] = useState(false);
  const [batchSentencesInput, setBatchSentencesInput] = useState('');
  const [batchSentenceProgress, setBatchSentenceProgress] = useState<{ current: number; total: number; last?: string } | null>(null);
  const [isBatchGeneratingSentences, setIsBatchGeneratingSentences] = useState(false);
  const [sentenceTarget, setSentenceTarget] = useState('');
  const [sentencePinyin, setSentencePinyin] = useState('');
  const [sentenceMeaning, setSentenceMeaning] = useState('');
  const [sentenceTokens, setSentenceTokens] = useState('');
  const [sentenceDistractors, setSentenceDistractors] = useState('');

  if (!isOpen) return null;

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Helper getters for active IDs
  const activeFlashcardIds = lessonConfig.flashcardWordIds ?? words.map((w) => w.id);
  const activeWritingIds = lessonConfig.writingWordIds ?? words.map((w) => w.id);
  const activeAssemblyIds = lessonConfig.assemblySentenceIds ?? sentences.map((s) => s.id);
  const activeSpeakingIds = lessonConfig.speakingSentenceIds ?? sentences.map((s) => s.id);

  // Toggle word selection for Flashcard
  const toggleFlashcardWord = (id: string) => {
    audioService.playClick();
    const current = [...activeFlashcardIds];
    const exists = current.includes(id);
    let updated: string[];
    if (exists) {
      if (current.length <= 1) {
        showToast('Cần giữ ít nhất 1 từ vựng trong Flashcard.', 'error');
        return;
      }
      updated = current.filter((item) => item !== id);
    } else {
      updated = [...current, id];
    }
    onSaveConfig({ ...lessonConfig, flashcardWordIds: updated });
  };

  // Toggle word selection for Writing
  const toggleWritingWord = (id: string) => {
    audioService.playClick();
    const current = [...activeWritingIds];
    const exists = current.includes(id);
    let updated: string[];
    if (exists) {
      if (current.length <= 1) {
        showToast('Cần giữ ít nhất 1 từ vựng trong Luyện viết.', 'error');
        return;
      }
      updated = current.filter((item) => item !== id);
    } else {
      updated = [...current, id];
    }
    onSaveConfig({ ...lessonConfig, writingWordIds: updated });
  };

  // Toggle sentence selection for Assembly
  const toggleAssemblySentence = (id: string) => {
    audioService.playClick();
    const current = [...activeAssemblyIds];
    const exists = current.includes(id);
    let updated: string[];
    if (exists) {
      if (current.length <= 1) {
        showToast('Cần giữ ít nhất 1 câu trong Ghép câu.', 'error');
        return;
      }
      updated = current.filter((item) => item !== id);
    } else {
      updated = [...current, id];
    }
    onSaveConfig({ ...lessonConfig, assemblySentenceIds: updated });
  };

  // Toggle sentence selection for Speaking
  const toggleSpeakingSentence = (id: string) => {
    audioService.playClick();
    const current = [...activeSpeakingIds];
    const exists = current.includes(id);
    let updated: string[];
    if (exists) {
      if (current.length <= 1) {
        showToast('Cần giữ ít nhất 1 câu trong Luyện nói.', 'error');
        return;
      }
      updated = current.filter((item) => item !== id);
    } else {
      updated = [...current, id];
    }
    onSaveConfig({ ...lessonConfig, speakingSentenceIds: updated });
  };

  // Select All / Deselect All
  const handleSelectAllWords = (target: 'flashcard' | 'writing') => {
    audioService.playClick();
    const allIds = words.map((w) => w.id);
    if (target === 'flashcard') {
      onSaveConfig({ ...lessonConfig, flashcardWordIds: allIds });
    } else {
      onSaveConfig({ ...lessonConfig, writingWordIds: allIds });
    }
    showToast('Đã chọn tất cả từ vựng.');
  };

  const handleSelectAllSentences = (target: 'assembly' | 'speaking') => {
    audioService.playClick();
    const allIds = sentences.map((s) => s.id);
    if (target === 'assembly') {
      onSaveConfig({ ...lessonConfig, assemblySentenceIds: allIds });
    } else {
      onSaveConfig({ ...lessonConfig, speakingSentenceIds: allIds });
    }
    showToast('Đã chọn tất cả câu bài tập.');
  };

  // Handle Auto-Generate from Vietnamese Input (No Hanzi or Pinyin needed)
  const handleAutoGenerateFromVietnamese = async () => {
    if (!vietnameseInput.trim()) {
      showToast('Vui lòng nhập từ tiếng Việt.', 'error');
      return;
    }
    setIsGenerating(true);
    audioService.playClick();
    try {
      const res = await autoGenerateWordFromVietnamese(vietnameseInput.trim());
      if (res.success && res.word) {
        // Check if word is already in library
        const existingWord = words.find((w) => w.hanzi.trim() === res.word!.hanzi.trim());
        let wordId = existingWord?.id;

        if (!existingWord) {
          const added = onAddWord(res.word);
          if (added.success && added.word) {
            wordId = added.word.id;
          } else {
            showToast(added.message, 'error');
            return;
          }
        }

        if (wordId) {
          if (activeTab === 'flashcard') {
            const cur = lessonConfig.flashcardWordIds ?? words.map((w) => w.id);
            if (!cur.includes(wordId)) {
              onSaveConfig({ ...lessonConfig, flashcardWordIds: [wordId, ...cur] });
            }
          } else if (activeTab === 'writing') {
            const cur = lessonConfig.writingWordIds ?? words.map((w) => w.id);
            if (!cur.includes(wordId)) {
              onSaveConfig({ ...lessonConfig, writingWordIds: [wordId, ...cur] });
            }
          }
          setVietnameseInput('');
          setIsWordFormOpen(false);
          showToast(`Đã thêm "${res.word.hanzi}" (${res.word.pinyin}) vào bài học!`);
          audioService.playSuccessChime();
        }
      } else {
        showToast(res.message, 'error');
      }
    } catch {
      showToast('Có lỗi xảy ra khi tạo từ.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Batch Generate Words from Multi-line Vietnamese
  const handleBatchGenerateWords = async () => {
    const lines = batchWordsInput.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      showToast('Vui lòng dán danh sách từ tiếng Việt (mỗi dòng 1 từ).', 'error');
      return;
    }
    setIsBatchGeneratingWords(true);
    setBatchWordProgress({ current: 0, total: lines.length });
    audioService.playClick();

    try {
      const res = await batchGenerateWordsFromVietnamese(lines, (current, total, lastWord) => {
        setBatchWordProgress({ current, total, last: lastWord });
      });

      if (res.words.length > 0) {
        if (onAddBatchWords) {
          const addedCount = onAddBatchWords(res.words);
          audioService.playSuccessChime();
          showToast(`Đã tự động tạo và đồng bộ ${addedCount} từ vựng vào bài học!`);
        } else {
          for (const w of res.words) {
            onAddWord(w);
          }
          audioService.playSuccessChime();
          showToast(`Đã tạo thành công ${res.words.length} từ vựng!`);
        }
        setBatchWordsInput('');
        setIsWordFormOpen(false);
      } else {
        audioService.playErrorBuzz();
        showToast('Không thể tạo từ vựng từ danh sách đã nhập.', 'error');
      }
    } catch {
      audioService.playErrorBuzz();
      showToast('Có lỗi xảy ra khi tạo bộ từ vựng.', 'error');
    } finally {
      setIsBatchGeneratingWords(false);
      setBatchWordProgress(null);
    }
  };

  // Helper to auto-fill manual form from Vietnamese meaning
  const handleAutoFillManualFromVietnamese = async () => {
    const input = wordMeaning.trim() || vietnameseInput.trim();
    if (!input) {
      showToast('Vui lòng nhập nghĩa tiếng Việt để tự động điền.', 'error');
      return;
    }
    setIsGenerating(true);
    try {
      const res = await autoGenerateWordFromVietnamese(input);
      if (res.success && res.word) {
        setWordHanzi(res.word.hanzi);
        setWordPinyin(res.word.pinyin);
        setWordHanviet(res.word.hanviet);
        setWordMeaning(res.word.meaning);
        showToast(`Đã tự điền chữ Hán: ${res.word.hanzi}`);
      } else {
        showToast(res.message, 'error');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Batch Generate Sentences from Multi-line Vietnamese
  const handleBatchGenerateSentences = async () => {
    const lines = batchSentencesInput.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      showToast('Vui lòng dán danh sách câu tiếng Việt (mỗi dòng 1 câu).', 'error');
      return;
    }
    setIsBatchGeneratingSentences(true);
    setBatchSentenceProgress({ current: 0, total: lines.length });
    audioService.playClick();

    try {
      const res = await batchGenerateSentencesFromVietnamese(lines, (current, total, lastSentence) => {
        setBatchSentenceProgress({ current, total, last: lastSentence });
      });

      if (res.sentences.length > 0) {
        if (onAddBatchSentences) {
          const addedCount = onAddBatchSentences(res.sentences);
          audioService.playSuccessChime();
          showToast(`Đã tự động tạo và đồng bộ ${addedCount} câu vào Ghép câu & Luyện nói!`);
        } else {
          for (const s of res.sentences) {
            onAddSentence(s);
          }
          audioService.playSuccessChime();
          showToast(`Đã tạo thành công ${res.sentences.length} câu bài tập!`);
        }
        setBatchSentencesInput('');
        setIsSentenceFormOpen(false);
      } else {
        audioService.playErrorBuzz();
        showToast('Không thể tạo câu từ danh sách đã nhập.', 'error');
      }
    } catch {
      audioService.playErrorBuzz();
      showToast('Có lỗi xảy ra khi tạo bộ câu.', 'error');
    } finally {
      setIsBatchGeneratingSentences(false);
      setBatchSentenceProgress(null);
    }
  };

  // Handle Add New Word to Flashcard or Writing
  const handleAddNewWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordHanzi.trim()) {
      showToast('Vui lòng nhập chữ Hán.', 'error');
      return;
    }
    if (!wordMeaning.trim()) {
      showToast('Vui lòng nhập nghĩa tiếng Việt.', 'error');
      return;
    }

    const res = onAddWord({
      hanzi: wordHanzi.trim(),
      pinyin: wordPinyin.trim() || '...',
      hanviet: wordHanviet.trim().toUpperCase(),
      meaning: wordMeaning.trim(),
      pos: 'Danh từ',
      level: 'HSK1',
      examples: [],
    });

    if (res.success && res.word) {
      // Auto-include in current tab
      if (activeTab === 'flashcard') {
        const cur = lessonConfig.flashcardWordIds ?? words.map((w) => w.id);
        onSaveConfig({ ...lessonConfig, flashcardWordIds: [res.word.id, ...cur] });
      } else if (activeTab === 'writing') {
        const cur = lessonConfig.writingWordIds ?? words.map((w) => w.id);
        onSaveConfig({ ...lessonConfig, writingWordIds: [res.word.id, ...cur] });
      }

      setWordHanzi('');
      setWordPinyin('');
      setWordHanviet('');
      setWordMeaning('');
      setIsWordFormOpen(false);
      showToast(res.message);
    } else {
      showToast(res.message, 'error');
    }
  };

  // Handle Auto-generate Sentence from Vietnamese input
  const handleAutoGenerateSentenceFromVietnamese = async () => {
    if (!vietnameseSentenceInput.trim()) {
      showToast('Vui lòng nhập câu tiếng Việt.', 'error');
      return;
    }
    audioService.playClick();
    setIsGeneratingSentence(true);

    try {
      const res = await autoGenerateSentenceFromVietnamese(vietnameseSentenceInput);
      if (res.success && res.sentence) {
        const added = onAddSentence({
          ...res.sentence,
          type: activeTab === 'assembly' ? 'assembly' : 'speaking',
        });

        if (added.success && added.sentence) {
          if (activeTab === 'assembly') {
            const cur = lessonConfig.assemblySentenceIds ?? sentences.map((s) => s.id);
            onSaveConfig({ ...lessonConfig, assemblySentenceIds: [added.sentence.id, ...cur] });
          } else if (activeTab === 'speaking') {
            const cur = lessonConfig.speakingSentenceIds ?? sentences.map((s) => s.id);
            onSaveConfig({ ...lessonConfig, speakingSentenceIds: [added.sentence.id, ...cur] });
          }
          audioService.playSuccessChime();
          setVietnameseSentenceInput('');
          setIsSentenceFormOpen(false);
          showToast(`Đã tự động tạo: "${res.sentence.targetSentence}" (${res.sentence.pinyin})!`);
        } else {
          showToast(added.message, 'error');
        }
      } else {
        audioService.playErrorBuzz();
        showToast(res.message, 'error');
      }
    } catch (e) {
      audioService.playErrorBuzz();
      showToast('Có lỗi xảy ra khi tạo câu.', 'error');
    } finally {
      setIsGeneratingSentence(false);
    }
  };

  // Helper to auto-fill manual sentence form from meaning
  const handleAutoFillManualSentenceFromVietnamese = async () => {
    const raw = sentenceMeaning.trim() || vietnameseSentenceInput.trim();
    if (!raw) {
      showToast('Vui lòng nhập dịch nghĩa tiếng Việt trước.', 'error');
      return;
    }
    audioService.playClick();
    setIsGeneratingSentence(true);
    try {
      const res = await autoGenerateSentenceFromVietnamese(raw);
      if (res.success && res.sentence) {
        setSentenceTarget(res.sentence.targetSentence);
        setSentencePinyin(res.sentence.pinyin);
        setSentenceTokens(res.sentence.tokens.join(' '));
        setSentenceDistractors(res.sentence.distractorTokens.join(' '));
        if (!sentenceMeaning.trim()) {
          setSentenceMeaning(res.sentence.sourceSentence);
        }
        audioService.playSuccessChime();
        showToast(`Đã tự điền câu: ${res.sentence.targetSentence}`);
      } else {
        showToast(res.message, 'error');
      }
    } catch {
      showToast('Chưa thể tự điền câu này.', 'error');
    } finally {
      setIsGeneratingSentence(false);
    }
  };

  // Handle Add New Sentence to Assembly or Speaking
  const handleAddNewSentence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentenceTarget.trim()) {
      showToast('Vui lòng nhập câu tiếng Trung.', 'error');
      return;
    }
    if (!sentenceMeaning.trim()) {
      showToast('Vui lòng nhập bản dịch nghĩa.', 'error');
      return;
    }

    // Process tokens: split by commas or spaces
    let tokens: string[] = [];
    if (sentenceTokens.trim()) {
      tokens = sentenceTokens
        .split(/[,，\s]+/)
        .map((t) => t.trim())
        .filter(Boolean);
    } else {
      const clean = sentenceTarget.trim().replace(/[。，！？.!?]/g, '');
      tokens = Array.from(clean);
    }

    let distractors: string[] = [];
    if (sentenceDistractors.trim()) {
      distractors = sentenceDistractors
        .split(/[,，\s]+/)
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const res = onAddSentence({
      sourceLang: 'vi',
      targetLang: 'zh',
      targetSentence: sentenceTarget.trim(),
      sourceSentence: sentenceMeaning.trim(),
      pinyin: sentencePinyin.trim(),
      tokens,
      distractorTokens: distractors,
      type: activeTab === 'assembly' ? 'assembly' : 'speaking',
      includeInAssembly: true,
      includeInSpeaking: true,
    });

    if (res.success && res.sentence) {
      if (activeTab === 'assembly') {
        const cur = lessonConfig.assemblySentenceIds ?? sentences.map((s) => s.id);
        onSaveConfig({ ...lessonConfig, assemblySentenceIds: [res.sentence.id, ...cur] });
      } else if (activeTab === 'speaking') {
        const cur = lessonConfig.speakingSentenceIds ?? sentences.map((s) => s.id);
        onSaveConfig({ ...lessonConfig, speakingSentenceIds: [res.sentence.id, ...cur] });
      }

      setSentenceTarget('');
      setSentencePinyin('');
      setSentenceMeaning('');
      setSentenceTokens('');
      setSentenceDistractors('');
      setIsSentenceFormOpen(false);
      showToast(res.message);
    } else {
      showToast(res.message, 'error');
    }
  };

  // Filtered lists by search query
  const filteredWords = words.filter(
    (w) =>
      w.hanzi.includes(searchQuery) ||
      w.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.hanviet && w.hanviet.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSentences = sentences.filter(
    (s) =>
      s.targetSentence.includes(searchQuery) ||
      (s.pinyin && s.pinyin.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.sourceSentence.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-750 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-900/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 leading-tight">Tùy Chỉnh Bài Học</h2>
              <p className="text-xs text-slate-400">Chọn & thêm nội dung cho từng phân hệ học</p>
            </div>
          </div>
          <button
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title="Đóng bảng tùy chỉnh"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 p-2 bg-slate-850 border-b border-slate-800 gap-1 text-xs">
          <button
            data-testid="modal-tab-flashcard"
            onClick={() => {
              audioService.playClick();
              setActiveTab('flashcard');
              setSearchQuery('');
            }}
            className={`py-2 px-1.5 rounded-xl font-semibold flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 transition-all ${
              activeTab === 'flashcard'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Flashcard</span>
          </button>

          <button
            data-testid="modal-tab-writing"
            onClick={() => {
              audioService.playClick();
              setActiveTab('writing');
              setSearchQuery('');
            }}
            className={`py-2 px-1.5 rounded-xl font-semibold flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 transition-all ${
              activeTab === 'writing'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Luyện viết</span>
          </button>

          <button
            data-testid="modal-tab-assembly"
            onClick={() => {
              audioService.playClick();
              setActiveTab('assembly');
              setSearchQuery('');
            }}
            className={`py-2 px-1.5 rounded-xl font-semibold flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 transition-all ${
              activeTab === 'assembly'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>Ghép câu</span>
          </button>

          <button
            data-testid="modal-tab-speaking"
            onClick={() => {
              audioService.playClick();
              setActiveTab('speaking');
              setSearchQuery('');
            }}
            className={`py-2 px-1.5 rounded-xl font-semibold flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 transition-all ${
              activeTab === 'speaking'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Luyện nói</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mx-4 mt-3 px-3 py-2 rounded-xl text-xs font-medium border animate-fadeIn ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: FLASHCARD OR TAB 2: WRITING */}
          {(activeTab === 'flashcard' || activeTab === 'writing') && (
            <div className="space-y-3.5">
              {/* Top Controls & Stats */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200">
                    {activeTab === 'flashcard' ? 'Từ trong Flashcard: ' : 'Chữ trong Luyện viết: '}
                  </span>
                  <span className="text-xs font-semibold text-rose-400">
                    {activeTab === 'flashcard'
                      ? `${activeFlashcardIds.length} / ${words.length} từ`
                      : `${activeWritingIds.length} / ${words.length} chữ`}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectAllWords(activeTab)}
                    className="text-[11px] px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700"
                  >
                    Chọn tất cả
                  </button>
                </div>
              </div>

              {/* Add Word Collapsible Button */}
              <button
                type="button"
                data-testid="toggle-add-word-btn"
                onClick={() => setIsWordFormOpen(!isWordFormOpen)}
                className="w-full py-2 px-3 rounded-2xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center justify-between transition-all"
              >
                <span className="flex items-center space-x-1.5">
                  <Plus className="w-4 h-4 text-rose-400" />
                  <span>
                    {activeTab === 'flashcard' ? 'Thêm từ mới vào Flashcard' : 'Thêm chữ mới vào Luyện viết'}
                  </span>
                </span>
                {isWordFormOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Add Word Form with Vietnamese Auto-Generate */}
              {isWordFormOpen && (
                <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-3 animate-fadeIn">
                  {/* Mode switcher */}
                  <div className="grid grid-cols-3 p-1 bg-slate-900 rounded-xl border border-slate-750 gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        audioService.playClick();
                        setAddWordMode('vietnamese');
                      }}
                      className={`py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center space-x-1 transition-all ${
                        addWordMode === 'vietnamese'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Nhập 1 từ (AI)</span>
                    </button>
                    <button
                      type="button"
                      data-testid="mode-batch-word-btn"
                      onClick={() => {
                        audioService.playClick();
                        setAddWordMode('batch');
                      }}
                      className={`py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center space-x-1 transition-all ${
                        addWordMode === 'batch'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-rose-300" />
                      <span>Nhập cả bộ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        audioService.playClick();
                        setAddWordMode('manual');
                      }}
                      className={`py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center space-x-1 transition-all ${
                        addWordMode === 'manual'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>Tự điền chi tiết</span>
                    </button>
                  </div>

                  {/* Mode 1: Auto-generate single word from Vietnamese */}
                  {addWordMode === 'vietnamese' && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                          Từ tiếng Việt (Hệ thống tự dịch chữ Hán, Pinyin & Hán Việt):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            data-testid="vietnamese-word-input"
                            value={vietnameseInput}
                            onChange={(e) => setVietnameseInput(e.target.value)}
                            placeholder="VD: cà phê, trà, bác sĩ, bạn bè, yêu, đi ngủ..."
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAutoGenerateFromVietnamese();
                              }
                            }}
                          />
                          <button
                            type="button"
                            data-testid="auto-generate-btn"
                            disabled={isGenerating || !vietnameseInput.trim()}
                            onClick={handleAutoGenerateFromVietnamese}
                            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/30 flex items-center space-x-1 shrink-0 active:scale-95"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>{isGenerating ? 'Đang tạo...' : 'Tự tạo & Thêm'}</span>
                          </button>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-850/80 border border-slate-750 text-[11px] text-slate-400 space-y-1">
                        <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
                          <Sparkles className="w-3 h-3 text-rose-400" />
                          <span>Tính năng thông minh:</span>
                        </div>
                        <p>
                          Chỉ cần gõ từ tiếng Việt, AI sẽ tự động tra cứu, tạo chữ Hán, Pinyin chuẩn thanh điệu, âm Hán Việt và thêm ngay vào bài học mà bạn không cần gõ tiếng Trung!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Mode 2: Batch import multiple words */}
                  {addWordMode === 'batch' && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                          Dán danh sách từ tiếng Việt (mỗi dòng 1 từ):
                        </label>
                        <textarea
                          data-testid="batch-words-input"
                          rows={4}
                          value={batchWordsInput}
                          onChange={(e) => setBatchWordsInput(e.target.value)}
                          placeholder="cà phê&#10;trà sữa&#10;bác sĩ&#10;bạn bè&#10;yêu thích&#10;chúc mừng năm mới"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                        />
                      </div>
                      {batchWordProgress && (
                        <div className="space-y-1 bg-slate-900 p-2.5 rounded-xl border border-slate-750">
                          <div className="flex justify-between text-[11px] text-slate-300">
                            <span>Đang tạo AI: {batchWordProgress.last || '...'}</span>
                            <span className="font-semibold text-rose-400">
                              {batchWordProgress.current} / {batchWordProgress.total}
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-rose-500 h-1.5 rounded-full transition-all duration-300"
                              style={{
                                width: `${(batchWordProgress.current / batchWordProgress.total) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        data-testid="batch-generate-words-btn"
                        disabled={isBatchGeneratingWords || !batchWordsInput.trim()}
                        onClick={handleBatchGenerateWords}
                        className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/30 flex items-center justify-center space-x-1.5 active:scale-95"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>
                          {isBatchGeneratingWords ? 'Đang tự tạo bộ từ...' : 'Tự tạo & Đồng bộ cả bộ vào bài học'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Mode 3: Manual fill */}
                  {addWordMode === 'manual' && (
                    <form onSubmit={handleAddNewWord} className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                            Chữ Hán *
                          </label>
                          <input
                            type="text"
                            value={wordHanzi}
                            onChange={(e) => setWordHanzi(e.target.value)}
                            placeholder="VD: 朋友"
                            required
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                            Pinyin
                          </label>
                          <input
                            type="text"
                            value={wordPinyin}
                            onChange={(e) => setWordPinyin(e.target.value)}
                            placeholder="VD: péngyou"
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                            Âm Hán Việt
                          </label>
                          <input
                            type="text"
                            value={wordHanviet}
                            onChange={(e) => setWordHanviet(e.target.value)}
                            placeholder="VD: BẰNG HỮU"
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                            Nghĩa tiếng Việt *
                          </label>
                          <input
                            type="text"
                            value={wordMeaning}
                            onChange={(e) => setWordMeaning(e.target.value)}
                            placeholder="VD: Bạn bè, người bạn"
                            required
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={handleAutoFillManualFromVietnamese}
                          className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center space-x-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Tự điền từ nghĩa</span>
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/30"
                        >
                          Lưu từ vựng
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Search filter input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Lọc từ vựng theo chữ Hán, pinyin hoặc nghĩa..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Word List with Checkboxes */}
              <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                {filteredWords.map((word) => {
                  const isChecked =
                    activeTab === 'flashcard'
                      ? activeFlashcardIds.includes(word.id)
                      : activeWritingIds.includes(word.id);

                  return (
                    <div
                      key={word.id}
                      onClick={() =>
                        activeTab === 'flashcard'
                          ? toggleFlashcardWord(word.id)
                          : toggleWritingWord(word.id)
                      }
                      className={`p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-slate-800/90 border-rose-500/40 shadow-sm'
                          : 'bg-slate-850/40 border-slate-800/80 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-rose-600 border-rose-500 text-white'
                              : 'border-slate-600 bg-slate-800'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-base font-bold text-slate-100">{word.hanzi}</span>
                            <span className="text-xs text-rose-400 pinyin-text">{word.pinyin}</span>
                            {word.hanviet && (
                              <span className="text-[10px] text-amber-300 font-medium uppercase px-1 rounded bg-amber-500/10">
                                {word.hanviet}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 truncate">{word.meaning}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          audioService.playClick();
                          audioService.speakChinese(word.hanzi);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/60"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ASSEMBLY (GHÉP CÂU) OR TAB 4: SPEAKING (LUYỆN NÓI) */}
          {(activeTab === 'assembly' || activeTab === 'speaking') && (
            <div className="space-y-3.5">
              {/* Top Controls & Stats */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200">
                    {activeTab === 'assembly' ? 'Câu trong Ghép câu: ' : 'Câu trong Luyện nói: '}
                  </span>
                  <span className="text-xs font-semibold text-rose-400">
                    {activeTab === 'assembly'
                      ? `${activeAssemblyIds.length} / ${sentences.length} câu`
                      : `${activeSpeakingIds.length} / ${sentences.length} câu`}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectAllSentences(activeTab)}
                    className="text-[11px] px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700"
                  >
                    Chọn tất cả
                  </button>
                </div>
              </div>

              {/* Add Sentence Collapsible Button */}
              <button
                type="button"
                onClick={() => setIsSentenceFormOpen(!isSentenceFormOpen)}
                className="w-full py-2 px-3 rounded-2xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center justify-between transition-all"
              >
                <span className="flex items-center space-x-1.5">
                  <Plus className="w-4 h-4 text-rose-400" />
                  <span>
                    {activeTab === 'assembly'
                      ? 'Thêm câu mới vào Ghép câu'
                      : 'Thêm câu mới vào Luyện nói'}
                  </span>
                </span>
                {isSentenceFormOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Add Sentence Form with Vietnamese Auto-Generate */}
              {isSentenceFormOpen && (
                <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-3 animate-fadeIn">
                  {/* Mode switcher */}
                  <div className="grid grid-cols-3 p-1 bg-slate-900 rounded-xl border border-slate-750 gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        audioService.playClick();
                        setAddSentenceMode('vietnamese');
                      }}
                      className={`py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center space-x-1 transition-all ${
                        addSentenceMode === 'vietnamese'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Nhập 1 câu (AI)</span>
                    </button>
                    <button
                      type="button"
                      data-testid="mode-batch-sentence-btn"
                      onClick={() => {
                        audioService.playClick();
                        setAddSentenceMode('batch');
                      }}
                      className={`py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center space-x-1 transition-all ${
                        addSentenceMode === 'batch'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-rose-300" />
                      <span>Nhập cả bộ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        audioService.playClick();
                        setAddSentenceMode('manual');
                      }}
                      className={`py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center space-x-1 transition-all ${
                        addSentenceMode === 'manual'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>Tự điền chi tiết</span>
                    </button>
                  </div>

                  {/* Mode 1: Auto-generate sentence from Vietnamese */}
                  {addSentenceMode === 'vietnamese' && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                          Câu tiếng Việt (Hệ thống tự dịch câu Hán, Pinyin & tách mảnh ghép):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            data-testid="vietnamese-sentence-input"
                            value={vietnameseSentenceInput}
                            onChange={(e) => setVietnameseSentenceInput(e.target.value)}
                            placeholder="VD: Hôm nay tôi rất vui, Bạn muốn uống gì?..."
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAutoGenerateSentenceFromVietnamese();
                              }
                            }}
                          />
                          <button
                            type="button"
                            data-testid="auto-generate-sentence-btn"
                            disabled={isGeneratingSentence || !vietnameseSentenceInput.trim()}
                            onClick={handleAutoGenerateSentenceFromVietnamese}
                            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/30 flex items-center space-x-1 shrink-0 active:scale-95"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>{isGeneratingSentence ? 'Đang tạo...' : 'Tự tạo & Thêm'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Quick Suggestions */}
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium mb-1.5 flex items-center gap-1">
                          <span>Gợi ý câu mẫu phổ biến (bấm để điền nhanh):</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Hôm nay tôi rất vui',
                            'Bạn muốn uống gì?',
                            'Tôi rất thích uống trà',
                            'Ngày mai chúng ta đi xem phim nhé',
                            'Thời tiết hôm nay rất đẹp',
                            'Bác sĩ đang ở bệnh viện',
                          ].map((suggestion, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => {
                                audioService.playClick();
                                setVietnameseSentenceInput(suggestion);
                              }}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-rose-600/20 text-slate-300 hover:text-rose-300 border border-slate-750 transition-colors"
                            >
                              + {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-850/80 border border-slate-750 text-[11px] text-slate-400 space-y-1">
                        <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
                          <Sparkles className="w-3 h-3 text-rose-400" />
                          <span>Tính năng thông minh cho câu:</span>
                        </div>
                        <p>
                          Chỉ cần gõ tiếng Việt, hệ thống sẽ tự động dịch câu tiếng Trung, sinh Pinyin chuẩn, tự động bóc tách thành các mảnh ghép từ cho <b>Ghép câu</b> và chuẩn bị dữ liệu cho <b>Luyện nói AI</b>!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Mode 2: Batch import multiple sentences */}
                  {addSentenceMode === 'batch' && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                          Dán danh sách câu tiếng Việt (mỗi dòng 1 câu):
                        </label>
                        <textarea
                          data-testid="batch-sentences-input"
                          rows={4}
                          value={batchSentencesInput}
                          onChange={(e) => setBatchSentencesInput(e.target.value)}
                          placeholder="Hôm nay tôi rất vui&#10;Bạn muốn uống gì?&#10;Tôi thích học tiếng Trung&#10;Thời tiết hôm nay rất đẹp"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                        />
                      </div>
                      {batchSentenceProgress && (
                        <div className="space-y-1 bg-slate-900 p-2.5 rounded-xl border border-slate-750">
                          <div className="flex justify-between text-[11px] text-slate-300">
                            <span>Đang tạo AI: {batchSentenceProgress.last || '...'}</span>
                            <span className="font-semibold text-rose-400">
                              {batchSentenceProgress.current} / {batchSentenceProgress.total}
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-rose-500 h-1.5 rounded-full transition-all duration-300"
                              style={{
                                width: `${(batchSentenceProgress.current / batchSentenceProgress.total) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        data-testid="batch-generate-sentences-btn"
                        disabled={isBatchGeneratingSentences || !batchSentencesInput.trim()}
                        onClick={handleBatchGenerateSentences}
                        className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/30 flex items-center justify-center space-x-1.5 active:scale-95"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>
                          {isBatchGeneratingSentences
                            ? 'Đang tự tạo bộ câu...'
                            : 'Tự tạo & Đồng bộ cả bộ câu vào bài học'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Mode 3: Manual Sentence Fill */}
                  {addSentenceMode === 'manual' && (
                    <form onSubmit={handleAddNewSentence} className="space-y-2.5">
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                          Câu tiếng Trung *
                        </label>
                        <input
                          type="text"
                          value={sentenceTarget}
                          onChange={(e) => setSentenceTarget(e.target.value)}
                          placeholder="VD: 我们去看电影吧。"
                          required
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                            Phiên âm Pinyin
                          </label>
                          <input
                            type="text"
                            value={sentencePinyin}
                            onChange={(e) => setSentencePinyin(e.target.value)}
                            placeholder="VD: Wǒmen qù kàn diànyǐng ba."
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                            Dịch nghĩa tiếng Việt *
                          </label>
                          <input
                            type="text"
                            value={sentenceMeaning}
                            onChange={(e) => setSentenceMeaning(e.target.value)}
                            placeholder="VD: Chúng ta cùng đi xem phim nhé."
                            required
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>

                      {/* Assembly-specific tokens fields */}
                      {activeTab === 'assembly' && (
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-750">
                          <div>
                            <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                              Mảnh ghép từ (cách nhau dấu cách)
                            </label>
                            <input
                              type="text"
                              value={sentenceTokens}
                              onChange={(e) => setSentenceTokens(e.target.value)}
                              placeholder="VD: 我们 去 看 电影 吧"
                              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                              Từ gây nhiễu (tùy chọn)
                            </label>
                            <input
                              type="text"
                              value={sentenceDistractors}
                              onChange={(e) => setSentenceDistractors(e.target.value)}
                              placeholder="VD: 他 昨天 喝茶"
                              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={handleAutoFillManualSentenceFromVietnamese}
                          className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center space-x-1"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Tự điền từ nghĩa</span>
                        </button>

                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/30"
                        >
                          Lưu câu bài học
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Lọc câu bài tập..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Sentence list */}
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {filteredSentences.map((sentence) => {
                  const isChecked =
                    activeTab === 'assembly'
                      ? activeAssemblyIds.includes(sentence.id)
                      : activeSpeakingIds.includes(sentence.id);

                  return (
                    <div
                      key={sentence.id}
                      onClick={() =>
                        activeTab === 'assembly'
                          ? toggleAssemblySentence(sentence.id)
                          : toggleSpeakingSentence(sentence.id)
                      }
                      className={`p-3 rounded-2xl border flex items-start justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-slate-800/90 border-rose-500/40 shadow-sm'
                          : 'bg-slate-850/40 border-slate-800/80 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-start space-x-3 min-w-0 flex-1">
                        <div
                          className={`w-5 h-5 mt-0.5 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-rose-600 border-rose-500 text-white'
                              : 'border-slate-600 bg-slate-800'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-slate-100 select-all">
                            {sentence.targetSentence}
                          </div>
                          {sentence.pinyin && (
                            <div className="text-xs text-rose-400 pinyin-text mt-0.5">
                              {sentence.pinyin}
                            </div>
                          )}
                          <div className="text-xs text-slate-300 mt-0.5">
                            {sentence.sourceSentence}
                          </div>

                          {/* Show tokens for assembly tab */}
                          {activeTab === 'assembly' && sentence.tokens && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {sentence.tokens.map((tok, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-750 text-slate-300"
                                >
                                  {tok}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            audioService.playClick();
                            audioService.speakChinese(sentence.targetSentence);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-750"
                          title="Nghe câu mẫu"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                        </button>
                        {sentence.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              audioService.playClick();
                              if (confirm('Bạn có chắc muốn xóa câu tự tạo này?')) {
                                onDeleteSentence(sentence.id);
                                showToast('Đã xóa câu khỏi bài học.');
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                            title="Xóa câu tùy chỉnh"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-850/90 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              if (confirm('Khôi phục tất cả bài học về danh sách mặc định ban đầu?')) {
                onResetAll();
                showToast('Đã khôi phục bài học về mặc định.');
              }
            }}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mặc định</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-900/30 transition-all active:scale-95"
          >
            Hoàn tất & Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};
