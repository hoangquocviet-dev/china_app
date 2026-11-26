export interface ConnectorExample {
  chinese: string;
  pinyin: string;
  meaning: string;
  highlightWords: string[];
}

export interface ConnectorItem {
  id: string;
  pair: string; // e.g. "因为……所以……"
  pinyin: string; // e.g. "yīnwèi... suǒyǐ..."
  vietnamese: string; // e.g. "Vì... nên..."
  category: 'cause_effect' | 'transition_concession' | 'condition_hypothesis' | 'progression' | 'parallel_sequence' | 'choice_preference';
  categoryName: string;
  hskLevel: 'HSK 1' | 'HSK 2' | 'HSK 3';
  formula: string; // e.g. "因为 + [Nguyên nhân], 所以 + [Kết quả]"
  usageRule: string; // Giải thích chi tiết cách dùng
  goldenTip: string; // Mẹo vàng / Lưu ý quan trọng
  examples: ConnectorExample[];
}

export interface ConnectorQuizItem {
  id: string;
  sentence: string; // Câu có chỗ trống e.g. "他___长得帅，___性格特别温柔。"
  pinyin: string;
  meaning: string;
  options: string[]; // 4 lựa chọn e.g. ["不但……而且……", "虽然……但是……", "因为……所以……", "如果……就……"]
  correctIndex: number;
  explanation: string;
  relationship: string;
}

export const CONNECTOR_CATEGORIES = [
  { id: 'all', name: 'Tất cả liên từ', icon: 'Sparkles', color: 'indigo' },
  { id: 'cause_effect', name: 'Nguyên nhân - Kết quả (因果)', icon: 'ArrowRightCircle', color: 'emerald' },
  { id: 'transition_concession', name: 'Chuyển ngoặt & Nhượng bộ (转折)', icon: 'Repeat', color: 'amber' },
  { id: 'condition_hypothesis', name: 'Giả thiết & Điều kiện (假设)', icon: 'HelpCircle', color: 'blue' },
  { id: 'progression', name: 'Tăng tiến & Bổ sung (递进)', icon: 'TrendingUp', color: 'purple' },
  { id: 'parallel_sequence', name: 'Song song & Tiếp nối (并列)', icon: 'Layers', color: 'pink' },
  { id: 'choice_preference', name: 'Lựa chọn & So sánh (选择)', icon: 'GitCompare', color: 'rose' },
] as const;

export const GOLDEN_COMPARISONS = [
  {
    title: 'Bẫy Kinh Điển: 只要……就…… vs 只有……才……',
    tipA: {
      pattern: '只要……就…… (Chỉ cần... thì...)',
      nature: 'Điều kiện ĐỦ (Sufficiency)',
      desc: 'Chỉ cần đạt được điều kiện này là lập tức có kết quả. Có thể có nhiều con đường khác để đạt mục tiêu.',
      example: '只要你坚持练习，汉语水平就会提高。',
      meaning: 'Chỉ cần bạn kiên trì luyện tập thì trình độ tiếng Trung sẽ nâng cao.',
    },
    tipB: {
      pattern: '只有……才…… (Chỉ có... mới...)',
      nature: 'Điều kiện CẦN & DUY NHẤT (Necessity)',
      desc: 'Đây là điều kiện duy nhất, bắt buộc phải có. Không có điều kiện này thì tuyệt đối không thể có kết quả!',
      example: '只有多听多说，才能真正学好一门外语。',
      meaning: 'Chỉ có nghe nhiều nói nhiều thì mới có thể thực sự học giỏi một ngoại ngữ.',
    },
    memoryKey: '🔑 Khẩu quyết: "只要" đi với "就" (rộng mở), "只有" đi với "才" (chặt chẽ duy nhất)!',
  },
  {
    title: 'Phân Biệt: 一边……一边…… vs 又……又……',
    tipA: {
      pattern: '一边……一边…… (Vừa... vừa...)',
      nature: 'Hai HÀNH ĐỘNG cùng lúc (Động từ)',
      desc: 'Áp dụng cho 2 hành động do cùng một chủ thể thực hiện đồng thời.',
      example: '我喜欢一边喝茶，一边看书。',
      meaning: 'Tôi thích vừa uống trà vừa đọc sách.',
    },
    tipB: {
      pattern: '又……又…… (Vừa... lại vừa...)',
      nature: 'Hai ĐẶC ĐIỂM cùng lúc (Tính từ)',
      desc: 'Áp dụng cho 2 đặc tính, tính chất. Cả hai tính từ phải CÙNG TỐT hoặc CÙNG XẤU (đồng hướng cảm xúc).',
      example: '这间屋子又大又干净。',
      meaning: 'Căn phòng này vừa rộng lại vừa sạch sẽ.',
    },
    memoryKey: '🔑 Khẩu quyết: "一边" đi với Động từ làm việc; "又" đi với Tính từ khen/chê đồng điệu!',
  },
];

