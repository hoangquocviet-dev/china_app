export interface WordOrderExample {
  chinese: string;
  pinyin: string;
  meaning: string;
  breakdown: string;
}

export interface WordOrderPrinciple {
  id: string;
  title: string;
  mnemonic: string;
  formula: string;
  level: string;
  explanation: string;
  goldenTip: string;
  examples: WordOrderExample[];
  mistakeComparison: {
    wrong: string;
    wrongPinyin: string;
    right: string;
    rightPinyin: string;
    meaning: string;
    reason: string;
  };
}

export interface WordOrderQuizItem {
  id: string;
  question: string;
  promptMeaning: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  ruleTested: string;
}

export interface BigToSmallItem {
  category: string;
  description: string;
  chinese: string;
  pinyin: string;
  vietnamese: string;
  orderExplanation: string;
}

// KHẨU QUYẾT TỔNG QUÁT: S + T + P + M + V + O + C
export const MASTER_WORD_ORDER_FORMULA = {
  formula: 'Chủ ngữ (S) + [Thời gian (T)] + [Địa điểm (P)] + [Phương thức/Cùng ai (M)] + Động từ (V) + Tân ngữ (O) + [Bổ ngữ (C)]',
  rhyme: 'Ai - Khi nào - Ở đâu - Cùng ai - Làm gì - Cái gì - Như thế nào / Bao lâu',
  chineseFullExample: '我明天上午在图书馆跟朋友一起学汉语学了两个小时。',
  pinyinFullExample: 'Wǒ míngtiān shàngwǔ zài túshūguǎn gēn péngyou yìqǐ xué Hànyǔ xué le liǎng gè xiǎoshí.',
  meaningFullExample: 'Sáng mai tôi học tiếng Trung cùng bạn ở thư viện trong hai tiếng đồng hồ.',
  breakdown: [
    { label: 'Chủ ngữ (S)', word: '我 (Tôi)', color: 'text-rose-400' },
    { label: 'Thời gian (T)', word: '明天上午 (Sáng mai)', color: 'text-amber-400' },
    { label: 'Nơi chốn (P)', word: '在图书馆 (Ở thư viện)', color: 'text-emerald-400' },
    { label: 'Đồng hành (M)', word: '跟朋友一起 (Cùng với bạn)', color: 'text-sky-400' },
    { label: 'Động từ (V)', word: '学 (Học)', color: 'text-purple-400' },
    { label: 'Tân ngữ (O)', word: '汉语 (Tiếng Trung)', color: 'text-indigo-400' },
    { label: 'Bổ ngữ (C)', word: '学了两个小时 (Được 2 tiếng)', color: 'text-cyan-400' },
  ],
};

