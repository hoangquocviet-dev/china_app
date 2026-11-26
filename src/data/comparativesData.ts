export interface ComparativeExample {
  chinese: string;
  pinyin: string;
  meaning: string;
  highlightWord: string;
}

export interface ComparativeItem {
  id: string;
  pattern: string; // e.g. "A 比 B + Tính từ (So sánh hơn)"
  category: 'bi_more' | 'meiyou_less' | 'yiyang_equal' | 'zui_superlative' | 'yuelaiyue_progressive';
  categoryName: string;
  formula: string; // e.g. "A + 比 + B + Tính từ"
  meaningEffect: string;
  goldenRule: string;
  examples: ComparativeExample[];
  commonMistake?: {
    wrong: string;
    right: string;
    explanation: string;
  };
}

export interface ComparativeQuizItem {
  id: string;
  question: string;
  sentence: string;
  pinyin: string;
  meaning: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  ruleTested: string;
}

export const COMPARATIVE_CATEGORIES = [
  { id: 'all', name: 'Tất cả câu so sánh', icon: 'Sparkles' },
  { id: 'bi_more', name: 'So sánh hơn (比)', icon: 'ArrowUpRight' },
  { id: 'meiyou_less', name: 'So sánh kém / Không bằng (没有)', icon: 'ArrowDownRight' },
  { id: 'yiyang_equal', name: 'So sánh bằng (跟/和...一样)', icon: 'Equal' },
  { id: 'zui_superlative', name: 'So sánh nhất (最)', icon: 'Crown' },
  { id: 'yuelaiyue_progressive', name: 'So sánh tăng tiến (越来越)', icon: 'TrendingUp' },
] as const;

export const COMPARATIVE_GOLDEN_RULES = [
  {
    title: 'Đại Kỵ 1: CẤM dùng phó từ chỉ mức độ (很, 非常, 太) trong câu chữ "比"',
    rule: 'Bản thân chữ "比" đã mang ý nghĩa so sánh hơn kém về mức độ. Vì vậy, trước tính từ vị ngữ TUYỆT ĐỐI KHÔNG ĐƯỢC thêm "很", "非常", "真", "太".',
    wrong: '他比我很高。 / 哥哥比我很忙。 (Sai nghiêm trọng)',
    right: '他比我高。 / 哥哥比我忙。 (Đúng)',
    explanation: 'Nếu muốn nhấn mạnh mức độ chênh lệch nhiều, phải đặt "得多" hoặc "多了" Ở PHÍA SAU tính từ: 他比我高得多.',
  },
  {
    title: 'Đại Kỵ 2: Phủ định so sánh hơn DÙNG "A 没有 B + Adj", CẤM NÓI "A 比 B 不 + Adj"',
    rule: 'Để diễn tả "A không bằng B" (A kém hơn B), cấu trúc chuẩn là "A 没有 B (+ 那么/这么) + Tính từ". Tuyệt đối không chèn chữ "不" vào sau "比".',
    wrong: '这件衣服比那件不贵。 (Sai cấm kỵ)',
    right: '这件衣服没有那件贵。 (Đúng chuẩn bản xứ)',
    explanation: '"A 不比 B + Adj" mang nghĩa tranh biện "A không hề thua kém B / A chẳng kém B là bao", còn diễn đạt so sánh kém thuần túy bắt buộc dùng "没有".',
  },
  {
    title: 'Đại Kỵ 3: Từ chỉ mức độ chênh lệch (Số lượng, 得多, 一点儿) BẮT BUỘC ĐỨNG SAU TÍNH TỪ',
    rule: 'Mọi thành phần biểu thị mức độ chênh lệch cụ thể (đại 2 tuổi, đắt hơn 10 tệ, tốt hơn nhiều, rẻ hơn một chút) PHẢI ĐẶT Ở CUỐI CÂU, ngay sau tính từ.',
    wrong: '他比我两岁大。 / 这个比那个一点儿便宜。 (Sai vị trí)',
    right: '他比我大两岁。 / 这个比那个便宜一点儿。 (Đúng)',
    explanation: 'Công thức thép: A + 比 + B + Tính từ + [Số lượng / 得多 / 多了 / 一点儿]!',
  },
  {
    title: 'Đại Kỵ 4: CẤM dùng "很 / 非常" sau cấu trúc "越来越……"',
    rule: '"越来越" biểu thị mức độ phát triển tăng dần theo thời gian, vì vậy phía sau nó trực tiếp đi với Tính từ/Động từ tâm lý, KHÔNG ĐƯỢC chèn thêm "很" hay "非常".',
    wrong: '天气越来越很冷。 / 汉语越来越非常难。 (Sai)',
    right: '天气越来越冷。 / 汉语越来越难。 (Đúng)',
    explanation: '"越来越" đã bao hàm ý nghĩa mức độ tăng cao rồi.',
  },
];