export const CONNECTORS_LIST: ConnectorItem[] = [
  // 1. Cause & Effect
  {
    id: 'cn-1',
    pair: '因为……所以……',
    pinyin: 'yīnwèi... suǒyǐ...',
    vietnamese: 'Vì…… nên……',
    category: 'cause_effect',
    categoryName: 'Nguyên nhân - Kết quả',
    hskLevel: 'HSK 1',
    formula: '因为 + [Nguyên nhân], 所以 + [Kết quả]',
    usageRule: 'Cặp từ nối cơ bản và phổ biến nhất trong tiếng Trung để diễn đạt quan hệ nguyên nhân - kết quả trực tiếp.',
    goldenTip: 'Trong khẩu ngữ có thể lược bớt "因为" hoặc "所以", nhưng khi viết hoặc thi cử nên dùng đủ cả đôi để câu văn chặt chẽ.',
    examples: [
      {
        chinese: '因为今天下大雨，所以我们没去公园。',
        pinyin: 'Yīnwèi jīntiān xià dàyǔ, suǒyǐ wǒmen méi qù gōngyuán.',
        meaning: 'Vì hôm nay mưa to nên chúng tôi không đi công viên.',
        highlightWords: ['因为', '所以'],
      },
      {
        chinese: '因为他每天努力学习，所以考试考得很好。',
        pinyin: 'Yīnwèi tā měitiān nǔlì xuéxí, suǒyǐ kǎoshì kǎo de hěn hǎo.',
        meaning: 'Vì cậu ấy ngày nào cũng nỗ lực học tập nên thi cử đạt điểm rất cao.',
        highlightWords: ['因为', '所以'],
      },
    ],
  },
  {
    id: 'cn-2',
    pair: '既然……就……',
    pinyin: 'jìrán... jiù...',
    vietnamese: 'Đã…… thì……',
    category: 'cause_effect',
    categoryName: 'Nguyên nhân - Kết quả',
    hskLevel: 'HSK 3',
    formula: '既然 + [Sự thật/Tiền đề đã rõ], (那/就) + [Hành động/Kết luận tiếp theo]',
    usageRule: 'Dùng khi đưa ra một kết luận, lời khuyên hoặc hành động dựa trên một sự thật hiển nhiên đã xảy ra.',
    goldenTip: 'Khác với "因为...所以...", "既然" nhấn mạnh sự việc đã rồi hoặc đã biết rõ để đưa ra hướng giải quyết hợp lý.',
    examples: [
      {
        chinese: '既然你身体不舒服，就在家好好休息吧。',
        pinyin: 'Jìrán nǐ shēntǐ bù shūfu, jiù zài jiā hǎohǎo xiūxi ba.',
        meaning: 'Đã thấy trong người không khỏe thì ở nhà nghỉ ngơi cho tốt đi.',
        highlightWords: ['既然', '就'],
      },
      {
        chinese: '既然决定了，就要坚持做到底。',
        pinyin: 'Jìrán juédìng le, jiù yào jiānchí zuò dào dǐ.',
        meaning: 'Một khi đã quyết định rồi thì phải kiên trì làm đến cùng.',
        highlightWords: ['既然', '就'],
      },
    ],
  },
  {
    id: 'cn-3',
    pair: '因此 / 因而',
    pinyin: 'yīncǐ / yīn\'ér',
    vietnamese: 'Do đó / Vì vậy',
    category: 'cause_effect',
    categoryName: 'Nguyên nhân - Kết quả',
    hskLevel: 'HSK 3',
    formula: '[Vế 1 nêu nguyên nhân], 因此 + [Vế 2 nêu kết quả tất yếu]',
    usageRule: 'Liên từ trang trọng đứng ở đầu vế câu thứ hai để chỉ ra kết quả xuất phát từ nguyên nhân phía trước.',
    goldenTip: 'Thường gặp trong văn viết, báo chí và các bài đọc HSK 3-4 hơn là khẩu ngữ thông tục.',
    examples: [
      {
        chinese: '他平时热心帮助大家，因此大家都喜欢他。',
        pinyin: 'Tā píngshí rèxīn bāngzhù dàjiā, yīncǐ dàjiā dōu xǐhuan tā.',
        meaning: 'Anh ấy bình thường luôn nhiệt tình giúp đỡ mọi người, do đó ai cũng yêu quý anh ấy.',
        highlightWords: ['因此'],
      },
    ],
  },

  // 2. Transition & Concession
  {
    id: 'cn-4',
    pair: '虽然……但是 / 可是……',
    pinyin: 'suīrán... dànshì / kěshì...',
    vietnamese: 'Mặc dù…… nhưng……',
    category: 'transition_concession',
    categoryName: 'Chuyển ngoặt & Nhượng bộ',
    hskLevel: 'HSK 2',
    formula: '虽然 + [Vế nhượng bộ], 但是/可是 + [Vế trọng tâm nhấn mạnh]',
    usageRule: 'Cặp từ chuyển ngoặt kinh điển. Vế sau "但是/可是" mang ý nghĩa trọng tâm mà người nói muốn khẳng định.',
    goldenTip: '"但是" mang sắc thái chuyển ngoặt mạnh mẽ, "可是" mang sắc thái nhẹ nhàng và hay dùng trong khẩu ngữ.',
    examples: [
      {
        chinese: '虽然汉语很难学，但是我觉得很有趣。',
        pinyin: 'Suīrán hànyǔ hěn nán xué, dànshì wǒ juéde hěn yǒuqù.',
        meaning: 'Mặc dù tiếng Trung rất khó học nhưng tôi thấy vô cùng thú vị.',
        highlightWords: ['虽然', '但是'],
      },
      {
        chinese: '虽然天气很冷，可是屋子里很暖和。',
        pinyin: 'Suīrán tiānqì hěn lěng, kěshì wūzi lǐ hěn nuǎnhuo.',
        meaning: 'Mặc dù thời tiết rất lạnh nhưng trong phòng lại rất ấm áp.',
        highlightWords: ['虽然', '可是'],
      },
    ],
  },
  {
    id: 'cn-5',
    pair: '尽管……还是……',
    pinyin: 'jǐnguǎn... háishì...',
    vietnamese: 'Cho dù…… vẫn……',
    category: 'transition_concession',
    categoryName: 'Chuyển ngoặt & Nhượng bộ',
    hskLevel: 'HSK 3',
    formula: '尽管 + [Trở ngại/Khó khăn thực tế], [Chủ ngữ] + 还是 + [Hành động kiên định]',
    usageRule: 'Nhượng bộ ở mức độ mạnh: Thừa nhận thực tế khó khăn nhưng kết quả hoặc hành động vẫn không hề thay đổi.',
    goldenTip: '"还是" thường đi liền ngay trước động từ để biểu thị sự tiếp diễn không suy suyển.',
    examples: [
      {
        chinese: '尽管下着雪，他还是坚持走去上班。',
        pinyin: 'Jǐnguǎn xià zhe xuě, tā háishì jiānchí zǒu qù shàngbān.',
        meaning: 'Cho dù tuyết đang rơi, anh ấy vẫn kiên trì đi bộ đến chỗ làm việc.',
        highlightWords: ['尽管', '还是'],
      },
    ],
  },
  {
    id: 'cn-6',
    pair: '不是……而是……',
    pinyin: 'búshì... érshì...',
    vietnamese: 'Không phải là…… mà là……',
    category: 'transition_concession',
    categoryName: 'Chuyển ngoặt & Nhượng bộ',
    hskLevel: 'HSK 3',
    formula: '不是 + [Đối tượng bị phủ định], 而是 + [Bản chất đúng được khẳng định]',
    usageRule: 'Bác bỏ ý niệm sai lầm ở vế trước và chỉ ra sự thật đích thực ở vế sau.',
    goldenTip: 'Cực kỳ hữu ích trong tranh luận và giải thích lý do chân thực.',
    examples: [
      {
        chinese: '我不是不想去，而是今天实在太忙了。',
        pinyin: 'Wǒ búshì bù xiǎng qù, érshì jīntiān shízài tài máng le.',
        meaning: 'Tôi không phải không muốn đi, mà là hôm nay thực sự quá bận.',
        highlightWords: ['不是', '而是'],
      },
    ],
  },

  // 3. Condition & Hypothesis
  {
    id: 'cn-7',
    pair: '如果 / 要是……就……',
    pinyin: 'rúguǒ / yàoshi... jiù...',
    vietnamese: 'Nếu…… thì……',
    category: 'condition_hypothesis',
    categoryName: 'Giả thiết & Điều kiện',
    hskLevel: 'HSK 1',
    formula: '如果/要是 + [Giả thiết tương lai], [Chủ ngữ] + 就 + [Kết quả/Hành động]',
    usageRule: 'Dùng để đưa ra giả định cho tương lai hoặc một tình huống chưa xảy ra.',
    goldenTip: '"如果" dùng trong mọi ngữ cảnh; "要是" mang sắc thái thân mật, đời thường trong giao tiếp gia đình, bạn bè.',
    examples: [
      {
        chinese: '如果你明天有空，我们就一起去逛街吧。',
        pinyin: 'Rúguǒ nǐ míngtiān yǒu kòng, wǒmen jiù yìqǐ qù guàngjiē ba.',
        meaning: 'Nếu ngày mai bạn rảnh thì chúng ta cùng nhau đi dạo phố nhé.',
        highlightWords: ['如果', '就'],
      },
      {
        chinese: '要是明天下雨，比赛就取消。',
        pinyin: 'Yàoshi míngtiān xià yǔ, bǐsài jiù qǔxiāo.',
        meaning: 'Nếu mai trời mưa thì trận đấu sẽ hủy bỏ.',
        highlightWords: ['要是', '就'],
      },
    ],
  },
  {
    id: 'cn-8',
    pair: '只要……就……',
    pinyin: 'zhǐyào... jiù...',
    vietnamese: 'Chỉ cần…… thì……',
    category: 'condition_hypothesis',
    categoryName: 'Giả thiết & Điều kiện',
    hskLevel: 'HSK 2',
    formula: '只要 + [Điều kiện đủ tối thiểu], 就 + [Kết quả tất yếu]',
    usageRule: 'Chỉ ra rằng chỉ cần đáp ứng một điều kiện là kết quả chắc chắn sẽ xảy ra (Điều kiện đủ).',
    goldenTip: 'Luôn ghi nhớ: 只要 đi đôi với 就! Đừng nhầm với 只有...才...',
    examples: [
      {
        chinese: '只要有信心，就一定能成功。',
        pinyin: 'Zhǐyào yǒu xìnxīn, jiù yídìng néng chénggōng.',
        meaning: 'Chỉ cần có lòng tự tin thì nhất định sẽ thành công.',
        highlightWords: ['只要', '就'],
      },
      {
        chinese: '只要你喜欢，我就买给你。',
        pinyin: 'Zhǐyào nǐ xǐhuan, wǒ jiù mǎi gěi nǐ.',
        meaning: 'Chỉ cần em thích thì anh sẽ mua cho em.',
        highlightWords: ['只要', '就'],
      },
    ],
  },
  {
    id: 'cn-9',
    pair: '只有……才……',
    pinyin: 'zhǐyǒu... cái...',
    vietnamese: 'Chỉ có…… mới……',
    category: 'condition_hypothesis',
    categoryName: 'Giả thiết & Điều kiện',
    hskLevel: 'HSK 2',
    formula: '只有 + [Điều kiện cần duy nhất / Bắt buộc], 才 + [Kết quả mới đạt được]',
    usageRule: 'Nhấn mạnh điều kiện duy nhất, tiên quyết. Không có điều kiện này thì tuyệt đối không thể có kết quả.',
    goldenTip: 'Luôn ghi nhớ: 只有 đi đôi với 才! Mang tính ràng buộc chặt chẽ hơn nhiều so với 只要.',
    examples: [
      {
        chinese: '只有每天练习听力，听力水平才会提高。',
        pinyin: 'Zhǐyǒu měitiān liànxí tīnglì, tīnglì shuǐpíng cái huì tígāo.',
        meaning: 'Chỉ có ngày nào cũng luyện nghe thì trình độ nghe mới có thể nâng cao.',
        highlightWords: ['只有', '才'],
      },
      {
        chinese: '只有年满十八岁，才可以考驾照。',
        pinyin: 'Zhǐyǒu nián mǎn shíbā suì, cái kěyǐ kǎo jiàzhào.',
        meaning: 'Chỉ có đủ 18 tuổi mới có thể thi bằng lái xe.',
        highlightWords: ['只有', '才'],
      },
    ],
  },
  {
    id: 'cn-10',
    pair: '无论 / 不管……都……',
    pinyin: 'wúlùn / bùguǎn... dōu...',
    vietnamese: 'Bất kể / Cho dù…… đều……',
    category: 'condition_hypothesis',
    categoryName: 'Giả thiết & Điều kiện',
    hskLevel: 'HSK 3',
    formula: '无论/不管 + [Bất cứ điều kiện nào (thường có từ nghi vấn 什么/怎么/谁)], 都/也 + [Kết quả không đổi]',
    usageRule: 'Biểu thị trong bất kỳ tình huống hay hoàn cảnh nào thì kết quả vẫn giữ nguyên không thay đổi.',
    goldenTip: 'Vế sau thường dùng "都" (đều) hoặc "也" (cũng) để khẳng định tính tuyệt đối.',
    examples: [
      {
        chinese: '不管刮风还是下雨，他每天都准时去上班。',
        pinyin: 'Bùguǎn guā fēng háishì xià yǔ, tā měitiān dōu zhǔnshí qù shàngbān.',
        meaning: 'Cho dù nổi gió hay đổ mưa, ngày nào anh ấy cũng đúng giờ đi làm.',
        highlightWords: ['不管', '都'],
      },
      {
        chinese: '无论发生什么事，我都会支持你。',
        pinyin: 'Wúlùn fāshēng shénme shì, wǒ dōu huì zhīchí nǐ.',
        meaning: 'Bất luận xảy ra chuyện gì, tôi đều sẽ luôn ủng hộ bạn.',
        highlightWords: ['无论', '都'],
      },
    ],
  },

  // 4. Progression & Addition
  {
    id: 'cn-11',
    pair: '不但 / 不仅……而且 / 还……',
    pinyin: 'búdàn / bùjǐn... érqiě / hái...',
    vietnamese: 'Không những…… mà còn……',
    category: 'progression',
    categoryName: 'Tăng tiến & Bổ sung',
    hskLevel: 'HSK 2',
    formula: '[Chủ ngữ] + 不但 + [Đặc điểm 1], 而且/还 + [Đặc điểm tăng tiến 2]',
    usageRule: 'Diễn tả mối quan hệ tăng tiến: Vế sau tiến thêm một bước sâu hơn hoặc rộng hơn so với vế trước.',
    goldenTip: 'Lưu ý về Chủ ngữ: Nếu cùng 1 chủ ngữ, đặt chủ ngữ TRƯỚC 不但. Nếu 2 chủ ngữ khác nhau, đặt 不但 TRƯỚC chủ ngữ 1!',
    examples: [
      {
        chinese: '她不但会说汉语，而且还会说法语。',
        pinyin: 'Tā búdàn huì shuō hànyǔ, érqiě hái huì shuō fǎyǔ.',
        meaning: 'Cô ấy không những biết nói tiếng Trung mà còn biết nói cả tiếng Pháp.',
        highlightWords: ['不但', '而且', '还'],
      },
      {
        chinese: '不仅我喜欢中国菜，我的全家人都喜欢。',
        pinyin: 'Bùjǐn wǒ xǐhuan zhōngguó cài, wǒ de quán jiā rén dōu xǐhuan.',
        meaning: 'Không chỉ tôi thích món ăn Trung Quốc mà cả nhà tôi ai cũng thích.',
        highlightWords: ['不仅', '都'],
      },
    ],
  },
  {
    id: 'cn-12',
    pair: '甚至……',
    pinyin: 'shènzhì...',
    vietnamese: 'Thậm chí / Ngay cả……',
    category: 'progression',
    categoryName: 'Tăng tiến & Bổ sung',
    hskLevel: 'HSK 3',
    formula: '[Mức độ bình thường], 甚至 + [Mức độ cực đoan/ngoài sức tưởng tượng]',
    usageRule: 'Nhấn mạnh trường hợp vượt xa mức bình thường hoặc gây bất ngờ lớn.',
    goldenTip: 'Thường kết hợp với "连...也/都..." để tăng thêm sức thuyết phục.',
    examples: [
      {
        chinese: '他太投入工作了，甚至连晚饭都忘了吃。',
        pinyin: 'Tā tài tóurù gōngzuò le, shènzhì lián wǎnfàn dōu wàng le chī.',
        meaning: 'Anh ấy quá tập trung làm việc, thậm chí ngay cả cơm tối cũng quên ăn.',
        highlightWords: ['甚至'],
      },
    ],
  },

  // 5. Parallel & Sequence
  {
    id: 'cn-13',
    pair: '一边……一边……',
    pinyin: 'yìbiān... yìbiān...',
    vietnamese: 'Vừa…… vừa…… (Hành động)',
    category: 'parallel_sequence',
    categoryName: 'Song song & Tiếp nối',
    hskLevel: 'HSK 2',
    formula: '[Chủ ngữ] + 一边 + [Động từ 1], 一边 + [Động từ 2]',
    usageRule: 'Diễn tả hai hành động diễn ra song song cùng một thời điểm do cùng một người thực hiện.',
    goldenTip: 'Chỉ đi với Động từ hành động, không đi với tính từ miêu tả tính chất.',
    examples: [
      {
        chinese: '他喜欢一边吃早餐，一边看新闻。',
        pinyin: 'Tā xǐhuan yìbiān chī zǎocān, yìbiān kàn xīnwén.',
        meaning: 'Anh ấy thích vừa ăn bữa sáng vừa xem tin tức.',
        highlightWords: ['一边', '一边'],
      },
    ],
  },
  {
    id: 'cn-14',
    pair: '又……又……',
    pinyin: 'yòu... yòu...',
    vietnamese: 'Vừa…… lại vừa…… (Tính chất)',
    category: 'parallel_sequence',
    categoryName: 'Song song & Tiếp nối',
    hskLevel: 'HSK 1',
    formula: '[Danh từ] + 又 + [Tính từ 1], 又 + [Tính từ 2]',
    usageRule: 'Biểu thị hai tính chất hoặc trạng thái cùng đồng thời tồn tại ở một sự vật hoặc hiện tượng.',
    goldenTip: 'Hai tính từ PHẢI CÙNG TỐT hoặc CÙNG XẤU (đồng điệu cảm xúc: vừa to vừa đẹp, vừa đắt vừa dở).',
    examples: [
      {
        chinese: '这家超市的水果又新鲜又便宜。',
        pinyin: 'Zhè jiā chāoshì de shuǐguǒ yòu xīnxiān yòu piányi.',
        meaning: 'Hoa quả của siêu thị này vừa tươi lại vừa rẻ.',
        highlightWords: ['又', '又'],
      },
      {
        chinese: '西瓜又大又甜。',
        pinyin: 'Xīguā yòu dà yòu tián.',
        meaning: 'Dưa hấu vừa to lại vừa ngọt.',
        highlightWords: ['又', '又'],
      },
    ],
  },
  {
    id: 'cn-15',
    pair: '一……就……',
    pinyin: 'yī... jiù...',
    vietnamese: 'Vừa mới…… đã…… / Hễ…… là……',
    category: 'parallel_sequence',
    categoryName: 'Song song & Tiếp nối',
    hskLevel: 'HSK 2',
    formula: '[Chủ ngữ] + 一 + [Hành động 1], 就 + [Hành động 2 ngay sau đó]',
    usageRule: 'Diễn tả hai hành động nối tiếp nhau cực kỳ nhanh chóng, hoặc một điều kiện vừa phát sinh là kết quả diễn ra lập tức.',
    goldenTip: 'Diễn tả tốc độ phản xạ chớp nhoáng: vừa về nhà là mở TV, hễ gặp khó khăn là nản lòng.',
    examples: [
      {
        chinese: '他一回到家，就打开电脑开始工作。',
        pinyin: 'Tā yī huí dào jiā, jiù dǎkāi diànnǎo kāishǐ gōngzuò.',
        meaning: 'Anh ấy vừa về đến nhà là mở máy tính bắt đầu làm việc ngay.',
        highlightWords: ['一', '就'],
      },
      {
        chinese: '我一喝咖啡就头疼。',
        pinyin: 'Wǒ yī hē kāfēi jiù tóuténg.',
        meaning: 'Tôi hễ uống cà phê vào là bị đau đầu.',
        highlightWords: ['一', '就'],
      },
    ],
  },
  {
    id: 'cn-16',
    pair: '越……越……',
    pinyin: 'yuè... yuè...',
    vietnamese: 'Càng…… càng……',
    category: 'parallel_sequence',
    categoryName: 'Song song & Tiếp nối',
    hskLevel: 'HSK 2',
    formula: '越 + [Điều kiện biến đổi], 越 + [Mức độ tăng dần theo]',
    usageRule: 'Chỉ mức độ của một trạng thái hoặc tính chất thay đổi tỷ lệ thuận theo sự phát triển của hành động.',
    goldenTip: 'Có thể dùng cho 1 chủ ngữ (tôi càng nghe càng thích) hoặc 2 chủ ngữ khác nhau (trời càng mưa đường càng trơn).',
    examples: [
      {
        chinese: '这首中文歌我越听越喜欢。',
        pinyin: 'Zhè shǒu zhōngwén gē wǒ yuè tīng yuè xǐhuan.',
        meaning: 'Bài hát tiếng Trung này tôi càng nghe lại càng thấy thích.',
        highlightWords: ['越', '越'],
      },
      {
        chinese: '雨越下越大。',
        pinyin: 'Yǔ yuè xià yuè dà.',
        meaning: 'Mưa càng rơi càng nặng hạt.',
        highlightWords: ['越', '越'],
      },
    ],
  },

  // 6. Choice & Preference
  {
    id: 'cn-17',
    pair: '不是……就是……',
    pinyin: 'búshì... jiùshì...',
    vietnamese: 'Không phải…… thì là……',
    category: 'choice_preference',
    categoryName: 'Lựa chọn & So sánh',
    hskLevel: 'HSK 2',
    formula: '不是 + [Khả năng A], 就是 + [Khả năng B duy nhất còn lại]',
    usageRule: 'Chỉ có 2 khả năng loại trừ lẫn nhau: nếu không rơi vào trường hợp A thì chắc chắn rơi vào trường hợp B.',
    goldenTip: 'Dùng để dự đoán hoặc miêu tả thói quen cố định chỉ xoay quanh 2 sự lựa chọn.',
    examples: [
      {
        chinese: '周末他不是在图书馆，就是在操场打篮球。',
        pinyin: 'Zhōumò tā búshì zài túshūguǎn, jiùshì zài cāochǎng dǎ lánqiú.',
        meaning: 'Cuối tuần cậu ấy không phải ở trong thư viện thì là ở trên sân bóng rổ.',
        highlightWords: ['不是', '就是'],
      },
    ],
  },
  {
    id: 'cn-18',
    pair: '与其……不如……',
    pinyin: 'yǔqí... bùrú...',
    vietnamese: 'Thà rằng…… còn hơn…… / Thay vì…… thà……',
    category: 'choice_preference',
    categoryName: 'Lựa chọn & So sánh',
    hskLevel: 'HSK 3',
    formula: '与其 + [Phương án bị từ chối], 不如 + [Phương án tối ưu được lựa chọn]',
    usageRule: 'Cân nhắc giữa hai phương án: vế trước là phương án không mong muốn, vế sau là giải pháp tốt hơn hẳn.',
    goldenTip: 'Tâm lý học ngôn ngữ: Người nói luôn nghiêng hẳn sự đồng tình về phương án đứng sau "不如".',
    examples: [
      {
        chinese: '与其在家里无聊看手机，不如出去散步运动。',
        pinyin: 'Yǔqí zài jiā lǐ wúliáo kàn shǒujī, bùrú chūqù sànbù yùndòng.',
        meaning: 'Thay vì ở nhà buồn chán lướt điện thoại, thà ra ngoài đi dạo vận động còn hơn.',
        highlightWords: ['与其', '不如'],
      },
    ],
  },
];