export const WORD_ORDER_PRINCIPLES: WordOrderPrinciple[] = [
  {
    id: 'time-before-verb',
    title: '1. Thời gian đứng TRƯỚC Động từ (Time before Verb)',
    mnemonic: 'Thời gian có trước ➔ Hành động có sau',
    formula: 'Chủ ngữ + [Thời gian] + Động từ + Tân ngữ (hoặc: [Thời gian] + Chủ ngữ + Động từ + Tân ngữ)',
    level: 'HSK 1',
    explanation:
      'Trong tiếng Việt, trạng ngữ thời gian thường đặt ở cuối câu ("Tôi đi Hà Nội ngày mai"). Nhưng trong tiếng Trung, thời gian TUYỆT ĐỐI KHÔNG ĐƯỢC đặt ở cuối câu! Thời gian phải đứng trước động từ vị ngữ, có thể đứng sau chủ ngữ hoặc trước chủ ngữ để nhấn mạnh.',
    goldenTip:
      'Chỉ có 2 vị trí cho trạng từ thời gian: Đầu câu (trước S) hoặc Ngay sau S. CẤM đặt cuối câu!',
    examples: [
      {
        chinese: '我明天去学校。',
        pinyin: 'Wǒ míngtiān qù xuéxiào.',
        meaning: 'Ngày mai tôi đến trường.',
        breakdown: '我 (S) + 明天 (T) + 去 (V) + 学校 (O)',
      },
      {
        chinese: '晚上我们一起看电影。',
        pinyin: 'Wǎnshang wǒmen yìqǐ kàn diànyǐng.',
        meaning: 'Buổi tối chúng tôi cùng nhau xem phim.',
        breakdown: '晚上 (T) + 我们 (S) + 一起看 (V) + 电影 (O)',
      },
      {
        chinese: '他星期天常常在家休息。',
        pinyin: 'Tā xīngqītiān chángcháng zài jiā xiūxi.',
        meaning: 'Chủ nhật anh ấy thường ở nhà nghỉ ngơi.',
        breakdown: '他 (S) + 星期天 (T) + 常常 (Phó từ) + 在家 (P) + 休息 (V)',
      },
    ],
    mistakeComparison: {
      wrong: '我去学校明天。',
      wrongPinyin: 'Wǒ qù xuéxiào míngtiān. (Dịch word-by-word theo tiếng Việt)',
      right: '我明天去学校。',
      rightPinyin: 'Wǒ míngtiān qù xuéxiào. (hoặc: 明天我去学校。)',
      meaning: 'Ngày mai tôi đi học / đến trường.',
      reason: 'Tiếng Trung không bao giờ đặt thời gian ở cuối câu như tiếng Việt.',
    },
  },
  {
    id: 'place-before-verb',
    title: '2. Nơi chốn (在 + Địa điểm) đứng TRƯỚC Động từ',
    mnemonic: 'Ở đâu trước ➔ Làm gì sau',
    formula: 'Chủ ngữ + [在 + Nơi chốn] + Động từ + Tân ngữ',
    level: 'HSK 1-2',
    explanation:
      'Người Việt có thói quen nói hành động trước rồi nói địa điểm sau: "Tôi ăn cơm ở nhà", "Anh ấy làm việc ở bệnh viện". Trong tiếng Trung, tư duy bắt buộc là: Người đó phải CÓ MẶT Ở ĐỊA ĐIỂM ĐÓ trước, rồi mới THỰC HIỆN HÀNH ĐỘNG.',
    goldenTip:
      'Quy tắc vàng: "在 + Nơi chốn" luôn đi trước Động từ. Trừ 6 động từ vị trí lưu lại (住, 坐, 站, 躺, 停, 放) mới đi trước 在.',
    examples: [
      {
        chinese: '我在家吃饭。',
        pinyin: 'Wǒ zài jiā chī fàn.',
        meaning: 'Tôi ăn cơm ở nhà.',
        breakdown: '我 (S) + 在家 (P) + 吃饭 (V+O)',
      },
      {
        chinese: '妈妈在超市买苹果。',
        pinyin: 'Māma zài chāoshì mǎi píngguǒ.',
        meaning: 'Mẹ mua táo ở siêu thị.',
        breakdown: '妈妈 (S) + 在超市 (P) + 买 (V) + 苹果 (O)',
      },
      {
        chinese: '他在北京的一家医院工作。',
        pinyin: 'Tā zài Běijīng de yì jiā yīyuàn gōngzuò.',
        meaning: 'Anh ấy làm việc ở một bệnh viện tại Bắc Kinh.',
        breakdown: '他 (S) + 在北京的一家医院 (P) + 工作 (V)',
      },
    ],
    mistakeComparison: {
      wrong: '我吃饭在家。',
      wrongPinyin: 'Wǒ chī fàn zài jiā. (Lỗi kinh điển của 90% người mới học)',
      right: '我在家吃饭。',
      rightPinyin: 'Wǒ zài jiā chī fàn.',
      meaning: 'Tôi ăn cơm ở nhà.',
      reason: 'Cụm trạng ngữ chỉ nơi chốn "在 + Nơi chốn" bắt buộc phải đứng trước động từ hành động.',
    },
  },
  {
    id: 'companion-manner-before-verb',
    title: '3. Đồng hành & Công cụ (跟.../用...) đứng TRƯỚC Động từ',
    mnemonic: 'Cùng ai / Bằng gì ➔ Làm việc đó',
    formula: 'Chủ ngữ + [跟/和 + Người khác] + Động từ (hoặc: S + [用 + Công cụ] + V + O)',
    level: 'HSK 1-2',
    explanation:
      'Tiếng Việt nói "Tôi đi xem phim với anh ấy", "Tôi ăn cơm bằng đũa". Trong tiếng Trung, cụm từ chỉ sự đồng hành (跟...一起) và công cụ, phương thức (用...) bắt buộc phải đứng TRƯỚC động từ.',
    goldenTip:
      'Tuyệt đối không đưa "跟..." hay "用..." ra sau động từ vị ngữ!',
    examples: [
      {
        chinese: '我跟朋友一起学汉语。',
        pinyin: 'Wǒ gēn péngyou yìqǐ xué Hànyǔ.',
        meaning: 'Tôi học tiếng Trung cùng với bạn bè.',
        breakdown: '我 (S) + 跟朋友一起 (M) + 学 (V) + 汉语 (O)',
      },
      {
        chinese: '中国人用筷子吃饭。',
        pinyin: 'Zhōngguórén yòng kuàizi chī fàn.',
        meaning: 'Người Trung Quốc ăn cơm bằng đũa.',
        breakdown: '中国人 (S) + 用筷子 (Phương thức) + 吃饭 (V+O)',
      },
      {
        chinese: '请给我一杯水。',
        pinyin: 'Qǐng gěi wǒ yì bēi shuǐ.',
        meaning: 'Xin hãy cho tôi một cốc nước (Lấy cho tôi).',
        breakdown: '给 (Giới từ đối tượng) + 我 + 一杯水',
      },
    ],
    mistakeComparison: {
      wrong: '我去超市跟我妈妈。',
      wrongPinyin: 'Wǒ qù chāoshì gēn wǒ māma. (Sai)',
      right: '我跟我妈妈去超市。',
      rightPinyin: 'Wǒ gēn wǒ māma qù chāoshì.',
      meaning: 'Tôi đi siêu thị với mẹ tôi.',
      reason: 'Cụm "跟 + Đối tượng" là trạng ngữ, bắt buộc đứng trước động từ 去.',
    },
  },
  {
    id: 'modifier-before-noun',
    title: '4. Định ngữ đứng TRƯỚC Danh từ (Tính chất + 的 + Danh từ)',
    mnemonic: 'Cái gì phụ đứng trước ➔ Cái gì chính đứng sau',
    formula: 'Định ngữ (Tính từ / Sở hữu / Mệnh đề) + [的] + Danh từ trung tâm',
    level: 'HSK 1-2',
    explanation:
      'Tiếng Việt đặt danh từ chính trước rồi đến tính chất: "cô gái xinh đẹp", "cuốn sách tôi mua hôm qua". Tiếng Trung ngược lại 100%: Thành phần bổ nghĩa (định ngữ) luôn đứng TRƯỚC danh từ chính. Danh từ quan trọng nhất luôn nằm ở cuối cụm!',
    goldenTip:
      'Danh từ trung tâm (đối tượng chính) luôn đứng CUỐI CÙNG trong cụm danh từ.',
    examples: [
      {
        chinese: '漂亮的衣服',
        pinyin: 'piàoliang de yīfu',
        meaning: 'Bộ quần áo xinh đẹp',
        breakdown: '漂亮的 (Định ngữ tính chất) + 衣服 (Danh từ trung tâm)',
      },
      {
        chinese: '昨天买的书',
        pinyin: 'zuótiān mǎi de shū',
        meaning: 'Cuốn sách mua ngày hôm qua',
        breakdown: '昨天买的 (Định ngữ mệnh đề) + 书 (Danh từ trung tâm)',
      },
      {
        chinese: '教我们汉语的王老师',
        pinyin: 'jiāo wǒmen Hànyǔ de Wáng lǎoshī',
        meaning: 'Thầy Vương - người dạy tiếng Trung cho chúng tôi',
        breakdown: '教我们汉语的 (Mệnh đề định ngữ) + 王老师 (Danh từ chính)',
      },
    ],
    mistakeComparison: {
      wrong: '老师教我们汉语很客气。 (Khi muốn nói: Thầy giáo dạy chúng tôi rất lịch sự)',
      wrongPinyin: 'Lǎoshī jiāo wǒmen Hànyǔ hěn kèqi. (Dễ gây hiểu lầm thành câu phức)',
      right: '教我们汉语的老师很客气。',
      rightPinyin: 'Jiāo wǒmen Hànyǔ de lǎoshī hěn kèqi.',
      meaning: 'Thầy giáo dạy tiếng Trung cho chúng tôi rất lịch thiệp.',
      reason: 'Toàn bộ cụm "dạy chúng tôi tiếng Trung" là định ngữ bổ nghĩa cho "thầy giáo", nên phải đứng trước 的 老师.',
    },
  },
  {
    id: 'duration-after-verb',
    title: '5. Bổ ngữ Thời lượng & Tần suất đứng SAU Động từ',
    mnemonic: 'Đã làm bao lâu / mấy lần ➔ Đặt sau Động từ',
    formula: 'V + Tân ngữ + V + [Thời lượng] (hoặc: V + [Thời lượng] + 的 + Tân ngữ)',
    level: 'HSK 2-3',
    explanation:
      'Bổ ngữ thời lượng cho biết hành động diễn ra trong bao lâu (3 tiếng, 1 tuần, 5 phút). Nếu động từ có mang tân ngữ, ta phải LẶP LẠI ĐỘNG TỪ (学汉语学了三年) hoặc đặt thời lượng trước tân ngữ (学了三年的汉语).',
    goldenTip:
      'Phân biệt: "Thời điểm" (khi nào làm ➔ đứng TRƯỚC V) vs "Thời lượng" (làm trong bao lâu ➔ đứng SAU V).',
    examples: [
      {
        chinese: '他游了半个小时。',
        pinyin: 'Tā yóu le bàn gè xiǎoshí.',
        meaning: 'Anh ấy đã bơi trong nửa tiếng đồng hồ.',
        breakdown: '他 (S) + 游 (V) + 了 + 半个小时 (Thời lượng)',
      },
      {
        chinese: '我学中文学了两年。',
        pinyin: 'Wǒ xué Zhōngwén xué le liǎng nián.',
        meaning: 'Tôi học tiếng Trung được hai năm rồi.',
        breakdown: '我 (S) + 学中文 (V+O) + 学 (Lặp lại V) + 了两年 (Thời lượng)',
      },
      {
        chinese: '我们在北京住了三年。',
        pinyin: 'Wǒmen zài Běijīng zhù le sān nián.',
        meaning: 'Chúng tôi đã sống ở Bắc Kinh trong 3 năm.',
        breakdown: '我们 (S) + 在北京 (P) + 住了 (V+le) + 三年 (Thời lượng)',
      },
    ],
    mistakeComparison: {
      wrong: '我两个小时看书。 (Muốn nói: Tôi đọc sách 2 tiếng)',
      wrongPinyin: 'Wǒ liǎng gè xiǎoshí kàn shū. (Sai hoàn toàn)',
      right: '我看书看了两个小时。 (hoặc: 我看了两个小时的书。)',
      rightPinyin: 'Wǒ kàn shū kàn le liǎng gè xiǎoshí.',
      meaning: 'Tôi đã đọc sách trong hai tiếng.',
      reason: 'Thời lượng (liǎng gè xiǎoshí) biểu thị độ dài hành động, bắt buộc đứng sau động từ có lặp lại.',
    },
  },
  {
    id: 'big-to-small-rule',
    title: '6. Quy tắc Từ LỚN đến BÉ (Big to Small Principle)',
    mnemonic: 'Lớn trước, Nhỏ sau ➔ Năm đến Giờ, Nước đến Số nhà',
    formula: 'Năm ➔ Tháng ➔ Ngày ➔ Buổi ➔ Giờ (hoặc: Quốc gia ➔ Tỉnh/Thành ➔ Đường ➔ Số)',
    level: 'HSK 1-2',
    explanation:
      'Tư duy không gian và thời gian của người Trung Quốc đi từ phạm vi tổng thể rộng lớn rồi thu hẹp dần đến chi tiết nhỏ nhất. Ngược lại với tiếng Việt là đi từ nhỏ nhất đến lớn nhất (ngày 26 tháng 11 năm 2026; số 10 đường Trần Phú, Hà Nội).',
    goldenTip:
      'Quy tắc bao trùm: Năm ➔ Tháng ➔ Ngày ➔ Buổi (Sáng/Chiều) ➔ Giờ ➔ Phút.',
    examples: [
      {
        chinese: '2026年11月26日下午3点',
        pinyin: 'Èr líng èr liù nián shíyī yuè èrshíliù rì xiàwǔ sān diǎn',
        meaning: '3 giờ chiều ngày 26 tháng 11 năm 2026',
        breakdown: '2026年 (Năm) ➔ 11月 (Tháng) ➔ 26日 (Ngày) ➔ 下午 (Buổi chiều) ➔ 3点 (3 giờ)',
      },
      {
        chinese: '中国北京市海淀区中关村南大街5号',
        pinyin: 'Zhōngguó Běijīng Shì Hǎidiàn Qū Zhōngguāncūn Nán Dàjiē wǔ hào',
        meaning: 'Số 5 đại lộ Nam Trung Quan Thôn, quận Hải Điến, thành phố Bắc Kinh, Trung Quốc',
        breakdown: 'Trung Quốc ➔ Bắc Kinh ➔ Quận Hải Điến ➔ Đường phố ➔ Số nhà',
      },
      {
        chinese: '明天早上八点',
        pinyin: 'míngtiān zǎoshang bā diǎn',
        meaning: '8 giờ sáng ngày mai',
        breakdown: '明天 (Ngày mai) ➔ 早上 (Buổi sáng) ➔ 八点 (8 giờ)',
      },
    ],
    mistakeComparison: {
      wrong: '八点早上明天见。',
      wrongPinyin: 'Bā diǎn zǎoshang míngtiān jiàn. (Sai)',
      right: '明天早上八点见。',
      rightPinyin: 'Míngtiān zǎoshang bā diǎn jiàn.',
      meaning: 'Hẹn gặp bạn lúc 8 giờ sáng ngày mai.',
      reason: 'Thời gian phải sắp xếp theo thứ tự lớn trước nhỏ sau: Ngày mai (明天) ➔ Buổi sáng (早上) ➔ 8 giờ (八点).',
    },
  },
];