export const COMPARATIVES_LIST: ComparativeItem[] = [
  // 1. Bi sentences (More)
  {
    id: 'cm-1',
    pattern: 'A + 比 + B + Tính từ (So sánh hơn cơ bản)',
    category: 'bi_more',
    categoryName: 'So sánh hơn cơ bản',
    formula: 'A + 比 + B + Tính từ',
    meaningEffect: 'Biểu thị sự vật A có đặc điểm, tính chất vượt trội hơn sự vật B.',
    goldenRule: 'Không thêm 很, 非常, 太 trước tính từ. Câu phủ định tương phản là "A 没有 B...".',
    examples: [
      {
        chinese: '哥哥比我高，但是弟弟比我瘦。',
        pinyin: 'Gēge bǐ wǒ gāo, dànshì dìdi bǐ wǒ shòu.',
        meaning: 'Anh trai cao hơn tôi, nhưng em trai lại gầy hơn tôi.',
        highlightWord: '比我高',
      },
      {
        chinese: '今天的天气比昨天好多了。',
        pinyin: 'Jīntiān de tiānqì bǐ zuótiān hǎo duō le.',
        meaning: 'Thời tiết hôm nay tốt hơn hôm qua nhiều.',
        highlightWord: '比昨天好多了',
      },
    ],
    commonMistake: {
      wrong: '今天比昨天很热。',
      right: '今天比昨天热。',
      explanation: 'Không dùng "很" trong câu chữ 比.',
    },
  },
  {
    id: 'cm-2',
    pattern: 'A + 比 + B + Tính từ + (得多 / 多了 / 一点儿)',
    category: 'bi_more',
    categoryName: 'So sánh hơn kèm mức độ',
    formula: 'A + 比 + B + Tính từ + 得多 / 多了 (nhiều) HOẶC 一点儿 / 一些 (một chút)',
    meaningEffect: 'Chỉ rõ khoảng cách chênh lệch giữa hai đối tượng là rất lớn (得多/多了) hay chỉ một chút ít (一点儿).',
    goldenRule: 'Các từ chỉ mức độ bắt buộc đứng NGAY SAU tính từ!',
    examples: [
      {
        chinese: '中国比越南大得多。',
        pinyin: 'Zhōngguó bǐ Yuènán dà de duō.',
        meaning: 'Trung Quốc lớn hơn Việt Nam rất nhiều.',
        highlightWord: '大得多',
      },
      {
        chinese: '这件西装比那件便宜一点儿。',
        pinyin: 'Zhè jiàn xīzhuāng bǐ nà jiàn piányi yìdiǎnr.',
        meaning: 'Bộ âu phục này rẻ hơn bộ kia một chút.',
        highlightWord: '便宜一点儿',
      },
    ],
  },
  {
    id: 'cm-3',
    pattern: 'A + 比 + B + Tính từ + Số lượng từ cụ thể',
    category: 'bi_more',
    categoryName: 'So sánh hơn kèm con số cụ thể',
    formula: 'A + 比 + B + Tính từ + [Số lượng cụ thể]',
    meaningEffect: 'Chỉ rõ độ chênh lệch chính xác bằng con số (tuổi tác, giá tiền, cân nặng, chiều cao).',
    goldenRule: 'Số lượng từ luôn đứng ở cuối câu, sau tính từ.',
    examples: [
      {
        chinese: '王老师比我大五岁。',
        pinyin: 'Wáng lǎoshī bǐ wǒ dà wǔ suì.',
        meaning: 'Thầy Vương lớn hơn tôi 5 tuổi.',
        highlightWord: '大五岁',
      },
      {
        chinese: '这双皮鞋比那双贵一百块钱。',
        pinyin: 'Zhè shuāng píxié bǐ nà shuāng guì yìbǎi kuài qián.',
        meaning: 'Đôi giày da này đắt hơn đôi kia 100 tệ.',
        highlightWord: '贵一百块钱',
      },
    ],
  },

  // 2. Meiyou sentences (Less / Not as... as)
  {
    id: 'cm-4',
    pattern: 'A + 没有 + B + (那么/这么) + Tính từ (So sánh kém / Không bằng)',
    category: 'meiyou_less',
    categoryName: 'So sánh không bằng',
    formula: 'A + 没有 + B + (那么/这么) + Tính từ',
    meaningEffect: 'Biểu thị A không đạt đến mức độ như B (kém hơn B). "那么/这么" mang ý nhấn mạnh mức độ cao của B.',
    goldenRule: 'Đây là dạng phủ định tự nhiên và phổ biến nhất của câu so sánh hơn.',
    examples: [
      {
        chinese: '北京的冬天没有哈尔滨那么冷。',
        pinyin: "Běijīng de dōngtiān méiyǒu Hā'ěrbīn nàme lěng.",
        meaning: 'Mùa đông ở Bắc Kinh không lạnh bằng Cáp Nhĩ Tân.',
        highlightWord: '没有哈尔滨那么冷',
      },
      {
        chinese: '这道菜没有妈妈做的那道好吃。',
        pinyin: 'Zhè dào cài méiyǒu māma zuò de nà dào hǎochī.',
        meaning: 'Món ăn này không ngon bằng món mẹ tôi nấu.',
        highlightWord: '没有妈妈做的那道好吃',
      },
    ],
    commonMistake: {
      wrong: '我比他没有聪明。',
      right: '我没有他聪明。',
      explanation: 'Không ghép "比没有", dùng trực tiếp "A 没有 B + Tính từ".',
    },
  },

  // 3. Yiyang sentences (Equal)
  {
    id: 'cm-5',
    pattern: 'A + 跟/和 + B + 一样 (+ Tính từ) (So sánh bằng)',
    category: 'yiyang_equal',
    categoryName: 'So sánh bằng',
    formula: 'Khẳng định: A + 跟/和 + B + 一样 (+ Tính từ) | Phủ định: A + 跟/和 + B + 不一样',
    meaningEffect: 'Biểu thị hai sự vật tương đương nhau, giống hệt nhau về một đặc điểm hoặc tính chất nào đó.',
    goldenRule: 'Có thể lược bớt tính từ khi nói về sự tương đồng chung (我们的想法一样 - Suy nghĩ của chúng tôi giống nhau).',
    examples: [
      {
        chinese: '他的汉语说得跟我一样好。',
        pinyin: 'Tā de hànyǔ shuō de gēn wǒ yíyàng hǎo.',
        meaning: 'Tiếng Trung của anh ấy nói hay giống hệt như tôi.',
        highlightWord: '跟我一样好',
      },
      {
        chinese: '这家店的衣服跟那家店的不一样。',
        pinyin: 'Zhè jiā diàn de yīfu gēn nà jiā diàn de bù yíyàng.',
        meaning: 'Quần áo quán này khác biệt (không giống) với quán kia.',
        highlightWord: '跟那家店的不一样',
      },
    ],
  },

  // 4. Zui sentences (Superlative)
  {
    id: 'cm-6',
    pattern: 'S + 最 + Tính từ / Động từ tâm lý (So sánh nhất)',
    category: 'zui_superlative',
    categoryName: 'So sánh bậc nhất',
    formula: 'Chủ ngữ + (在 Phạm vi) + 最 + Tính từ / Động từ tâm lý (喜欢/爱/想)',
    meaningEffect: 'Biểu thị mức độ cao nhất trong một phạm vi hoặc tập hợp so sánh.',
    goldenRule: 'Có thể đi kèm cụm giới từ chỉ phạm vi: 在班里 (trong lớp), 在我们家 (trong nhà tôi).',
    examples: [
      {
        chinese: '在我们班，大卫的汉语学得最好。',
        pinyin: 'Zài wǒmen bān, Dàwèi de hànyǔ xué de zuì hǎo.',
        meaning: 'Trong lớp chúng tôi, David học tiếng Trung giỏi nhất.',
        highlightWord: '学得最好',
      },
      {
        chinese: '在中国水果中，我最喜欢吃芒果。',
        pinyin: 'Zài zhōngguó shuǐguǒ zhōng, wǒ zuì xǐhuan chī mángguǒ.',
        meaning: 'Trong các loại hoa quả ở Trung Quốc, tôi thích ăn xoài nhất.',
        highlightWord: '最喜欢',
      },
    ],
  },

  // 5. Yuelaiyue sentences (Progressive)
  {
    id: 'cm-7',
    pattern: 'S + 越来越 + Tính từ (So sánh tăng tiến theo thời gian)',
    category: 'yuelaiyue_progressive',
    categoryName: 'So sánh tăng tiến',
    formula: 'Chủ ngữ + 越来越 + Tính từ / Động từ tâm lý',
    meaningEffect: 'Biểu thị trạng thái, tính chất hoặc cảm xúc ngày càng tăng tiến theo dòng thời gian (càng ngày càng...).',
    goldenRule: 'Sau "越来越" tuyệt đối KHÔNG thêm "很", "非常", "太"!',
    examples: [
      {
        chinese: '春天到了，天气越来越暖和了。',
        pinyin: 'Chūntiān dào le, tiānqì yuèláiyuè nuǎnhuo le.',
        meaning: 'Mùa xuân đến rồi, thời tiết ngày càng ấm áp.',
        highlightWord: '越来越暖和',
      },
      {
        chinese: '经过每天练习，他的听力水平越来越好了。',
        pinyin: 'Jīngguò měitiān liànxí, tā de tīnglì shuǐpíng yuèláiyuè hǎo le.',
        meaning: 'Qua việc luyện tập mỗi ngày, trình độ nghe của anh ấy ngày càng tiến bộ.',
        highlightWord: '越来越好',
      },
    ],
    commonMistake: {
      wrong: '天气越来越很冷。',
      right: '天气越来越冷。',
      explanation: 'Không dùng phó từ chỉ mức độ "很" sau "越来越".',
    },
  },
];

