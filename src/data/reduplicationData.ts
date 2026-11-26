export interface ReduplicationExample {
  chinese: string;
  pinyin: string;
  meaning: string;
  highlightWord: string;
}

export interface ReduplicationItem {
  id: string;
  pattern: string; // e.g. "AA / A一A (Động từ đơn)"
  category: 'verb_single' | 'verb_double' | 'verb_separable' | 'adj_single' | 'adj_double' | 'noun_measure';
  categoryName: string;
  formula: string; // e.g. "Động từ + (一) + Động từ"
  meaningEffect: string; // Tác dụng ngữ nghĩa: làm nhẹ ngữ khí, thử làm, thời gian ngắn...
  coreWords: string[]; // e.g. ["看 -> 看看 / 看一看", "听 -> 听听 / 听一听", "问 -> 问问 / 问一问"]
  goldenNote: string; // Lưu ý quan trọng
  examples: ReduplicationExample[];
  commonMistake?: {
    wrong: string;
    right: string;
    explanation: string;
  };
}

export interface ReduplicationQuizItem {
  id: string;
  question: string;
  sentence: string; // with blank or testing correct usage
  pinyin: string;
  meaning: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  ruleTested: string;
}

export const REDUPLICATION_CATEGORIES = [
  { id: 'all', name: 'Tất cả trùng điệp', icon: 'Sparkles' },
  { id: 'verb_single', name: 'Động từ đơn (AA / A一A)', icon: 'Play' },
  { id: 'verb_double', name: 'Động từ kép (ABAB)', icon: 'Layers' },
  { id: 'verb_separable', name: 'Động từ ly hợp (AAB)', icon: 'Zap' },
  { id: 'adj_single', name: 'Tính từ đơn (AA的)', icon: 'Smile' },
  { id: 'adj_double', name: 'Tính từ kép (AABB)', icon: 'Heart' },
  { id: 'noun_measure', name: 'Danh từ/Lượng từ (AA)', icon: 'Calendar' },
] as const;

export const REDUPLICATION_GOLDEN_RULES = [
  {
    title: 'Đại Kỵ 1: Động từ trùng điệp KHÔNG đi với "一下" / "一点儿"',
    rule: 'Bản thân trùng điệp động từ đã mang ý nghĩa "thử làm / làm một chút trong thời gian ngắn", do đó tuyệt đối KHÔNG cộng thêm "一下" hay "一点儿".',
    wrong: '我看看一下。 (Sai vì lặp nghĩa)',
    right: '我看看。 HOẶC 我看一下。 (Đúng)',
    explanation: '"看看" và "看一下" có giá trị tương đương nhau, chỉ được chọn 1 trong 2.',
  },
  {
    title: 'Đại Kỵ 2: Tính từ trùng điệp KHÔNG đi với phó từ chỉ mức độ (很, 非常, 太)',
    rule: 'Tính từ khi trùng điệp (như 红红的, 干干净净) đã tự thân mang sắc thái mức độ rất cao hoặc rất sâu sắc, vì vậy KHÔNG được đặt các phó từ chỉ mức độ phía trước.',
    wrong: '屋子里很干干净净。 (Sai)',
    right: '屋子里干干净净的。 HOẶC 屋子里很干净。 (Đúng)',
    explanation: 'Dùng "很干净" hoặc "干干净净", không bao giờ ghép "很干干净净".',
  },
  {
    title: 'Phân Biệt: Động từ lặp kiểu ABAB vs Tính từ lặp kiểu AABB',
    rule: 'Đây là cái bẫy lớn nhất trong đề thi HSK khi gặp từ 2 âm tiết:',
    wrong: 'Động từ: 学习 -> 学学习习 (SAI HOÀN TOÀN!) | Tính từ: 干净 -> 干净干净 (SAI!)',
    right: 'Động từ kép: AB -> ABAB (学习 -> 学习学习) | Tính từ kép: AB -> AABB (干净 -> 干干净净)',
    explanation: 'Động từ lặp nguyên cụm ABAB để biểu thị hành động nhẹ nhàng; Tính từ tách đôi AABB để tăng cường độ biểu cảm.',
  },
  {
    title: 'Bẫy Điểm 10: Động từ Ly Hợp lặp kiểu AAB (散散步, 游游泳)',
    rule: 'Các động từ ly hợp có kết cấu Động từ (A) + Tân ngữ (B). Khi trùng điệp chỉ được lặp lại thành phần động từ A:',
    wrong: '散步散步 ✗ | 游泳游泳 ✗ | 跳舞跳舞 ✗ | 见面见面 ✗',
    right: '散散步 ✓ | 游游泳 ✓ | 跳跳舞 ✓ | 见见面 ✓ | 聊聊天 ✓ | 睡睡觉 ✓',
    explanation: 'Vì B là tân ngữ nên không thể trùng điệp, chỉ có chữ đầu A là động tác mới được lặp lại.',
  },
];