export const BIG_TO_SMALL_ITEMS: BigToSmallItem[] = [
  {
    category: 'Thời gian (Date & Time)',
    description: 'Thứ tự: Năm ➔ Tháng ➔ Ngày ➔ Buổi ➔ Giờ ➔ Phút',
    chinese: '2026年5月18日上午9点30分',
    pinyin: 'Èr líng èr liù nián wǔ yuè shíbā rì shàngwǔ jiǔ diǎn sānshí fēn',
    vietnamese: '9 giờ 30 phút sáng ngày 18 tháng 5 năm 2026',
    orderExplanation: 'Tiếng Việt: 9h30 ➔ Sáng ➔ Ngày 18 ➔ Tháng 5 ➔ 2026 (Bé đến lớn) vs Tiếng Trung (Lớn đến bé).',
  },
  {
    category: 'Địa chỉ nơi chốn (Address)',
    description: 'Thứ tự: Quốc gia ➔ Tỉnh/Thành phố ➔ Quận/Huyện ➔ Phố/Đường ➔ Số nhà/Tòa',
    chinese: '越南河内市巴亭区金马路12号',
    pinyin: 'Yuènán Hénèi Shì Bātíng Qū Jīnmǎ Lù shí\'èr hào',
    vietnamese: 'Số 12 đường Kim Mã, quận Ba Đình, thành phố Hà Nội, Việt Nam',
    orderExplanation: 'Người Trung Quốc xác định từ bản đồ lớn rồi phóng to (zoom in) dần vào vị trí cụ thể.',
  },
  {
    category: 'Tên cơ quan / Trường học (Organization)',
    description: 'Thứ tự: Đơn vị chủ quản cấp trên ➔ Đơn vị cấp dưới ➔ Phòng ban / Lớp',
    chinese: '北京大学中文系一年级三班',
    pinyin: 'Běijīng Dàxué Zhōngwén Xì yī niánjí sān bān',
    vietnamese: 'Lớp 3 năm thứ nhất khoa Trung văn trường Đại học Bắc Kinh',
    orderExplanation: 'Trường Đại học (Lớn nhất) ➔ Khoa ➔ Khóa/Năm ➔ Lớp cụ thể.',
  },
];

