# HanziFlow PWA (汉字流)

Ứng dụng Progressive Web App (PWA) hỗ trợ học tiếng Trung toàn diện, kế thừa kiến trúc Local-first từ `VocabFlow PWA`.

## Các chức năng chính

1. **Flashcard 3D Đa Tầng:**
   - Học từ vựng HSK 1 với Chữ Hán, Pinyin chuẩn thanh điệu và Âm Hán Việt.
   - Cơ chế Peek Mask: Ẩn/Hiện Pinyin hoặc Hán Việt để thử thách phản xạ nhận diện mặt chữ.
   - Lật thẻ 3D vật lý (`rotateX(180deg)`), hỗ trợ Spaced Repetition (SRS Leitner 5 hộp).

2. **Luyện viết chữ Hán thuận bút (Hanzi Writer Engine):**
   - Lưới kẻ chuẩn Ô Mễ (`米`) hoặc Ô Điền (`田`).
   - 3 Chế độ: Thị phạm (Animate) $\rightarrow$ Đồ nét (Guide) $\rightarrow$ Tự viết chấm điểm (Quiz).
   - Chặn hiện tượng giật cuộn trang (`touch-action: none;`) khi viết tay trên điện thoại.

3. **Ghép câu theo cấu trúc ngữ pháp (Assembly Engine):**
   - Sắp xếp các cụm từ theo đúng trật tự ngữ pháp tiếng Trung (`Chủ ngữ + Thời gian + Nơi chốn + Động từ + Tân ngữ`).
   - Giao diện Dual-board: khay chọn và khung sắp xếp hỗ trợ thao tác 1-chạm hoàn tác.

4. **Luyện dịch song ngữ 2 chiều (Translation Trainer):**
   - Dịch Trung $\rightarrow$ Việt và Việt $\rightarrow$ Trung.
   - Hỗ trợ chế độ Word-bank (không cần bàn phím Pinyin) và Gõ văn bản tự do (Fuzzy match).

5. **Âm thanh 2 tầng:**
   - Web Speech API `zh-CN` bản địa kết hợp Fallback Audio Dictionary API.
   - Hiệu ứng UI âm thanh tổng hợp trực tiếp bằng Web Audio API (0KB assets).

## Cài đặt & Chạy thử nghiệm

```bash
cd C:\gehihi\projects\hanziflow-pwa
npm install
npm run dev
```

Build production:
```bash
npm run build
npm run preview
```