export const REDUPLICATION_LIST: ReduplicationItem[] = [
  // 1. Single Verb (AA / A一A / A了A)
  {
    id: 'rd-1',
    pattern: 'AA / A一A / A了A',
    category: 'verb_single',
    categoryName: 'Động từ đơn âm tiết',
    formula: 'Động từ + (一 / 了) + Động từ',
    meaningEffect: 'Diễn tả hành động diễn ra trong thời gian ngắn, thử làm điều gì đó, hoặc làm nhẹ ngữ khí câu cầu khiến, giúp câu nói trở nên mềm mại, lịch sự.',
    coreWords: [
      '看 (kàn) -> 看看 / 看一看 (xem thử một chút)',
      '听 (tīng) -> 听听 / 听一听 (nghe thử một lát)',
      '问 (wèn) -> 问问 / 问一问 (hỏi thăm một chút)',
      '试 (shì) -> 试试 / 试一试 (thử xem sao)',
      '想 (xiǎng) -> 想想 / 想一想 (suy nghĩ một chút)',
      '尝 (cháng) -> 尝尝 / 尝一尝 (nếm thử mùi vị)',
    ],
    goldenNote: 'Chữ thứ hai đọc thanh nhẹ (khinh thanh): 看看 kànkan, 试试 shìshi. Nếu hành động đã xảy ra dùng A了A: 看了看, 试了试.',
    examples: [
      {
        chinese: '这件衣服很漂亮，你穿上试试吧。',
        pinyin: 'Zhè jiàn yīfu hěn piàoliang, nǐ chuān shàng shìshi ba.',
        meaning: 'Bộ quần áo này rất đẹp, bạn mặc thử một chút xem sao.',
        highlightWord: '试试',
      },
      {
        chinese: '这个问题，让我再好好想想。',
        pinyin: 'Zhège wèntí, ràng wǒ zài hǎohāo xiǎngxiang.',
        meaning: 'Vấn đề này để tôi suy nghĩ kỹ lại một chút nhé.',
        highlightWord: '想想',
      },
      {
        chinese: '他看了看手表，然后快步走出了门。',
        pinyin: 'Tā kàn le kàn shǒubiǎo, ránhòu kuài bù zǒu chū le mén.',
        meaning: 'Anh ấy liếc nhìn đồng hồ một cái, rồi rảo bước nhanh ra khỏi cửa.',
        highlightWord: '看了看',
      },
    ],
    commonMistake: {
      wrong: '请你等我等等。',
      right: '请你等等我。',
      explanation: 'Tân ngữ (我) phải đứng sau toàn bộ cụm động từ trùng điệp (等等), không được chèn vào giữa.',
    },
  },

  // 2. Double Verb (ABAB)
  {
    id: 'rd-2',
    pattern: 'ABAB (Động từ kép)',
    category: 'verb_double',
    categoryName: 'Động từ song âm tiết',
    formula: 'AB + AB (Lặp nguyên vẹn hai chữ)',
    meaningEffect: 'Làm nhẹ ngữ khí, biểu thị hành động diễn ra thư thả, có tính chất nghỉ ngơi, giao lưu hoặc học hỏi kinh nghiệm.',
    coreWords: [
      '休息 (xiūxi) -> 休息休息 (nghỉ ngơi một chút)',
      '学习 (xuéxí) -> 学习学习 (học hỏi, trao đổi kinh nghiệm)',
      '讨论 (tǎolùn) -> 讨论讨论 (thảo luận qua một lát)',
      '准备 (zhǔnbèi) -> 准备准备 (chuẩn bị một chút)',
      '介绍 (jièshào) -> 介绍介绍 (giới thiệu sơ qua)',
      '运动 (yùndòng) -> 运动运动 (vận động rèn luyện thân thể)',
    ],
    goldenNote: 'Tuyệt đối KHÔNG xen chữ "一" vào giữa (không nói 休息一休息). Chỉ lặp lại nguyên khối: ABAB.',
    examples: [
      {
        chinese: '工作太累了，我们坐下来休息休息吧。',
        pinyin: 'Gōngzuò tài lèi le, wǒmen zuò xiàlai xiūxi xiūxi ba.',
        meaning: 'Làm việc mệt quá rồi, chúng ta ngồi xuống nghỉ ngơi một chút đi.',
        highlightWord: '休息休息',
      },
      {
        chinese: '你能给我们介绍介绍这家公司的情况吗？',
        pinyin: 'Nǐ néng gěi wǒmen jièshào jièshào zhè jiā gōngsī de qíngkuàng ma?',
        meaning: 'Bạn có thể giới thiệu sơ qua cho chúng tôi về tình hình công ty này không?',
        highlightWord: '介绍介绍',
      },
    ],
    commonMistake: {
      wrong: '我们来讨论讨论一下这个问题。',
      right: '我们来讨论讨论这个问题。',
      explanation: '"讨论讨论" đã mang nghĩa làm một chút rồi, không thêm "一下".',
    },
  },

  // 3. Separable Verb (AAB)
  {
    id: 'rd-3',
    pattern: 'AAB (Động từ ly hợp)',
    category: 'verb_separable',
    categoryName: 'Động từ ly hợp (Bẫy kinh điển)',
    formula: 'A (Động từ lặp 2 lần) + B (Tân ngữ giữ nguyên)',
    meaningEffect: 'Dùng cho các cụm Động từ - Tân ngữ gắn liền. Nhấn mạnh hoạt động diễn ra nhẹ nhàng, thư giãn giải trí.',
    coreWords: [
      '散步 (sàn bù) -> 散散步 (đi dạo một chút)',
      '游泳 (yóu yǒng) -> 游游泳 (bơi lội một lát)',
      '跳舞 (tiào wǔ) -> 跳跳舞 (khiêu vũ, nhảy múa)',
      '聊天 (liáo tiān) -> 聊聊天 (trò chuyện, tán gẫu)',
      '见面 (jiàn miàn) -> 见见面 (gặp gỡ nhau)',
      '唱歌 (chàng gē) -> 唱唱歌 (hát hò vui vẻ)',
      '洗澡 (xǐ zǎo) -> 洗洗澡 (tắm rửa một chút)',
      '睡觉 (shuì jiào) -> 睡睡觉 (ngủ một giấc)',
    ],
    goldenNote: 'Ghi nhớ công thức AAB: Chữ đầu là động từ thì nhân đôi, chữ sau là danh từ thì giữ nguyên!',
    examples: [
      {
        chinese: '吃完晚饭后，我们去公园散散步吧。',
        pinyin: 'Chī wán wǎnfàn hòu, wǒmen qù gōngyuán sànsan bù ba.',
        meaning: 'Sau khi ăn tối xong, chúng ta ra công viên đi dạo một chút nhé.',
        highlightWord: '散散步',
      },
      {
        chinese: '周末有空的话，大家一起出来聊聊天。',
        pinyin: 'Zhōumò yǒu kòng dehuà, dàjiā yìqǐ chūlái liáoliao tiān.',
        meaning: 'Cuối tuần nếu rảnh thì mọi người cùng ra ngoài trò chuyện tán gẫu nhé.',
        highlightWord: '聊聊天',
      },
      {
        chinese: '夏天天气太热，大家都喜欢去海边游游泳。',
        pinyin: 'Xiàtiān tiānqì tài rè, dàjiā dōu xǐhuan qù hǎibiān yóuyou yǒng.',
        meaning: 'Mùa hè trời nóng quá, ai nấy đều thích ra biển bơi lội một lát.',
        highlightWord: '游游泳',
      },
    ],
    commonMistake: {
      wrong: '今天下午我们去游泳游泳吧。',
      right: '今天下午我们去游游泳吧。',
      explanation: 'Động từ ly hợp không bao giờ lặp ABAB (không nói 游泳游泳), mà phải là AAB (游游泳).',
    },
  },

  // 4. Single Adjective (AA / AA的)
  {
    id: 'rd-4',
    pattern: 'AA / AA的 (Tính từ đơn)',
    category: 'adj_single',
    categoryName: 'Tính từ đơn âm tiết',
    formula: 'Tính từ + Tính từ + (的 / 地)',
    meaningEffect: 'Miêu tả hình tượng sống động, cụ thể, mang sắc thái đáng yêu, trìu mến hoặc nhấn mạnh đặc điểm nổi bật.',
    coreWords: [
      '红 (hóng) -> 红红的 (đỏ hồng hào, đỏ au)',
      '高 (gāo) -> 高高的 (cao vút, cao ráo)',
      '大 (dà) -> 大大的 (to tròn, to đùng)',
      '长 (cháng) -> 长长的 (dài thướt tha)',
      '慢 (màn) -> 慢慢地 (chầm chậm, từ tốn)',
      '快 (kuài) -> 快快地 (nhanh nhanh chóng chóng)',
      '小 (xiǎo) -> 小小的 (nhỏ nhắn, xinh xắn)',
    ],
    goldenNote: 'Khi làm định ngữ bổ nghĩa cho danh từ thường thêm "的": 大大的眼睛. Khi làm trạng ngữ bổ nghĩa cho động từ dùng "地": 慢慢地走.',
    examples: [
      {
        chinese: '那个小女孩有一双大大的眼睛。',
        pinyin: 'Nàge xiǎo nǚhái yǒu yì shuāng dàdà de yǎnjing.',
        meaning: 'Bé gái đó có một đôi mắt to tròn long lanh.',
        highlightWord: '大大的',
      },
      {
        chinese: '秋天来了，树上的苹果红红的。',
        pinyin: 'Qiūtiān lái le, shù shàng de píngguǒ hónghóng de.',
        meaning: 'Mùa thu đến rồi, những quả táo trên cây chín đỏ hồng.',
        highlightWord: '红红的',
      },
      {
        chinese: '路很滑，你慢慢地走。',
        pinyin: 'Lù hěn huá, nǐ mànmàn de zǒu.',
        meaning: 'Đường rất trơn, bạn hãy đi từ từ cẩn thận nhé.',
        highlightWord: '慢慢地',
      },
    ],
    commonMistake: {
      wrong: '她的脸很红红的。',
      right: '她的脸红红的。',
      explanation: 'Không dùng phó từ "很" trước tính từ trùng điệp "红红的".',
    },
  },

  // 5. Double Adjective (AABB)
  {
    id: 'rd-5',
    pattern: 'AABB (Tính từ kép)',
    category: 'adj_double',
    categoryName: 'Tính từ song âm tiết',
    formula: 'AABB (Tách chữ: Chữ đầu lặp 2 lần + Chữ sau lặp 2 lần)',
    meaningEffect: 'Tăng cường mức độ miêu tả cực mạnh, tạo cảm giác sinh động, rực rỡ, vui tươi và tràn đầy cảm xúc.',
    coreWords: [
      '高兴 (gāoxìng) -> 高高兴兴 (vui vui vẻ vẻ, hớn hở)',
      '干净 (gānjìng) -> 干干净净 (sạch bong sáng bóng)',
      '漂亮 (piàoliang) -> 漂漂亮亮 (xinh đẹp rạng ngời)',
      '清楚 (qīngchu) -> 清清楚楚 (rành rành mạch mạch, rõ mồn một)',
      '热烈 (rèliè) -> 热热烈烈 (rộn ràng náo nhiệt)',
      '马虎 (mǎhu) -> 马马虎虎 (tàm tạm, qua loa đại khái)',
    ],
    goldenNote: 'Chữ thứ hai đọc thanh 1 nhẹ, chữ thứ ba và tư giữ nguyên điệu. Cuối câu thường kèm "的".',
    examples: [
      {
        chinese: '放学了，孩子们高高兴兴地跑回家。',
        pinyin: 'Fàngxué le, háizimen gāogāo-xìngxìng de pǎo huí jiā.',
        meaning: 'Tan học rồi, lũ trẻ vui vẻ hớn hở chạy ùa về nhà.',
        highlightWord: '高高兴兴地',
      },
      {
        chinese: '大家把教室打扫得干干净净。',
        pinyin: 'Dàjiā bǎ jiàoshì dǎsǎo de gāngān-jìngjìng.',
        meaning: 'Mọi người đã dọn dẹp phòng học sạch bong kin kít.',
        highlightWord: '干干净净',
      },
      {
        chinese: '老师把语法规则讲得清清楚楚。',
        pinyin: 'Lǎoshī bǎ yǔfǎ guīzé jiǎng de qīngqīng-chǔchǔ.',
        meaning: 'Thầy giáo đã giảng các quy tắc ngữ pháp rõ ràng tường tận mồn một.',
        highlightWord: '清清楚楚',
      },
    ],
    commonMistake: {
      wrong: '今天小王穿得很漂漂亮亮。',
      right: '今天小王穿得漂漂亮亮的。',
      explanation: 'Không dùng "很" trong bổ ngữ miêu tả với tính từ trùng điệp AABB.',
    },
  },

  // 6. Noun & Measure Word (AA)
  {
    id: 'rd-6',
    pattern: 'AA (Danh từ & Lượng từ)',
    category: 'noun_measure',
    categoryName: 'Danh từ & Lượng từ trùng điệp',
    formula: 'Danh từ / Lượng từ + Danh từ / Lượng từ',
    meaningEffect: 'Tương đương với nghĩa "Mỗi / Từng" (每... / 每一个), biểu thị không có ngoại lệ, toàn thể đều như vậy.',
    coreWords: [
      '天 (tiān) -> 天天 (ngày ngày = 每天)',
      '年 (nián) -> 年年 (năm năm = 每年)',
      '人 (rén) -> 人人 (người người, ai nấy = 每个人)',
      '家 (jiā) -> 家家 (nhà nhà = 每家)',
      '个 (gè) -> 个个 (từng cái một, ai ai cũng = 每个)',
      '条 (tiáo) -> 条条 (từng con đường/dòng sông)',
      '件 (jiàn) -> 件件 (từng việc/từng cái áo)',
    ],
    goldenNote: 'Phía sau danh từ/lượng từ trùng điệp thường đi kèm phó từ "都" (đều) để khẳng định tính toàn thể!',
    examples: [
      {
        chinese: '他天天都坚持练习中文听力。',
        pinyin: 'Tā tiāntiān dōu jiānchí liànxí zhōngwén tīnglì.',
        meaning: 'Ngày nào anh ấy cũng kiên trì luyện nghe tiếng Trung.',
        highlightWord: '天天',
      },
      {
        chinese: '祝你们全家年年都平安健康。',
        pinyin: 'Zhù nǐmen quán jiā niánnián dōu píng\'ān jiànkāng.',
        meaning: 'Chúc toàn thể gia đình bạn năm nào cũng bình an mạnh khỏe.',
        highlightWord: '年年',
      },
      {
        chinese: '这里的苹果个个都又大又甜。',
        pinyin: 'Zhèlǐ de píngguǒ gègè dōu yòu dà yòu tián.',
        meaning: 'Táo ở đây quả nào quả nấy đều vừa to vừa ngọt.',
        highlightWord: '个个',
      },
    ],
    commonMistake: {
      wrong: '每天天我都去跑步。',
      right: '天天我都去跑步。 HOẶC 每天我都去跑步。',
      explanation: '"天天" đã bằng nghĩa với "每天" rồi, không được ghép lặp thành "每天天".',
    },
  },
];