export const FOUR_GOLDEN_TABOOS = [
  {
    id: 'taboo-1',
    name: 'Đại kỵ 1: Đưa "ở đâu (在 + Nơi chốn)" ra sau động từ',
    wrong: '我买苹果在超市。 ❌',
    right: '我在超市买苹果。 ✓',
    pinyin: 'Wǒ zài chāoshì mǎi píngguǒ.',
    meaning: 'Tôi mua táo ở siêu thị.',
    explanation: 'Hành động mua xảy ra TẠI siêu thị, nên địa điểm phải đứng TRƯỚC động từ.',
  },
  {
    id: 'taboo-2',
    name: 'Đại kỵ 2: Đưa trạng ngữ thời gian xuống cuối câu',
    wrong: '我们看电影今天晚上。 ❌',
    right: '今天晚上我们看电影。 ✓ (hoặc: 我们今天晚上看电影。)',
    pinyin: 'Jīntiān wǎnshang wǒmen kàn diànyǐng.',
    meaning: 'Tối nay chúng tôi đi xem phim.',
    explanation: 'Thời gian chỉ được đứng ở đầu câu hoặc ngay sau chủ ngữ, tuyệt đối không đứng cuối câu.',
  },
  {
    id: 'taboo-3',
    name: 'Đại kỵ 3: Đưa đối tượng đồng hành "cùng ai (跟...)" ra sau hành động',
    wrong: '我去中国跟我朋友。 ❌',
    right: '我跟我朋友去中国。 ✓',
    pinyin: 'Wǒ gēn wǒ péngyou qù Zhōngguó.',
    meaning: 'Tôi đi Trung Quốc cùng với bạn tôi.',
    explanation: '"跟 + Đối tượng" đóng vai trò trạng ngữ phương thức/đồng hành, luôn đứng trước động từ 去.',
  },
  {
    id: 'taboo-4',
    name: 'Đại kỵ 4: Nhầm lẫn giữa "Thời điểm" (Khi nào) và "Thời lượng" (Bao lâu)',
    wrong: '我两个小时看书。 ❌ (Muốn nói: Tôi đọc sách 2 tiếng)',
    right: '我看书看了两个小时。 ✓ (hoặc: 我看了两个小时的书。)',
    pinyin: 'Wǒ kàn shū kàn le liǎng gè xiǎoshí.',
    meaning: 'Tôi đã đọc sách trong hai tiếng.',
    explanation: 'Hai tiếng (两个小时) là độ dài thời gian (Thời lượng) nên đứng sau động từ lặp lại; không phải thời điểm làm.',
  },
];