export const COMPARATIVE_QUIZ_LIST: ComparativeQuizItem[] = [
  {
    id: 'cpq-1',
    question: 'Chọn câu so sánh chữ "比" viết ĐÚNG ngữ pháp nhất:',
    sentence: 'Chọn câu đúng:',
    pinyin: 'Xuǎn chū zhèngquè de jùzi:',
    meaning: 'Hôm nay trời lạnh hơn hôm qua.',
    options: [
      '今天比昨天很冷。',
      '今天比昨天冷。',
      '今天很比昨天冷。',
      '今天比昨天非常冷。',
    ],
    correctIndex: 1,
    explanation: 'Đại kỵ câu chữ 比: Tuyệt đối không dùng phó từ chỉ mức độ (很, 非常, 太) trước tính từ -> "今天比昨天冷".',
    ruleTested: 'Không dùng 很 trong câu chữ 比',
  },
  {
    id: 'cpq-2',
    question: 'Chọn vị trí ĐÚNG của cụm từ chỉ mức độ nhiều "得多" (hơn nhiều):',
    sentence: 'Điền vào chỗ trống: "Táo của siêu thị này ngọt hơn siêu thị kia nhiều."',
    pinyin: 'Zhè jiā chāoshì de píngguǒ bǐ nà jiā ___.',
    meaning: 'Táo siêu thị này ngọt hơn siêu thị kia nhiều.',
    options: [
      '得多甜',
      '很甜得多',
      '甜得多',
      '得多很甜',
    ],
    correctIndex: 2,
    explanation: 'Từ chỉ mức độ (得多 / 多了) bắt buộc phải đứng SAU tính từ -> "甜得多".',
    ruleTested: 'Vị trí của 得多 đứng sau tính từ',
  },
  {
    id: 'cpq-3',
    question: 'Chọn câu phủ định ĐÚNG của câu "哥哥比我高":',
    sentence: 'Chuyển sang ý "Tôi không cao bằng anh trai":',
    pinyin: 'Wǒ bù rú gēge gāo:',
    meaning: 'Tôi không cao bằng anh trai.',
    options: [
      '我比哥哥不高。',
      '我没有哥哥高。',
      '我比哥哥没有高。',
      '哥哥不比我高。',
    ],
    correctIndex: 1,
    explanation: 'Phủ định của so sánh hơn là "A 没有 B + Tính từ" -> "我没有哥哥高" (Tôi không cao bằng anh trai). Cấm nói "比不高".',
    ruleTested: 'Phủ định so sánh dùng 没有',
  },
  {
    id: 'cpq-4',
    question: 'Chọn vị trí ĐÚNG của số lượng từ chênh lệch "大五岁" (hơn 5 tuổi):',
    sentence: 'Chọn câu diễn đạt: "Thầy Vương lớn hơn tôi 5 tuổi":',
    pinyin: 'Wáng lǎoshī bǐ wǒ ___:',
    meaning: 'Thầy Vương hơn tôi 5 tuổi.',
    options: [
      '王老师比我五岁大。',
      '王老师比我大五岁。',
      '王老师五岁比我大。',
      '王老师大比我五岁。',
    ],
    correctIndex: 1,
    explanation: 'Số lượng từ biểu thị khoảng cách chênh lệch bắt buộc đứng SAU tính từ -> "大五岁".',
    ruleTested: 'Số lượng từ đứng sau tính từ',
  },
  {
    id: 'cpq-5',
    question: 'Chọn câu so sánh bằng ĐÚNG của cấu trúc "跟/和……一样":',
    sentence: 'Chọn câu viết đúng:',
    pinyin: 'Xuǎn chū zhèngquè de jùzi:',
    meaning: 'Căn phòng của anh ấy rộng bằng căn phòng của tôi.',
    options: [
      '他的房间跟我的房间一样大。',
      '他的房间一样跟我的房间大。',
      '他的房间跟我的房间很一样大。',
      '他的房间很大跟我的房间一样。',
    ],
    correctIndex: 0,
    explanation: 'Cấu trúc so sánh bằng chuẩn: A + 跟/和 + B + 一样 + Tính từ -> "他的房间跟我的房间一样大".',
    ruleTested: 'Cấu trúc A 跟 B 一样 + Adj',
  },
  {
    id: 'cpq-6',
    question: 'Câu nào sau đây BỊ SAI NGỮ PHÁP do dùng sai từ chỉ mức độ?',
    sentence: 'Tìm câu sai:',
    pinyin: 'Qǐng xuǎn chū cuòwù de jùzi:',
    meaning: 'Tìm câu vi phạm đại kỵ so sánh.',
    options: [
      '这件衣服比那件便宜一点儿。',
      '天气越来越很热了。',
      '妹妹比我小两岁。',
      '他的想法跟我的一样。',
    ],
    correctIndex: 1,
    explanation: 'Đại kỵ: Sau "越来越" KHÔNG ĐƯỢC DÙNG "很/非常". Câu "天气越来越很热了" sai, phải sửa thành "天气越来越热了".',
    ruleTested: 'Không dùng 很 sau 越来越',
  },
  {
    id: 'cpq-7',
    question: 'Điền từ thích hợp: "Trong số các môn học, tôi thích nhất môn tiếng Trung."',
    sentence: '在所有课程中，我___喜欢汉语课。',
    pinyin: 'Zài suǒyǒu kèchéng zhōng, wǒ ___ xǐhuan hànyǔ kè.',
    meaning: 'Tôi thích môn tiếng Trung nhất.',
    options: ['更', '最', '比', '极'],
    correctIndex: 1,
    explanation: 'So sánh bậc nhất dùng phó từ "最" đứng trước động từ tâm lý/tính từ -> "最喜欢".',
    ruleTested: 'So sánh nhất 最',
  },
  {
    id: 'cpq-8',
    question: 'Chọn câu ĐÚNG NHẤT miêu tả mức độ chênh lệch nhỏ (một chút):',
    sentence: 'Chọn câu đúng:',
    pinyin: 'Xuǎn chū zhèngquè de jùzi:',
    meaning: 'Đôi giày này đắt hơn đôi kia một chút.',
    options: [
      '这双鞋比那双一点儿贵。',
      '这双鞋比那双贵一点儿。',
      '这双鞋贵比那双一点儿。',
      '这双鞋一点儿比那双贵。',
    ],
    correctIndex: 1,
    explanation: '"一点儿" chỉ mức độ chênh lệch nhẹ bắt buộc đứng ngay sau tính từ -> "贵一点儿".',
    ruleTested: 'Vị trí 一点儿 đứng sau tính từ',
  },
  {
    id: 'cpq-9',
    question: 'Điền từ: "Xe buýt không chạy nhanh bằng tàu điện ngầm."',
    sentence: '公共汽车___地铁那么快。',
    pinyin: 'Gōnggòng qìchē ___ dìtiě nàme kuài.',
    meaning: 'Xe buýt không nhanh bằng tàu điện ngầm.',
    options: ['比', '没有', '一样', '跟'],
    correctIndex: 1,
    explanation: 'So sánh kém / không bằng dùng "A 没有 B + 那么 + Adj" -> "没有".',
    ruleTested: 'So sánh không bằng 没有',
  },
  {
    id: 'cpq-10',
    question: 'Nhận xét nào sau đây là HOÀN TOÀN CHÍNH XÁC về câu chữ "比"?',
    sentence: 'Chọn nhận định đúng về câu so sánh:',
    pinyin: 'Qǐng xuǎn chū zhèngquè de shuōfǎ:',
    meaning: 'Nhận xét đúng về câu so sánh.',
    options: [
      'Có thể nói "他比我很聪明" nếu muốn khen anh ấy rất thông minh.',
      'Muốn nói mức độ chênh lệch lớn, phải dùng "得多" hoặc "多了" đứng sau tính từ.',
      'Phủ định câu chữ 比 luôn luôn chèn "不" vào sau 比 (A 比 B 不 Adj).',
      'Số tuổi chênh lệch phải đứng trước tính từ (A 比 B 两岁大).',
    ],
    correctIndex: 1,
    explanation: 'Nhận định B chính xác 100%! Muốn nhấn mạnh mức độ chênh lệch lớn trong câu chữ 比, ta dùng "得多" hoặc "多了" đặt sau tính từ (ví dụ: 他比我聪明得多).',
    ruleTested: 'Quy tắc vàng câu so sánh chữ 比',
  },
];
