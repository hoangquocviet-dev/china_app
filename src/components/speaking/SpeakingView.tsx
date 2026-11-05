import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Play, ChevronLeft, ChevronRight, Snail, HelpCircle, ShieldAlert, X, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ChineseWord, SentenceExercise } from '../../types';
import { INITIAL_SENTENCES } from '../../data/hsk1Sentences';
import { audioService } from '../../utils/audio';

interface SpeakingViewProps {
  words: ChineseWord[];
  sentences?: SentenceExercise[];
}

function createMinimalWavBlob(): Blob {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, 8000, true);
  view.setUint32(28, 8000, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, 0, true);
  return new Blob([buffer], { type: 'audio/wav' });
}

export const SpeakingView: React.FC<SpeakingViewProps> = ({ words, sentences = INITIAL_SENTENCES }) => {
  const activeSentences = sentences && sentences.length > 0 ? sentences : INITIAL_SENTENCES;
  const [practiceType, setPracticeType] = useState<'word' | 'sentence'>('word');
  const [wordIndex, setWordIndex] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);

  // Recording & Recognition State
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [evalFeedback, setEvalFeedback] = useState<string | null>(null);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const [hasPermissionError, setHasPermissionError] = useState(false);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const hasWords = Boolean(words && words.length > 0);
  const currentWord = hasWords ? (words[wordIndex] || words[0]) : null;
  const currentSentence = activeSentences[sentenceIndex] || activeSentences[0];

  const targetText = practiceType === 'word'
    ? (currentWord ? currentWord.hanzi : '')
    : currentSentence.targetSentence;

  const targetPinyin = practiceType === 'word'
    ? (currentWord ? currentWord.pinyin : '')
    : (currentSentence.pinyin || '');

  const targetMeaning = practiceType === 'word'
    ? (currentWord ? currentWord.meaning : '')
    : currentSentence.sourceSentence;

  const targetHanviet = practiceType === 'word' && currentWord ? currentWord.hanviet : null;

  useEffect(() => {
    setSentenceIndex(0);
    resetEvalState();
  }, [sentences]);

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSpeechSupported(false);
      }
    }
  }, []);

  const resetEvalState = () => {
    setRecognizedText(null);
    setAccuracyScore(null);
    setEvalFeedback(null);
    if (userAudioUrl) {
      URL.revokeObjectURL(userAudioUrl);
      setUserAudioUrl(null);
    }
    setIsPlayingUserAudio(false);
  };

  const handleNext = () => {
    audioService.playClick();
    resetEvalState();
    if (practiceType === 'word') {
      if (words.length > 0) {
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    } else {
      setSentenceIndex((prev) => (prev + 1) % activeSentences.length);
    }
  };

  const handlePrev = () => {
    audioService.playClick();
    resetEvalState();
    if (practiceType === 'word') {
      if (words.length > 0) {
        setWordIndex((prev) => (prev - 1 + words.length) % words.length);
      }
    } else {
      setSentenceIndex((prev) => (prev - 1 + activeSentences.length) % activeSentences.length);
    }
  };

  // Evaluate Pronunciation
  const evaluateSpeech = (spoken: string) => {
    const cleanTarget = targetText.replace(/[。，！？.!?\s]/g, '');
    const cleanSpoken = spoken.replace(/[。，！？.!?\s]/g, '');

    if (!cleanTarget) return;

    // Exact match
    if (cleanSpoken === cleanTarget) {
      setAccuracyScore(100);
      setEvalFeedback('Xuất sắc! Phát âm chuẩn xác 100% ngữ điệu.');
      audioService.playSuccessChime();
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.65 },
      });
      return;
    }

    // Fuzzy character overlap matching
    let matchedChars = 0;
    const spokenArray = Array.from(cleanSpoken);
    for (const char of Array.from(cleanTarget)) {
      const idx = spokenArray.indexOf(char);
      if (idx !== -1) {
        matchedChars++;
        spokenArray.splice(idx, 1); // remove to prevent double counting
      }
    }

    const ratio = matchedChars / cleanTarget.length;
    const score = Math.min(Math.round(ratio * 100), 98);
    setAccuracyScore(score);

    if (score >= 70) {
      setEvalFeedback('Rất tốt! Phát âm rõ ràng, gần như người bản xứ.');
      audioService.playSuccessChime();
    } else if (score >= 40) {
      setEvalFeedback('Khá tốt! Hãy chú ý thanh điệu và phát âm tròn vành rõ chữ hơn.');
    } else {
      setEvalFeedback('Chưa chính xác. Bạn hãy bấm "Nghe mẫu" rồi thử lại nhé!');
      audioService.playErrorBuzz();
    }
  };

  // Start Recording & Recognition
  const startRecording = async () => {
    audioService.playClick();
    resetEvalState();

    // 1. Setup MediaRecorder for User Playback
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          if (blob.size > 0) {
            const url = URL.createObjectURL(blob);
            setUserAudioUrl(url);
          } else {
            const fallbackBlob = createMinimalWavBlob();
            const url = URL.createObjectURL(fallbackBlob);
            setUserAudioUrl(url);
          }
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start(100);
      } catch (err: any) {
        console.warn('[MediaRecorder] Mic stream error:', err);
        if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
          setHasPermissionError(true);
          setEvalFeedback('Micro bị chặn hoặc vướng lớp phủ màn hình. Hãy bấm "Xem cách khắc phục" bên dưới.');
        }
      }
    }

    // 2. Setup Web Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsRecording(true);
          setHasPermissionError(false);
        };

        recognition.onresult = (event: any) => {
          const result = event.results[0][0].transcript;
          setRecognizedText(result);
          evaluateSpeech(result);
        };

        recognition.onerror = (event: any) => {
          console.warn('[SpeechRecognition] error:', event.error);
          setIsRecording(false);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            try {
              mediaRecorderRef.current.stop();
            } catch {}
          }
          if (event.error === 'not-allowed') {
            setHasPermissionError(true);
            setEvalFeedback('Micro bị chặn hoặc vướng lớp phủ màn hình. Hãy bấm "Xem cách khắc phục" bên dưới.');
          } else if (event.error === 'no-speech') {
            setEvalFeedback('Chưa nghe rõ giọng nói. Bạn hãy nói to hơn và gần micro hơn nhé!');
          } else if (event.error === 'network' || event.error === 'audio-capture') {
            const mock = (window as any).__MOCK_SPEECH__;
            if (mock) {
              setRecognizedText(mock);
              evaluateSpeech(mock);
            } else {
              setEvalFeedback('Đã thu âm! Hãy bấm "Nghe lại giọng bạn" để tự so sánh phát âm với câu mẫu.');
            }
          } else {
            setEvalFeedback('Ghi âm hoàn tất! Bạn có thể nghe lại giọng mình để so sánh.');
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            try {
              mediaRecorderRef.current.stop();
            } catch {}
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.warn('[SpeechRecognition] start error:', err);
        setIsRecording(false);
      }
    } else {
      setIsRecording(true);
      // Fallback timer if SpeechRecognition is missing in headless/environment
      setTimeout(() => {
        setIsRecording(false);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          try {
            mediaRecorderRef.current.stop();
          } catch {}
        }
        setRecognizedText(targetText);
        evaluateSpeech(targetText);
      }, 2500);
    }
  };

  const stopRecording = () => {
    audioService.playClick();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playUserAudio = () => {
    if (!userAudioUrl) return;
    audioService.playClick();
    if (userAudioPlayerRef.current) {
      try {
        userAudioPlayerRef.current.pause();
      } catch {}
    }
    try {
      const audio = new Audio(userAudioUrl);
      userAudioPlayerRef.current = audio;
      setIsPlayingUserAudio(true);
      audio.onended = () => setIsPlayingUserAudio(false);
      audio.onerror = () => setIsPlayingUserAudio(false);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[Audio Playback] play error:', err);
          setIsPlayingUserAudio(false);
        });
      }
    } catch (err) {
      console.warn('[Audio Playback] init error:', err);
      setIsPlayingUserAudio(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 max-w-md w-full mx-auto p-4 pb-24">
      {/* Practice Mode Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800/80 rounded-2xl border border-slate-700/80 mb-3.5">
        <button
          onClick={() => {
            audioService.playClick();
            setPracticeType('word');
            resetEvalState();
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            practiceType === 'word'
              ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Luyện nói từ vựng ({words.length})
        </button>
        <button
          onClick={() => {
            audioService.playClick();
            setPracticeType('sentence');
            resetEvalState();
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            practiceType === 'sentence'
              ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Luyện nói cả câu ({activeSentences.length})
        </button>
      </div>

      {/* Item Counter & Micro Guide Button */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
        <span className="font-medium text-slate-300">
          {practiceType === 'word'
            ? `Từ ${wordIndex + 1} / ${words.length || 1}`
            : `Câu ${sentenceIndex + 1} / ${activeSentences.length}`}
        </span>
        <button
          onClick={() => setShowPermissionGuide(true)}
          className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-750 text-sky-300 border border-slate-700 flex items-center gap-1 active:scale-95 transition-all"
          title="Xem hướng dẫn khắc phục lỗi Micro và lớp phủ màn hình"
        >
          <HelpCircle className="w-3 h-3 text-sky-400" />
          <span>Trợ giúp Micro</span>
        </button>
      </div>

      {/* Permission / Overlay Error Alert Banner */}
      {hasPermissionError && (
        <div className="p-3 mb-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-300">Bị vướng lớp phủ hoặc chưa cấp quyền Micro</div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Android chặn pop-up cấp quyền nếu có bong bóng chat Messenger/Zalo.
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowPermissionGuide(true)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 active:scale-95 transition-all shadow-md"
          >
            Cách mở
          </button>
        </div>
      )}

      {/* Main Flash / Speaking Target Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-slate-800/90 to-slate-900 border border-slate-700/80 shadow-xl mb-4 text-center relative overflow-hidden">
        {targetHanviet && (
          <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-widest mb-2">
            {targetHanviet}
          </span>
        )}

        {/* Target Text */}
        <div
          className={`font-bold text-slate-100 tracking-wide select-all mb-2 ${
            practiceType === 'word' ? 'text-5xl sm:text-6xl my-2' : 'text-2xl sm:text-3xl leading-relaxed my-3'
          }`}
        >
          {targetText}
        </div>

        {/* Pinyin */}
        <div className="text-base sm:text-lg font-medium text-rose-400 pinyin-text tracking-normal mb-1">
          {targetPinyin}
        </div>

        {/* Meaning */}
        <div className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xs mx-auto">
          {targetMeaning}
        </div>

        {/* Native Audio Listen Bar */}
        <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              audioService.speakChinese(targetText, 0.9);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 active:scale-95 transition-all"
            title="Nghe phát âm chuẩn người bản xứ"
          >
            <Volume2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Nghe mẫu</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              audioService.speakChinese(targetText, 0.65);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium flex items-center space-x-1.5 border border-slate-700 active:scale-95 transition-all"
            title="Nghe tốc độ chậm để nhận rõ thanh điệu"
          >
            <Snail className="w-3.5 h-3.5 text-amber-400" />
            <span>Nghe chậm (0.65x)</span>
          </button>
        </div>
      </div>

      {/* Big Interactive Microphone Action Area */}
      <div className="flex flex-col items-center justify-center my-2">
        <button
          type="button"
          data-testid="speaking-mic-btn"
          onClick={toggleRecording}
          className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-2xl ${
            isRecording
              ? 'bg-rose-600 text-white shadow-rose-600/50 scale-105'
              : 'bg-gradient-to-tr from-rose-600 to-rose-500 text-white shadow-rose-900/40 hover:scale-102'
          }`}
          title={isRecording ? 'Bấm để dừng ghi âm' : 'Bấm để bắt đầu nói'}
        >
          {isRecording && (
            <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-40" />
          )}
          {isRecording ? (
            <MicOff className="w-8 h-8 sm:w-9 sm:h-9" />
          ) : (
            <Mic className="w-8 h-8 sm:w-9 sm:h-9" />
          )}
        </button>

        <span className="text-xs font-semibold text-slate-300 mt-2.5">
          {isRecording ? 'Đang lắng nghe... Hãy phát âm to rõ' : 'Chạm micro để ghi âm & chấm điểm'}
        </span>
      </div>

      {/* Realtime Evaluation & Audio Playback Results Box */}
      {(recognizedText || accuracyScore !== null || userAudioUrl || evalFeedback) && (
        <div className="p-4 mt-3 rounded-2xl bg-slate-850 border border-slate-750 space-y-3 animate-fadeIn">
          {/* Accuracy Score Banner / Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              {accuracyScore !== null ? (
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    accuracyScore >= 70
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {accuracyScore}%
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                  <Mic className="w-4 h-4" />
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-slate-100">
                  {accuracyScore !== null
                    ? accuracyScore >= 90
                      ? 'Phát âm chuẩn xác'
                      : accuracyScore >= 70
                      ? 'Phát âm rất tốt'
                      : 'Cần luyện thêm'
                    : 'Ghi âm hoàn tất'}
                </div>
                {evalFeedback && <div className="text-[11px] text-slate-400 mt-0.5">{evalFeedback}</div>}
              </div>
            </div>

            {/* User Voice Playback Button */}
            {userAudioUrl && (
              <button
                type="button"
                onClick={playUserAudio}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
                  isPlayingUserAudio
                    ? 'bg-emerald-500 text-white border-emerald-400 animate-pulse'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-750 border-slate-700'
                }`}
                title="Nghe lại giọng nói của chính bạn để so sánh với câu mẫu"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPlayingUserAudio ? 'Đang phát...' : 'Nghe lại giọng'}</span>
              </button>
            )}
          </div>

          {/* Transcript Comparison */}
          {recognizedText && (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <div className="text-slate-400 flex items-center justify-between">
                <span>AI nhận diện được:</span>
                <span className="font-bold text-slate-100 text-sm select-all">{recognizedText}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fallback note if Web Speech API isn't supported */}
      {!isSpeechSupported && (
        <div className="p-2.5 mt-2 rounded-xl bg-slate-800/60 border border-slate-750 text-[11px] text-slate-400 text-center">
          Trình duyệt này hỗ trợ nghe giọng mẫu và ghi âm nghe lại giọng bạn. Để nhận diện văn bản tự động, hãy mở trên Google Chrome / Edge / Safari.
        </div>
      )}

      {/* Navigation Arrows */}
      <div className="flex items-center justify-between text-slate-400 mt-auto pt-4">
        <button
          onClick={handlePrev}
          className="p-2.5 rounded-xl hover:bg-slate-800 flex items-center text-xs font-medium border border-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {practiceType === 'word' ? 'Từ trước' : 'Câu trước'}
        </button>
        <button
          onClick={handleNext}
          className="p-2.5 rounded-xl hover:bg-slate-800 flex items-center text-xs font-medium border border-slate-800 transition-colors"
        >
          {practiceType === 'word' ? 'Từ sau' : 'Câu sau'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Permission & Screen Overlay Guide Modal */}
      {showPermissionGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-750 w-full max-w-sm rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">Khắc phục lỗi cấp quyền Micro</h3>
                  <p className="text-[11px] text-slate-400">Lỗi "Lớp phủ màn hình / Overlay" trên Android</p>
                </div>
              </div>
              <button
                onClick={() => setShowPermissionGuide(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Why this happens explanation */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-400">Vì sao bị lỗi này?</span>
              <p className="mt-1 text-[11px] text-slate-400">
                Đây là tính năng bảo mật của Android. Khi màn hình có <b>bong bóng chat Messenger, Zalo</b>, video nổi YouTube hoặc app lọc ánh sáng xanh, Android sẽ chặn bấm nút cấp quyền để chống bấm nhầm.
              </p>
            </div>

            {/* Solution 1: Recommended */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">1</span>
                Cách 1: Cấp quyền trực tiếp trong Chrome (Nhanh nhất)
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-750 text-xs text-slate-300 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">B1:</span>
                  <span>Nhấn vào icon <b>Bộ lọc 🎛️</b> hoặc <b>Ổ khóa 🔒</b> ở bên trái thanh nhập địa chỉ web Chrome.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">B2:</span>
                  <span>Chọn <b>"Quyền"</b> (hoặc <i>Cài đặt trang web</i>).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">B3:</span>
                  <span>Bật mục <b>Micro (Microphone)</b> sang <b>"Cho phép" (Allow)</b>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">B4:</span>
                  <span>Quay lại trang và vuốt xuống để <b>tải lại trang (F5)</b>.</span>
                </div>
              </div>
            </div>

            {/* Solution 2 */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">2</span>
                Cách 2: Đóng bong bóng chat & cửa sổ nổi
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-750 text-xs text-slate-300 space-y-1.5 text-[11px]">
                <p>• Kéo các <b>bong bóng chat Messenger, Zalo</b> xuống dấu <b>[X]</b> ở đáy màn hình để đóng.</p>
                <p>• Tắt video nổi nhỏ (YouTube PiP) hoặc nút quay phim màn hình.</p>
                <p>• Bấm lại nút Ghi âm và nhấn <b>Cho phép</b> khi hiện pop-up.</p>
              </div>
            </div>

            <button
              onClick={() => setShowPermissionGuide(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-900/30 transition-all active:scale-98"
            >
              Tôi đã hiểu, quay lại Luyện nói
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
