export interface BasicStrokeItem {
  id: string;
  name: string;
  chineseName: string;
  pinyin: string;
  symbol: string;
  direction: string;
  description: string;
  tip: string;
  examples: Array<{
    hanzi: string;
    pinyin: string;
    meaning: string;
  }>;
}

export interface StrokeOrderRule {
  id: string;
  ruleNumber: number;
  title: string;
  chineseTitle: string;
  pinyinTitle: string;
  principle: string;
  explanation: string;
  tip: string;
  examples: Array<{
    hanzi: string;
    pinyin: string;
    meaning: string;
    breakdown: string;
  }>;
}

export const BASIC_STROKES: BasicStrokeItem[] = [
  {
    id: 'heng',
    name: 'Nét Ngang',
    chineseName: '横',
    pinyin: 'héng',
    symbol: '一',
    direction: 'Từ trái sang phải (—)',
    description: 'Nét nằm ngang từ trái qua phải, đầu nét đặt bút dứt khoát, thân nét thẳng đều và hơi chếch nhẹ lên trên khoảng 3-5 độ.',
    tip: 'Khởi bút nhấn nhẹ, hành bút đều tay, thu bút hơi ghì nhẹ rồi nhấc bút để tạo cảm giác vững chãi.',
    examples: [
      { hanzi: '一', pinyin: 'yī', meaning: 'Số một' },
      { hanzi: '二', pinyin: 'èr', meaning: 'Số hai' },
      { hanzi: '三', pinyin: 'sān', meaning: 'Số ba' },
      { hanzi: '十', pinyin: 'shí', meaning: 'Số mười' },
      { hanzi: '大', pinyin: 'dà', meaning: 'Lớn, to' },
    ],
  },
  {
    id: 'shu',
    name: 'Nét Sổ',
    chineseName: '竖',
    pinyin: 'shù',
    symbol: '丨',
    direction: 'Từ trên xuống dưới (|)',
    description: 'Nét thẳng đứng vuông góc từ trên xuống dưới, đóng vai trò như cột sống của chữ Hán.',
    tip: 'Giữ thân thẳng đứng, không xiêu vẹo. Có 2 dạng: Sổ huyền (cuối nét nhọn vuốt nhẹ) và Sổ thùy lộ (cuối nét thu tròn giọt nước).',
    examples: [
      { hanzi: '十', pinyin: 'shí', meaning: 'Số mười' },
      { hanzi: '中', pinyin: 'zhōng', meaning: 'Ở giữa, trung tâm' },
      { hanzi: '木', pinyin: 'mù', meaning: 'Cây, gỗ' },
      { hanzi: '山', pinyin: 'shān', meaning: 'Núi non' },
      { hanzi: '日', pinyin: 'rì', meaning: 'Mặt trời, ngày' },
    ],
  },
  {
    id: 'pie',
    name: 'Nét Phẩy',
    chineseName: '撇',
    pinyin: 'piě',
    symbol: '丿',
    direction: 'Từ trên xuống, uốn cong sang trái (／)',
    description: 'Nét nghiêng uốn cong từ trên xuống dưới và lướt chếch sang phía dưới bên trái.',
    tip: 'Đầu nét dày dặn, đuôi nét vuốt nhọn bay bổng nhẹ nhàng như chiếc lá rơi.',
    examples: [
      { hanzi: '人', pinyin: 'rén', meaning: 'Con người' },
      { hanzi: '八', pinyin: 'bā', meaning: 'Số tám' },
      { hanzi: '月', pinyin: 'yuè', meaning: 'Mặt trăng, tháng' },
      { hanzi: '千', pinyin: 'qiān', meaning: 'Một nghìn' },
      { hanzi: '生', pinyin: 'shēng', meaning: 'Sinh sống, học sinh' },
    ],
  },
  {
    id: 'na',
    name: 'Nét Mác',
    chineseName: '捺',
    pinyin: 'nà',
    symbol: '㇏',
    direction: 'Từ trên xuống, lượn sang phải (＼)',
    description: 'Nét uốn từ trên xuống dưới rồi lượn phẳng dần sang góc dưới bên phải, đối xứng với nét phẩy.',
    tip: 'Khởi bút nhẹ nhọn, giữa nét nhấn đè bút cho đậm bè ra, cuối nét vuốt nhọn sang ngang.',
    examples: [
      { hanzi: '人', pinyin: 'rén', meaning: 'Con người' },
      { hanzi: '大', pinyin: 'dà', meaning: 'Lớn, to lớn' },
      { hanzi: '天', pinyin: 'tiān', meaning: 'Bầu trời, ngày' },
      { hanzi: '文', pinyin: 'wén', meaning: 'Văn hóa, chữ viết' },
      { hanzi: '太', pinyin: 'tài', meaning: 'Quá, rất' },
    ],
  },
  {
    id: 'dian',
    name: 'Nét Chấm',
    chineseName: '点',
    pinyin: 'diǎn',
    symbol: '丶',
    direction: 'Chấm từ trên xuống sang phải (•)',
    description: 'Nét điểm ngắn từ trên xuống dưới hơi chếch sang phải như giọt nước rơi nghiêng.',
    tip: 'Đầu nhọn thon, bụng căng tròn, thu bút dứt khoát không kéo dài thành vệt lê thê.',
    examples: [
      { hanzi: '六', pinyin: 'liù', meaning: 'Số sáu' },
      { hanzi: '下', pinyin: 'xià', meaning: 'Ở dưới, đi xuống' },
      { hanzi: '雨', pinyin: 'yǔ', meaning: 'Cơn mưa' },
      { hanzi: '字', pinyin: 'zì', meaning: 'Chữ viết' },
      { hanzi: '点', pinyin: 'diǎn', meaning: 'Điểm, giờ' },
    ],
  },
  {
    id: 'ti',
    name: 'Nét Hất',
    chineseName: '提',
    pinyin: 'tí',
    symbol: '㇀',
    direction: 'Hất nhanh từ dưới lên sang phải (↗)',
    description: 'Nét hất chéo vút từ góc dưới bên trái hất chếch lên phía trên bên phải.',
    tip: 'Đặt bút nhấn mạnh từ gốc, hất nhanh và nhọn dần về ngọn như cú quất roi.',
    examples: [
      { hanzi: '地', pinyin: 'dì', meaning: 'Đất đai' },
      { hanzi: '冷', pinyin: 'lěng', meaning: 'Lạnh lẽo' },
      { hanzi: '我', pinyin: 'wǒ', meaning: 'Tôi, bản thân' },
      { hanzi: '打', pinyin: 'dǎ', meaning: 'Đánh, gọi điện' },
      { hanzi: '玩', pinyin: 'wán', meaning: 'Vui chơi' },
    ],
  },
  {
    id: 'zhe',
    name: 'Nét Gập',
    chineseName: '折',
    pinyin: 'zhé',
    symbol: '𠃍',
    direction: 'Đổi hướng gập đột ngột (ㄱ)',
    description: 'Nét kết hợp đổi góc vuông vức: đang đi ngang gập xuống (ngang gập) hoặc đang sổ gập sang (sổ gập).',
    tip: 'Tại góc gập phải dừng bút nhấc nhẹ rồi nhấn vuông góc đổi hướng dứt khoát.',
    examples: [
      { hanzi: '口', pinyin: 'kǒu', meaning: 'Miệng, khẩu' },
      { hanzi: '日', pinyin: 'rì', meaning: 'Ngày, mặt trời' },
      { hanzi: '四', pinyin: 'sì', meaning: 'Số bốn' },
      { hanzi: '买', pinyin: 'mǎi', meaning: 'Mua sắm' },
      { hanzi: '山', pinyin: 'shān', meaning: 'Ngọn núi' },
    ],
  },
  {
    id: 'gou',
    name: 'Nét Móc',
    chineseName: '钩',
    pinyin: 'gōu',
    symbol: '亅',
    direction: 'Sổ thẳng rồi móc ngược lên (亅)',
    description: 'Nét kết thúc bằng một cú móc nhọn dứt khoát quay ngược lên trên hoặc sang trái.',
    tip: 'Cuối đường sổ dừng bút ghim nhẹ một chút tạo điểm tựa rồi bung móc nhọn dứt khoát.',
    examples: [
      { hanzi: '小', pinyin: 'xiǎo', meaning: 'Nhỏ bé' },
      { hanzi: '你', pinyin: 'nǐ', meaning: 'Bạn, anh, chị' },
      { hanzi: '水', pinyin: 'shuǐ', meaning: 'Nước' },
      { hanzi: '也', pinyin: 'yě', meaning: 'Cũng vậy' },
      { hanzi: '了', pinyin: 'le', meaning: 'Rồi (trợ từ)' },
    ],
  },
];

