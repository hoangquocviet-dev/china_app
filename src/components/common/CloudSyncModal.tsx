import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Cloud,
  Copy,
  Check,
  RefreshCw,
  DownloadCloud,
  Sparkles,
  X,
  User,
  Link2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { cloudSyncService, type SyncStateSnapshot } from '../../utils/cloudSync';
import { audioService } from '../../utils/audio';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
}) => {
  const [snapshot, setSnapshot] = useState<SyncStateSnapshot>(() => cloudSyncService.getSnapshot());
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(snapshot.nickname);
  const [restoreInput, setRestoreInput] = useState('');
  const [activeSection, setActiveSection] = useState<'mine' | 'restore'>('mine');
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const unsub = cloudSyncService.subscribe(() => {
      setSnapshot(cloudSyncService.getSnapshot());
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const fresh = cloudSyncService.getSnapshot();
    setSnapshot(fresh);
    setNicknameInput(fresh.nickname);
    setFeedback(null);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const magicUrl = `${window.location.origin}/?sync=${encodeURIComponent(snapshot.syncCode)}`;
    QRCode.toDataURL(magicUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''));
  }, [isOpen, snapshot.syncCode]);

  if (!isOpen) return null;

  const magicUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/?sync=${encodeURIComponent(snapshot.syncCode)}`
      : '';

  const handleCopyCode = async () => {
    audioService.playClick();
    try {
      await navigator.clipboard.writeText(snapshot.syncCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  const handleCopyLink = async () => {
    audioService.playClick();
    try {
      await navigator.clipboard.writeText(magicUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  const handleSaveNickname = async (e: React.FormEvent) => {
    e.preventDefault();
    audioService.playClick();
    setBusy(true);
    cloudSyncService.setNickname(nicknameInput);
    const ok = await cloudSyncService.pushNow(true);
    setBusy(false);
    if (ok) {
      audioService.playSuccessChime();
    }
    setFeedback({
      ok,
      text: ok
        ? 'Đã lưu biệt danh & đồng bộ hồ sơ lên Cloud thành công!'
        : 'Đã lưu biệt danh trên máy (sẽ tự đẩy lên Cloud khi có mạng).',
    });
  };

  const handleManualPush = async () => {
    audioService.playClick();
    setBusy(true);
    setFeedback(null);
    const ok = await cloudSyncService.pushNow(true);
    setBusy(false);
    if (ok) {
      audioService.playSuccessChime();
    }
    setFeedback({
      ok,
      text: ok
        ? 'Đã sao lưu toàn bộ Sổ từ, Thẻ đã thuộc, Luyện câu & Kỷ lục Game lên Cloud!'
        : 'Chưa kết nối được tới Cloud. Vui lòng kiểm tra mạng Internet.',
    });
  };

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreInput.trim()) return;
    audioService.playClick();
    setBusy(true);
    setFeedback(null);
    const res = await cloudSyncService.restoreFromCode(restoreInput);
    setBusy(false);
    setFeedback({ ok: res.ok, text: res.message });
    if (res.ok) {
      audioService.playSuccessChime();
      setRestoreInput('');
      const nextSnap = cloudSyncService.getSnapshot();
      setSnapshot(nextSnap);
      setNicknameInput(nextSnap.nickname);
      onDataRestored();
    }
  };

  const formatLastSync = (ts: number | null) => {
    if (!ts) return 'Chưa đẩy lên Cloud lần nào';
    return `Cập nhật lúc ${new Date(ts).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })} - ${new Date(ts).toLocaleDateString('vi-VN')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-rose-600 via-rose-700 to-indigo-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">Đồng Bộ Đám Mây</h2>
              <p className="text-[11px] text-rose-100 mt-0.5">
                Không cần mật khẩu • Học liền mạch mọi thiết bị
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            aria-label="Đóng cửa sổ Đồng bộ Đám mây"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex p-2 bg-slate-900 border-b border-slate-800 gap-1.5 shrink-0">
          <button
            type="button"
            data-testid="cloud-tab-mine"
            onClick={() => {
              audioService.playClick();
              setActiveSection('mine');
              setFeedback(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'mine'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Mã ID của tôi
          </button>
          <button
            type="button"
            data-testid="cloud-tab-restore"
            onClick={() => {
              audioService.playClick();
              setActiveSection('restore');
              setFeedback(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'restore'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Nhập ID máy cũ
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {feedback && (
            <div
              data-testid="cloud-feedback-banner"
              className={`p-3 rounded-2xl text-xs font-semibold flex items-start gap-2 border ${
                feedback.ok
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {feedback.ok ? (
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {activeSection === 'mine' ? (
            <>
              {/* Personal Sync Code + QR Card */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-750 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Mã Định Danh Cá Nhân
                  </span>
                  <span
                    data-testid="cloud-status-badge"
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      snapshot.status === 'synced'
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : snapshot.status === 'syncing'
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        : snapshot.status === 'error'
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                        : 'bg-slate-700/60 border-slate-600 text-slate-300'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        snapshot.status === 'synced'
                          ? 'bg-emerald-400'
                          : snapshot.status === 'syncing'
                          ? 'bg-amber-400 animate-pulse'
                          : snapshot.status === 'error'
                          ? 'bg-rose-400'
                          : 'bg-slate-400'
                      }`}
                    />
                    {snapshot.status === 'synced'
                      ? 'Đã đồng bộ'
                      : snapshot.status === 'syncing'
                      ? 'Đang đồng bộ...'
                      : snapshot.status === 'error'
                      ? 'Lỗi mạng'
                      : 'Chưa đồng bộ'}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-2xl px-3.5 py-2.5">
                  <code
                    data-testid="current-sync-code"
                    className="text-lg sm:text-xl font-black tracking-wider text-amber-300 font-mono select-all"
                  >
                    {snapshot.syncCode}
                  </code>
                  <button
                    type="button"
                    data-testid="copy-sync-code-btn"
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all active:scale-95"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Đã chép' : 'Chép mã'}</span>
                  </button>
                </div>

                {/* QR Magic Link */}
                {qrDataUrl && (
                  <div className="flex flex-col items-center pt-1">
                    <div className="p-2.5 bg-white rounded-2xl shadow-md">
                      <img
                        src={qrDataUrl}
                        alt="QR đồng bộ sang điện thoại khác"
                        className="w-36 h-36 rounded-lg block"
                      />
                    </div>
                    <p className="text-[11px] text-center text-slate-400 mt-2 max-w-[260px] leading-relaxed">
                      Dùng camera điện thoại hoặc iPad quét mã QR này để mở ngay bộ Hán tự & kỷ lục của bạn!
                    </p>
                    <button
                      type="button"
                      data-testid="copy-magic-link-btn"
                      onClick={handleCopyLink}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Đã chép đường link!' : 'Sao chép Link mở nhanh'}</span>
                    </button>
                  </div>
                )}

                <p className="text-[11px] text-center text-slate-500 pt-0.5">
                  {formatLastSync(snapshot.lastSyncedAt)}
                </p>
              </div>

              {/* Nickname Form for Arcade Leaderboard */}
              <form onSubmit={handleSaveNickname} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Biệt danh trên Bảng Phong Thần & Cộng đồng</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={24}
                    data-testid="nickname-input"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    placeholder="VD: Tiểu Long HSK..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    data-testid="save-nickname-btn"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    Lưu
                  </button>
                </div>
              </form>

              {/* Manual Cloud Backup Button */}
              <button
                type="button"
                disabled={busy}
                data-testid="cloud-push-now-btn"
                onClick={handleManualPush}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${busy ? 'animate-spin' : ''}`} />
                <span>Đồng bộ lên Cloud ngay</span>
              </button>
            </>
          ) : (
            <form onSubmit={handleRestore} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-950/35 border border-indigo-500/25 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Chuyển tiến độ từ máy cũ sang máy này</span>
                </div>
                <p>
                  Nhập mã ID <strong className="text-amber-300">HF-XXXX-XXXX</strong> hiển thị ở máy cũ
                  của bạn để tải toàn bộ Sổ từ Hán tự, Thẻ đã thuộc, Câu tự tạo và Điểm kỷ lục 3 trò chơi về máy này.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Nhập mã định danh của bạn
                </label>
                <input
                  type="text"
                  data-testid="restore-code-input"
                  value={restoreInput}
                  onChange={(e) => setRestoreInput(e.target.value.toUpperCase())}
                  placeholder="HF-XXXX-XXXX"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-700 bg-slate-800 text-amber-300 font-mono font-black text-center text-lg tracking-widest uppercase placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={busy || !restoreInput.trim()}
                data-testid="restore-submit-btn"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <DownloadCloud className={`w-4 h-4 ${busy ? 'animate-bounce' : ''}`} />
                <span>{busy ? 'Đang tải từ Cloud...' : 'Khôi phục dữ liệu từ Cloud'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