export const WORD_ORDER_QUIZ_LIST: WordOrderQuizItem[] = [
  {
    id: 'quiz-1',
    question: 'Chọn câu có trật tự từ ĐÚNG chuẩn ngữ pháp tiếng Trung:',
    promptMeaning: 'Ngày mai tôi đi thư viện đọc sách cùng bạn.',
    options: [
      '我明天在图书馆看书跟朋友。',
      '我明天跟朋友在图书馆看书。',
      '我看书在图书馆明天跟朋友。',
      '我跟朋友看书在图书馆明天。',
    ],
    correctIndex: 1,
    explanation: 'Áp dụng công thức S + T + M + P + V + O: 我 (S) + 明天 (T) + 跟朋友 (M) + 在图书馆 (P) + 看书 (V+O).',
    ruleTested: 'S + T + M + P + V + O',
  },
  {
    id: 'quiz-2',
    question: 'Câu nào sau đây dịch ĐÚNG câu: "Buổi tối tôi ăn cơm ở nhà"?',
    promptMeaning: 'Buổi tối tôi ăn cơm ở nhà.',
    options: [
      '我吃晚饭在家。',
      '我在家晚上吃晚饭。',
      '我晚上在家吃晚饭。',
      '我吃晚饭晚上在家。',
    ],
    correctIndex: 2,
    explanation: 'Thời gian (晚上) trước nơi chốn (在家), và nơi chốn đứng trước động từ (吃晚饭) ➔ 我晚上在家吃晚饭。',
    ruleTested: 'Thời gian ➔ Nơi chốn ➔ Động từ',
  },
  {
    id: 'quiz-3',
    question: 'Chọn thứ tự thời gian ĐÚNG theo nguyên tắc "Từ lớn đến bé":',
    promptMeaning: '8 giờ sáng ngày mai',
    options: [
      '八点明天早上',
      '早上八点明天',
      '明天早上八点',
      '明天八点早上',
    ],
    correctIndex: 2,
    explanation: 'Quy tắc từ lớn đến bé: Ngày mai (明天) ➔ Buổi sáng (早上) ➔ 8 giờ (八点).',
    ruleTested: 'Nguyên tắc Lớn trước Nhỏ sau',
  },
  {
    id: 'quiz-4',
    question: 'Câu nào sau đây bị SAI trật tự từ nghiêm trọng?',
    promptMeaning: 'Tìm câu sai trong các câu sau:',
    options: [
      '我们在学校见。',
      '他下星期去北京。',
      '妈妈买菜在早市。',
      '我跟姐姐一起去买衣服。',
    ],
    correctIndex: 2,
    explanation: 'Câu C sai vì đưa nơi chốn "在早市" ra sau động từ "买菜". Câu đúng phải là: 妈妈在早市买菜。',
    ruleTested: 'Đại kỵ đưa nơi chốn ra sau động từ',
  },
  {
    id: 'quiz-5',
    question: 'Điền cụm từ vào chỗ trống đúng trật tự: "我 ______ 去北京。"',
    promptMeaning: 'Tôi đi Bắc Kinh cùng mẹ vào tháng sau.',
    options: [
      '下个月跟我妈妈',
      '跟我妈妈下个月',
      '下个月去跟我妈妈',
      '去下个月跟我妈妈',
    ],
    correctIndex: 0,
    explanation: 'Thời gian đứng trước đồng hành: 下个月 (Thời gian) ➔ 跟我妈妈 (Đồng hành) ➔ 去北京 (Động từ + Tân ngữ).',
    ruleTested: 'Thời gian đứng trước Đồng hành',
  },
  {
    id: 'quiz-6',
    question: 'Chọn cách diễn đạt ĐÚNG cho câu: "Cuốn sách bạn tôi tặng tôi rất thú vị":',
    promptMeaning: 'Quyển sách bạn tôi tặng tôi rất hay.',
    options: [
      '书我朋友送我的很有意思。',
      '我朋友送我的书很有意思。',
      '我朋友送我很有意思的书。',
      '很有意思的书我朋友送我。',
    ],
    correctIndex: 1,
    explanation: 'Cụm "bạn tôi tặng tôi" là định ngữ bổ nghĩa cho "cuốn sách", nên phải đứng trước 的: 我朋友送我的书 (Định ngữ + 的 + Danh từ trung tâm).',
    ruleTested: 'Định ngữ đứng trước Danh từ trung tâm',
  },
  {
    id: 'quiz-7',
    question: 'Câu nào sau đây diễn đạt ĐÚNG thời lượng: "Anh ấy đã học bơi trong một tháng"?',
    promptMeaning: 'Anh ấy đã học bơi một tháng.',
    options: [
      '他一个月学游泳。',
      '他学游泳一个月了。 (hoặc: 他学游泳学了一个月。)',
      '他学一个月的游泳在河里。',
      '他游泳一个月学了。',
    ],
    correctIndex: 1,
    explanation: 'Bổ ngữ thời lượng (一个月) bắt buộc đứng sau động từ có lặp lại: 他学游泳学了一个月。',
    ruleTested: 'Bổ ngữ thời lượng đứng sau động từ',
  },
  {
    id: 'quiz-8',
    question: 'Trật tự ĐÚNG của câu gồm các từ: [中国人 / 筷子 / 用 / 吃饭] là:',
    promptMeaning: 'Người Trung Quốc ăn cơm bằng đũa.',
    options: [
      '中国人吃饭用筷子。',
      '中国人用筷子吃饭。',
      '用筷子中国人吃饭。',
      '吃饭中国人用筷子。',
    ],
    correctIndex: 1,
    explanation: 'Phương thức, công cụ (用筷子) luôn đứng trước động từ hành động (吃饭): 中国人用筷子吃饭。',
    ruleTested: 'Công cụ & Phương thức đứng trước Động từ',
  },
  {
    id: 'quiz-9',
    question: 'Chọn câu ĐÚNG khi diễn đạt nơi ở: "Bố tôi sống ở Thượng Hải":',
    promptMeaning: 'Bố tôi sống ở Thượng Hải.',
    options: [
      '我爸爸在上海住。 (Hoặc tự nhiên hơn: 我爸爸住在上海。)',
      '我爸爸住上海在。',
      '在上海我爸爸住着。',
      '我爸爸上海住。',
    ],
    correctIndex: 0,
    explanation: 'Động từ "住" (sống/ở) là động từ trạng thái vị trí lưu lại đặc biệt, có thể nói "住在上海" hoặc "在上海住", trong đó "住在上海" là tự nhiên và chuẩn nhất.',
    ruleTested: 'Động từ vị trí đặc biệt (住, 坐, 站...)',
  },
  {
    id: 'quiz-10',
    question: 'Chọn câu hoàn chỉnh ĐÚNG cho ý: "Thứ Hai tuần sau chúng ta gặp nhau ở quán cà phê lúc 3 giờ chiều nhé!":',
    promptMeaning: 'Thứ Hai tuần sau gặp ở quán cà phê lúc 3h chiều nhé!',
    options: [
      '我们在咖啡馆下星期一下午三点见吧！',
      '我们下星期一下午三点在咖啡馆见吧！',
      '我们下午三点下星期一在咖啡馆见吧！',
      '我们下星期一在咖啡馆下午三点见吧！',
    ],
    correctIndex: 1,
    explanation: 'Thứ tự vàng: Chủ ngữ (我们) ➔ Thời gian lớn đến bé (下星期一下午三点) ➔ Nơi chốn (在咖啡馆) ➔ Động từ (见吧).',
    ruleTested: 'Khẩu quyết trật tự từ tổng hợp S + T + P + V',
  },
];