export const REDUPLICATION_QUIZ_LIST: ReduplicationQuizItem[] = [
  {
    id: 'rq-1',
    question: 'Chọn cách dùng trùng điệp ĐÚNG của động từ ly hợp "散步" (đi dạo):',
    sentence: '晚饭后，我们去公园___吧。',
    pinyin: 'Wǎnfàn hòu, wǒmen qù gōngyuán ___ ba.',
    meaning: 'Sau bữa tối, chúng ta ra công viên đi dạo một chút nhé.',
    options: ['散步散步', '散散步', '散步一下', '散一散步一'],
    correctIndex: 1,
    explanation: '"散步" là động từ ly hợp (Động từ 散 + Danh từ 步), khi trùng điệp bắt buộc theo công thức AAB -> "散散步".',
    ruleTested: 'Động từ ly hợp lặp AAB',
  },
  {
    id: 'rq-2',
    question: 'Chọn cách dùng trùng điệp ĐÚNG của tính từ "干净" (sạch sẽ):',
    sentence: '同学们把教室打扫得___。',
    pinyin: 'Tóngxuémen bǎ jiàoshì dǎsǎo de ___.',
    meaning: 'Các bạn học sinh đã dọn dẹp phòng học sạch bong kin kít.',
    options: ['干净干净', '很干干净净', '干干净净', '干干净净一下'],
    correctIndex: 2,
    explanation: 'Tính từ 2 âm tiết lặp kiểu AABB -> "干干净净". Không dùng "很" và không dùng "一下" kèm theo.',
    ruleTested: 'Tính từ song âm tiết lặp AABB',
  },
  {
    id: 'rq-3',
    question: 'Chọn cách dùng trùng điệp ĐÚNG của động từ "学习" (học tập):',
    sentence: '王老师经验很丰富，我们应该向他___。',
    pinyin: 'Wáng lǎoshī jīngyàn hěn fēngfù, wǒmen yīnggāi xiàng tā ___.',
    meaning: 'Thầy Vương rất giàu kinh nghiệm, chúng ta nên học hỏi thầy một chút.',
    options: ['学学习习', '学习学习', '学习一下一下', '学一学一习'],
    correctIndex: 1,
    explanation: '"学习" là động từ thông thường 2 âm tiết, khi trùng điệp giữ nguyên cả cụm theo thể ABAB -> "学习学习". (Khác với tính từ AABB).',
    ruleTested: 'Động từ song âm tiết lặp ABAB',
  },
  {
    id: 'rq-4',
    question: 'Câu nào dưới đây bị SAI NGỮ PHÁP do vi phạm đại kỵ trùng điệp?',
    sentence: 'Tìm câu sai trong 4 câu sau:',
    pinyin: 'Tǐng wèn nǎ jù huà shì cuò de:',
    meaning: 'Tìm câu dùng sai quy tắc trùng điệp.',
    options: [
      '这件衣服你试试吧。',
      '请你让我看看一下。',
      '大家坐下来休息休息。',
      '她长着一双大大的眼睛。',
    ],
    correctIndex: 1,
    explanation: 'Đại kỵ 1: Động từ trùng điệp "看看" KHÔNG được đi kèm với "一下". Phải nói "让我看看" hoặc "让我看一下".',
    ruleTested: 'Đại kỵ không đi với 一下',
  },
  {
    id: 'rq-5',
    question: 'Chọn cách nói ĐÚNG của động từ ly hợp "游泳" (bơi lội):',
    sentence: '夏天到了，周末我们去海边___吧。',
    pinyin: 'Xiàtiān dào le, zhōumò wǒmen qù hǎibiān ___ ba.',
    meaning: 'Mùa hè đến rồi, cuối tuần chúng ta đi ra biển bơi lội nhé.',
    options: ['游泳游泳', '游游泳', '游一游泳一', '游水游泳'],
    correctIndex: 1,
    explanation: '"游泳" là động từ ly hợp, dạng trùng điệp chuẩn là AAB -> "游游泳".',
    ruleTested: 'Động từ ly hợp lặp AAB',
  },
  {
    id: 'rq-6',
    question: 'Điền từ thích hợp: "Ngày nào anh ấy cũng kiên trì chạy bộ."',
    sentence: '他___都坚持去跑步。',
    pinyin: 'Tā ___ dōu jiānchí qù pǎobù.',
    meaning: 'Ngày nào anh ấy cũng kiên trì đi chạy bộ.',
    options: ['每天天', '天一', '天天', '天天的'],
    correctIndex: 2,
    explanation: 'Danh từ chỉ thời gian trùng điệp "天天" mang nghĩa "mỗi ngày / ngày ngày". Không dùng "每天天".',
    ruleTested: 'Danh từ thời gian lặp AA',
  },
  {
    id: 'rq-7',
    question: 'Chọn câu ĐÚNG NHẤT miêu tả tâm trạng vui mừng hớn hở:',
    sentence: 'Nghe tin đỗ kỳ thi, cô ấy vui vẻ chạy về nhà báo tin cho mẹ.',
    pinyin: 'Tīng dào xiāoxi, tā gāoxìng de pǎo huí jiā.',
    meaning: 'Cô ấy vui vẻ chạy về nhà.',
    options: [
      '她很高高兴兴地跑回家。',
      '她高兴高兴地跑回家。',
      '她高高兴兴地跑回家。',
      '她高高兴兴一下地跑回家。',
    ],
    correctIndex: 2,
    explanation: 'Tính từ "高兴" lặp AABB thành "高高兴兴". Không thêm "很" và không thêm "一下".',
    ruleTested: 'Tính từ làm trạng ngữ AABB地',
  },
  {
    id: 'rq-8',
    question: 'Dạng quá khứ đã diễn ra (A了A) của động từ "看" (xem/nhìn) là gì?',
    sentence: '他___手表，发现时间已经不早了。',
    pinyin: 'Tā ___ shǒubiǎo, fāxiàn shíjiān yǐjīng bù zǎo le.',
    meaning: 'Anh ấy liếc nhìn đồng hồ một cái, phát hiện thời gian đã không còn sớm.',
    options: ['看了看', '看看了', '看一看了', '看了看一看'],
    correctIndex: 0,
    explanation: 'Khi hành động trong quá khứ diễn ra trong thời gian ngắn, công thức là A了A -> "看了看".',
    ruleTested: 'Dạng quá khứ A了A',
  },
  {
    id: 'rq-9',
    question: 'Chọn cách dùng trùng điệp ĐÚNG của động từ ly hợp "聊天" (trò chuyện):',
    sentence: '好久不见了，今晚找个地方___吧。',
    pinyin: 'Hǎojiǔ bú jiàn le, jīnwǎn zhǎo gè dìfang ___ ba.',
    meaning: 'Lâu lắm không gặp rồi, tối nay tìm chỗ nào trò chuyện một chút đi.',
    options: ['聊天聊天', '聊聊天', '聊一聊一', '聊天聊'],
    correctIndex: 1,
    explanation: '"聊天" là động từ ly hợp (Động từ 聊 + Danh từ 天) -> Trùng điệp theo thể AAB: "聊聊天".',
    ruleTested: 'Động từ ly hợp lặp AAB',
  },
  {
    id: 'rq-10',
    question: 'Nhận định nào sau đây là HOÀN TOÀN CHÍNH XÁC?',
    sentence: 'Chọn phát biểu đúng về ngữ pháp tiếng Trung:',
    pinyin: 'Qǐng xuǎn zhèngquè de fābiǎo:',
    meaning: 'Quy tắc trùng điệp chuẩn.',
    options: [
      'Động từ hai âm tiết trùng điệp theo dạng AABB, tính từ theo dạng ABAB.',
      'Động từ hai âm tiết trùng điệp theo dạng ABAB, tính từ theo dạng AABB.',
      'Cả động từ và tính từ hai âm tiết đều trùng điệp theo dạng ABAB.',
      'Cả động từ và tính từ hai âm tiết đều trùng điệp theo dạng AABB.',
    ],
    correctIndex: 1,
    explanation: 'Quy tắc vàng: Động từ lặp nguyên cụm ABAB (学习学习, 休息休息); Tính từ tách đôi lặp AABB (干干净净, 高高兴兴).',
    ruleTested: 'Phân biệt cốt lõi ABAB vs AABB',
  },
];