export const STROKE_ORDER_RULES: StrokeOrderRule[] = [
  {
    id: 'rule-1',
    ruleNumber: 1,
    title: 'Ngang trước, sổ sau',
    chineseTitle: '先横后竖',
    pinyinTitle: 'xiān héng hòu shù',
    principle: 'Gặp nét ngang và nét sổ giao nhau ➔ Luôn viết nét ngang trước',
    explanation: 'Khi một nét ngang và một nét sổ cắt ngang nhau, nét ngang luôn được tạo trước để làm nền tảng nằm ngang, sau đó nét sổ mới cắm thẳng đứng qua.',
    tip: 'Giống như đặt một khúc gỗ ngang rồi đóng chiếc cọc đứng xuyên qua.',
    examples: [
      { hanzi: '十', pinyin: 'shí', meaning: 'Số mười', breakdown: 'Ngang (一) ➔ Sổ (丨)' },
      { hanzi: '土', pinyin: 'tǔ', meaning: 'Đất, thổ', breakdown: 'Ngang ngắn ➔ Sổ giữa ➔ Ngang dài đáy' },
      { hanzi: '木', pinyin: 'mù', meaning: 'Cây cối', breakdown: 'Ngang ➔ Sổ ➔ Phẩy trái ➔ Mác phải' },
      { hanzi: '丰', pinyin: 'fēng', meaning: 'Phong phú', breakdown: '3 Ngang liên tiếp ➔ Sổ dài xuyên qua' },
      { hanzi: '干', pinyin: 'gān', meaning: 'Làm việc, khô ráo', breakdown: '2 Ngang trên dưới ➔ Sổ giữa' },
    ],
  },
  {
    id: 'rule-2',
    ruleNumber: 2,
    title: 'Phẩy trước, mác sau',
    chineseTitle: '先撇后捺',
    pinyinTitle: 'xiān piě hòu nà',
    principle: 'Gặp hai nét xòe hình chóp nón ➔ Luôn viết phẩy trái trước, mác phải sau',
    explanation: 'Nét phẩy vút sang góc trái được viết trước để tạo đà nâng đỡ, sau đó nét mác sang góc phải viết sau để tạo thế cân bằng vững chãi như chân kiềng.',
    tip: 'Quy tắc vàng cho hầu hết các chữ hình người hoặc đỉnh chóp.',
    examples: [
      { hanzi: '人', pinyin: 'rén', meaning: 'Con người', breakdown: 'Phẩy trái (丿) ➔ Mác phải (㇏)' },
      { hanzi: '八', pinyin: 'bā', meaning: 'Số tám', breakdown: 'Phẩy trái ngắn ➔ Mác phải dài' },
      { hanzi: '大', pinyin: 'dà', meaning: 'Lớn, to', breakdown: 'Ngang ➔ Phẩy trái ➔ Mác phải' },
      { hanzi: '天', pinyin: 'tiān', meaning: 'Bầu trời', breakdown: '2 Ngang trên ➔ Phẩy trái ➔ Mác phải' },
      { hanzi: '父', pinyin: 'fù', meaning: 'Người cha', breakdown: 'Phẩy ➔ Chấm ➔ Phẩy dài ➔ Mác' },
    ],
  },
  {
    id: 'rule-3',
    ruleNumber: 3,
    title: 'Trên trước, dưới sau',
    chineseTitle: '从上到下',
    pinyinTitle: 'cóng shàng dào xià',
    principle: 'Chữ xếp tầng lớp ➔ Viết từ đỉnh cao nhất tuần tự hạ xuống đáy',
    explanation: 'Theo trọng lực tự nhiên của bàn tay, các nét hoặc bộ phận ở phía trên được viết trước để định vị chiều cao, các nét dưới hạ bút theo sau.',
    tip: 'Nhớ câu "Xây nhà từ mái xuống nền" trong chữ Hán.',
    examples: [
      { hanzi: '三', pinyin: 'sān', meaning: 'Số ba', breakdown: 'Ngang trên ➔ Ngang giữa ➔ Ngang đáy dài' },
      { hanzi: '二', pinyin: 'èr', meaning: 'Số hai', breakdown: 'Ngang trên ➔ Ngang dưới' },
      { hanzi: '早', pinyin: 'zǎo', meaning: 'Sớm, buổi sáng', breakdown: 'Chữ Nhật (日) trên ➔ Chữ Thập (十) dưới' },
      { hanzi: '旦', pinyin: 'dàn', meaning: 'Ban mai', breakdown: 'Chữ Nhật (日) trên ➔ Nét ngang (一) dưới' },
      { hanzi: '言', pinyin: 'yán', meaning: 'Ngôn từ', breakdown: 'Chấm trên ➔ 3 Ngang giữa ➔ Chữ Khẩu (口) đáy' },
    ],
  },
  {
    id: 'rule-4',
    ruleNumber: 4,
    title: 'Trái trước, phải sau',
    chineseTitle: '从左到右',
    pinyinTitle: 'cóng zuǒ dào yòu',
    principle: 'Chữ chia hai vế trái phải ➔ Hoàn thiện vế trái rồi mới viết vế phải',
    explanation: 'Áp dụng cho hơn 60% chữ Hán kết cấu tả - hữu. Viết bộ thủ bên trái trước để neo vị trí, sau đó viết phần biểu âm hoặc nghĩa bên phải.',
    tip: 'Viết tuần tự từ trái qua phải như khi bạn đọc một dòng sách.',
    examples: [
      { hanzi: '你', pinyin: 'nǐ', meaning: 'Bạn, anh', breakdown: 'Bộ Nhân đứng (亻) bên trái ➔ Chữ Nhĩ (尔) bên phải' },
      { hanzi: '他', pinyin: 'tā', meaning: 'Anh ấy', breakdown: 'Bộ Nhân đứng (亻) ➔ Chữ Dã (也)' },
      { hanzi: '好', pinyin: 'hǎo', meaning: 'Tốt đẹp', breakdown: 'Bộ Nữ (女) bên trái ➔ Chữ Tử (子) bên phải' },
      { hanzi: '明', pinyin: 'míng', meaning: 'Sáng sủa', breakdown: 'Chữ Nhật (日) bên trái ➔ Chữ Nguyệt (月) bên phải' },
      { hanzi: '朋', pinyin: 'péng', meaning: 'Bạn bè', breakdown: 'Chữ Nguyệt trái ➔ Chữ Nguyệt phải' },
    ],
  },
  {
    id: 'rule-5',
    ruleNumber: 5,
    title: 'Ngoài trước, trong sau',
    chineseTitle: '先外后内',
    pinyinTitle: 'xiān wài hòu nèi',
    principle: 'Chữ có khung bao hở ➔ Dựng khung ngoài trước, điền chi tiết trong sau',
    explanation: 'Đối với các chữ có khung bao bọc hở 3 phía (như chữ Nguyệt, chữ Đồng, chữ Phong), khung bên ngoài được tạo trước rồi nét ruột bên trong mới viết sau.',
    tip: 'Dựng khung nhà trước rồi mới kê đồ đạc vào bên trong.',
    examples: [
      { hanzi: '月', pinyin: 'yuè', meaning: 'Mặt trăng', breakdown: 'Khung ngoài (phẩy + ngang gập móc) ➔ 2 Ngang bên trong' },
      { hanzi: '同', pinyin: 'tóng', meaning: 'Giống nhau, cùng', breakdown: 'Khung chữ Quynh (冂) ➔ Một (一) và Khẩu (口) trong' },
      { hanzi: '风', pinyin: 'fēng', meaning: 'Cơn gió', breakdown: 'Khung Phong ngoài ➔ Phẩy và Chấm bên trong' },
      { hanzi: '问', pinyin: 'wèn', meaning: 'Hỏi han', breakdown: 'Bộ Môn (门) bên ngoài ➔ Chữ Khẩu (口) bên trong' },
      { hanzi: '司', pinyin: 'sī', meaning: 'Công ty, điều hành', breakdown: 'Khung gập ngoài ➔ Chữ Khẩu (口) bên trong' },
    ],
  },
  {
    id: 'rule-6',
    ruleNumber: 6,
    title: 'Vào trước, đóng sau',
    chineseTitle: '先进入后关门',
    pinyinTitle: 'xiān jìnrù hòu guānmén',
    principle: 'Khung kín 4 phía ➔ Dựng khung ➔ Vào ruột ➔ Khóa đáy sau cùng',
    explanation: 'Quy tắc kinh điển số một cho chữ bao bọc toàn phần: Dựng 3 cạnh khung (trái, trên, phải) ➔ Viết toàn bộ ruột bên trong ➔ Cuối cùng mới khóa nét ngang đáy lại.',
    tip: 'Khẩu quyết: "Vào nhà trước, đóng cửa sau" - Đóng cửa sớm thì khách không vào được!',
    examples: [
      { hanzi: '回', pinyin: 'huí', meaning: 'Trở về', breakdown: 'Khung ngoài ➔ Viết chữ Khẩu (口) trong ➔ Khóa đáy ngoài' },
      { hanzi: '国', pinyin: 'guó', meaning: 'Đất nước', breakdown: 'Khung Vi ngoài ➔ Chữ Ngọc (玉) bên trong ➔ Khóa đáy' },
      { hanzi: '田', pinyin: 'tián', meaning: 'Ruộng đồng', breakdown: 'Khung ngoài ➔ Nét Thập (+) bên trong ➔ Khóa đáy' },
      { hanzi: '日', pinyin: 'rì', meaning: 'Ngày, mặt trời', breakdown: 'Khung 3 cạnh ➔ Nét ngang giữa ➔ Khóa đáy' },
      { hanzi: '四', pinyin: 'sì', meaning: 'Số bốn', breakdown: 'Khung ngoài ➔ Phẩy và Sổ gập trong ➔ Khóa đáy' },
    ],
  },
  {
    id: 'rule-7',
    ruleNumber: 7,
    title: 'Giữa trước, hai bên sau',
    chineseTitle: '先中间后两边',
    pinyinTitle: 'xiān zhōngjiān hòu liǎngbiān',
    principle: 'Chữ đối xứng hai cánh ➔ Viết trục giữa trước, cánh trái rồi cánh phải',
    explanation: 'Khi chữ có một trục đứng trung tâm và hai bên xòe đối xứng, nét sổ đứng ở giữa luôn được viết trước để làm tâm đối xứng, sau đó mới viết cánh bên trái rồi cánh bên phải.',
    tip: 'Tương tự việc cắm cây cột cờ ở giữa trước rồi mới thả dây hai bên.',
    examples: [
      { hanzi: '小', pinyin: 'xiǎo', meaning: 'Nhỏ bé', breakdown: 'Sổ móc giữa (亅) ➔ Phẩy trái (丿) ➔ Chấm phải (丶)' },
      { hanzi: '水', pinyin: 'shuǐ', meaning: 'Dòng nước', breakdown: 'Sổ móc giữa ➔ Ngang gập phẩy trái ➔ Phẩy & Mác phải' },
      { hanzi: '永', pinyin: 'yǒng', meaning: 'Vĩnh cửu', breakdown: 'Chấm trên ➔ Ngang gập móc giữa ➔ Cánh trái & phải' },
      { hanzi: '办', pinyin: 'bàn', meaning: 'Xử lý, làm', breakdown: 'Chữ Lực (力) ở giữa ➔ Chấm trái ➔ Chấm phải' },
      { hanzi: '业', pinyin: 'yè', meaning: 'Sự nghiệp', breakdown: '2 Nét đứng ở giữa trước ➔ Nét hai bên sau ➔ Ngang đáy' },
    ],
  },
];