export const CONNECTOR_QUIZ_LIST: ConnectorQuizItem[] = [
  {
    id: 'cq-1',
    sentence: '今天___下大雨，___运动会推迟了。',
    pinyin: 'Jīntiān ___ xià dàyǔ, ___ yùndònghuì tuīchí le.',
    meaning: 'Hôm nay vì trời mưa to nên đại hội thể thao bị hoãn lại.',
    options: ['因为……所以……', '虽然……但是……', '不但……而且……', '如果……就……'],
    correctIndex: 0,
    explanation: 'Quan hệ nguyên nhân - kết quả rõ ràng: mưa to là nguyên nhân dẫn đến kết quả hoãn hội thao -> Chọn "因为……所以……".',
    relationship: 'Nguyên nhân - Kết quả',
  },
  {
    id: 'cq-2',
    sentence: '汉语___很难写，___发音很有意思。',
    pinyin: 'Hànyǔ ___ hěn nán xiě, ___ fāyīn hěn yǒuyìsi.',
    meaning: 'Chữ Hán mặc dù rất khó viết nhưng phát âm lại rất thú vị.',
    options: ['因为……所以……', '虽然……但是……', '只有……才……', '只要……就……'],
    correctIndex: 1,
    explanation: 'Quan hệ chuyển ngoặt nhượng bộ: khó viết nhưng lại thú vị -> Chọn "虽然……但是……".',
    relationship: 'Chuyển ngoặt',
  },
  {
    id: 'cq-3',
    sentence: '___坚持每天背单词，词汇量___能快速增长。',
    pinyin: '___ jiānchí měitiān bèi dāncí, cíhuìliàng ___ néng kuàisù zēngzhǎng.',
    meaning: 'Chỉ cần kiên trì học từ vựng mỗi ngày thì lượng từ sẽ tăng nhanh chóng.',
    options: ['虽然……但是……', '只要……就……', '只有……才……', '与其……不如……'],
    correctIndex: 1,
    explanation: 'Điều kiện đủ kèm trợ từ "就" ở vế sau -> Điền cặp "只要……就……".',
    relationship: 'Điều kiện đủ',
  },
  {
    id: 'cq-4',
    sentence: '___通过HSK 3级考试，___能申请去中国留学。',
    pinyin: '___ tōngguò HSK 3 jí kǎoshì, ___ néng shēnqǐng qù zhōngguó liúxué.',
    meaning: 'Chỉ có vượt qua kỳ thi HSK 3 mới có thể nộp đơn xin đi du học Trung Quốc.',
    options: ['只要……就……', '只有……才……', '因为……所以……', '不仅……而且……'],
    correctIndex: 1,
    explanation: 'Điều kiện bắt buộc tiên quyết (có "才" ở vế sau) -> Bắt buộc dùng "只有……才……".',
    relationship: 'Điều kiện duy nhất',
  },
  {
    id: 'cq-5',
    sentence: '他___会弹钢琴，___唱歌也非常好听。',
    pinyin: 'Tā ___ huì tán gāngqín, ___ chànggē yě fēicháng hǎotīng.',
    meaning: 'Anh ấy không những biết chơi piano mà hát cũng rất hay.',
    options: ['不但……而且……', '与其……不如……', '一边……一边……', '不是……就是……'],
    correctIndex: 0,
    explanation: 'Quan hệ tăng tiến: biết đàn lại thêm hát hay -> Chọn "不但……而且……".',
    relationship: 'Tăng tiến',
  },
  {
    id: 'cq-6',
    sentence: '她喜欢___听音乐，___做家务。',
    pinyin: 'Tā xǐhuan ___ tīng yīnyuè, ___ zuò jiāwù.',
    meaning: 'Cô ấy thích vừa nghe nhạc vừa làm việc nhà.',
    options: ['又……又……', '一边……一边……', '越……越……', '虽然……但是……'],
    correctIndex: 1,
    explanation: 'Hai hành động (động từ 听 và 做) diễn ra đồng thời cùng lúc -> Chọn "一边……一边……".',
    relationship: 'Song song hành động',
  },
  {
    id: 'cq-7',
    sentence: '这个西瓜___大___甜，太好吃了！',
    pinyin: 'Zhège xīguā ___ dà ___ tián, tài hǎochī le!',
    meaning: 'Quả dưa hấu này vừa to lại vừa ngọt, ngon quá đi mất!',
    options: ['一边……一边……', '又……又……', '如果……就……', '因为……所以……'],
    correctIndex: 1,
    explanation: 'Hai tính từ tích cực đồng thời miêu tả quả dưa (to và ngọt) -> Chọn "又……又……".',
    relationship: 'Song song tính chất',
  },
  {
    id: 'cq-8',
    sentence: '弟弟___回到家，___跑去看电视。',
    pinyin: 'Dìdi ___ huí dào jiā, ___ pǎo qù kàn diànshì.',
    meaning: 'Em trai vừa mới về đến nhà là chạy đi xem tivi ngay lập tức.',
    options: ['一……就……', '虽然……但是……', '只有……才……', '越……越……'],
    correctIndex: 0,
    explanation: 'Hai hành động diễn ra kế tiếp chớp nhoáng (vừa về là chạy xem TV) -> Chọn "一……就……".',
    relationship: 'Tiếp nối chớp nhoáng',
  },
  {
    id: 'cq-9',
    sentence: '放假的时候，他___在家看书，___去健身房。',
    pinyin: 'Fàngjià de shíhou, tā ___ zài jiā kàn shū, ___ qù jiànshēnfáng.',
    meaning: 'Những ngày nghỉ lễ, cậu ấy không ở nhà đọc sách thì là đi phòng gym.',
    options: ['不是……就是……', '因为……所以……', '虽然……但是……', '只要……就……'],
    correctIndex: 0,
    explanation: 'Hai lựa chọn loại trừ nhau (không ở nhà thì ở phòng tập) -> Chọn "不是……就是……".',
    relationship: 'Lựa chọn',
  },
  {
    id: 'cq-10',
    sentence: '___在这儿一直等待，___我们主动给他打电话吧。',
    pinyin: '___ zài zhèr yìzhí děngdài, ___ wǒmen zhǔdòng gěi tā dǎ diànhuà ba.',
    meaning: 'Thay vì ở đây đợi mãi, thà chúng ta chủ động gọi điện cho anh ấy còn hơn.',
    options: ['因为……所以……', '与其……不如……', '不但……而且……', '只要……就……'],
    correctIndex: 1,
    explanation: 'So sánh giữa việc thụ động chờ đợi và chủ động gọi điện (chọn giải pháp tốt hơn) -> Chọn "与其……不如……".',
    relationship: 'So sánh & Lựa chọn',
  },
];
