export interface BaBeiExample {
  chinese: string;
  pinyin: string;
  meaning: string;
  highlightWord: string;
}

export interface BaBeiItem {
  id: string;
  pattern: string; // e.g. "把 + Tân ngữ + V + 了"
  type: 'ba' | 'bei' | 'transform';
  typeName: string;
  formula: string; // e.g. "S + 把 + O + V + 了"
  meaningEffect: string;
  goldenRule: string;
  examples: BaBeiExample[];
  commonMistake?: {
    wrong: string;
    right: string;
    explanation: string;
  };
}

export interface BaBeiQuizItem {
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

export interface TwoWayPair {
  baSentence: {
    chinese: string;
    pinyin: string;
    meaning: string;
  };
  beiSentence: {
    chinese: string;
    pinyin: string;
    meaning: string;
  };
  note: string;
}

export const TWO_WAY_TRANSFORM_LIST: TwoWayPair[] = [
  {
    baSentence: {
      chinese: '小猫把那条鱼吃完了。',
      pinyin: 'Xiǎomāo bǎ nà tiáo yú chīwán le.',
      meaning: 'Con mèo đã ăn hết con cá đó rồi.',
    },
    beiSentence: {
      chinese: '那条鱼被小猫吃完了。',
      pinyin: 'Nà tiáo yú bèi xiǎomāo chīwán le.',
      meaning: 'Con cá đó đã bị con mèo ăn hết sạch rồi.',
    },
    note: 'Chủ ngữ câu 把 chuyển thành tác nhân sau 被; Tân ngữ sau 把 chuyển thành chủ ngữ đứng đầu câu 被.',
  },
  {
    baSentence: {
      chinese: '小偷偷走了他的钱包。 -> 小偷把他的钱包偷走了。',
      pinyin: 'Xiǎotōu bǎ tā de qiánbāo tōuzǒu le.',
      meaning: 'Tên trộm đã lấy cắp ví tiền của anh ấy đi rồi.',
    },
    beiSentence: {
      chinese: '他的钱包被小偷偷走了。',
      pinyin: 'Tā de qiánbāo bèi xiǎotōu tōuzǒu le.',
      meaning: 'Ví tiền của anh ấy đã bị tên trộm lấy cắp mất rồi.',
    },
    note: 'Nhấn mạnh sự việc không mong muốn (mất ví) trong câu chữ 被.',
  },
  {
    baSentence: {
      chinese: '大风把树上的叶子刮落了。',
      pinyin: 'Dàfēng bǎ shù shàng de yèzi guāluò le.',
      meaning: 'Cơn gió lớn đã thổi rụng lá trên cây.',
    },
    beiSentence: {
      chinese: '树上的叶子被大风刮落了。',
      pinyin: 'Shù shàng de yèzi bèi dàfēng guāluò le.',
      meaning: 'Lá trên cây đã bị gió lớn thổi rụng xuống.',
    },
    note: 'Hiện tượng tự nhiên tác động làm biến đổi vị trí/trạng thái sự vật.',
  },
];

export const BABEI_GOLDEN_RULES = [
  {
    title: 'Bẫy 1: Phủ định (没) & Động từ năng nguyện (想/要/能) BẮT BUỘC ĐỨNG TRƯỚC "把/被"',
    rule: 'Trong cả câu chữ 把 và câu chữ 被, từ phủ định (没/没有/别) và động từ năng nguyện (想, 要, 能, 可以, 应该) tuyệt đối KHÔNG ĐƯỢC đặt sau 把/被 hay sau động từ, mà PHẢI ĐỨNG NGAY TRƯỚC "把/被".',
    wrong: '我把作业没做完。 / 我把这本书想借给你。 (Sai)',
    right: '我没把作业做完。 / 我想把这本书借给你。 (Đúng)',
    explanation: 'Quy tắc vàng: S + [没 / 想 / 要 / 能] + 把 / 被 + O + V + Thành phần khác!',
  },
  {
    title: 'Bẫy 2: Động từ chính TUYỆT ĐỐI KHÔNG ĐƯỢC ĐỨNG ĐƠN ĐỘC một mình',
    rule: 'Câu chữ 把 là câu xử lý làm thay đổi trạng thái sự vật, vì vậy động từ bắt buộc phải có thành phần kèm theo (như trợ từ 了, bổ ngữ kết quả 完/好/错, bổ ngữ xu hướng 出来/回去, động từ lặp lại 看看, hoặc cụm 在/到/给).',
    wrong: '我把苹果吃。 / 请你把门开。 (Sai cấm kỵ)',
    right: '我把苹果吃了。 / 请你把门打开。 (Đúng)',
    explanation: 'Không bao giờ để động từ trơ trọi một mình trong câu chữ 把!',
  },
  {
    title: 'Bẫy 3: Tân ngữ của "把" PHẢI LÀ ĐỐI TƯỢNG XÁC ĐỊNH',
    rule: 'Người nghe và người nói phải biết rõ đối tượng đang được xử lý là cái nào (thường có 这个, 那个, 我的, hoặc ngữ cảnh đã nhắc tới). Không dùng số lượng từ phiếm định như "一个苹果", "一本书".',
    wrong: '他把一本书买了。 (Sai)',
    right: '他把那本书买了。 HOẶC 他把这本书看完了。 (Đúng)',
    explanation: 'Chỉ có vật đã xác định cụ thể thì người ta mới có thể "xử lý" nó.',
  },
  {
    title: 'Bẫy 4: Các động từ tâm lý / tri giác KHÔNG DÙNG trong câu chữ "把"',
    rule: 'Câu chữ 把 chỉ dùng cho các động từ hành động có tính tác động và xử lý cụ thể. Các động từ nhận thức, tâm lý, tồn tại như: 有, 是, 认识, 知道, 喜欢, 觉得, 看见, 听见 KHÔNG ĐƯỢC dùng câu chữ 把.',
    wrong: '我把你认识。 / 我把中文喜欢。 (Sai hoàn toàn)',
    right: '我认识你。 / 我喜欢中文。 (Đúng)',
    explanation: 'Các động từ trạng thái tâm lý không tạo ra sự biến đổi vật lý/vị trí nên không đi với 把.',
  },
];

export const BABEI_LIST: BaBeiItem[] = [
  // 1. BA Sentences
  {
    id: 'bb-1',
    pattern: 'S + 把 + O + V + 了 (Biến đổi trạng thái)',
    type: 'ba',
    typeName: 'Câu chữ 把 cơ bản',
    formula: 'Chủ ngữ + 把 + Tân ngữ + Động từ + 了',
    meaningEffect: 'Nhấn mạnh hành động đã xử lý xong và kết thúc bằng việc làm biến đổi trạng thái của đối tượng.',
    goldenRule: 'Động từ phải đi kèm trợ từ "了", không đứng một mình.',
    examples: [
      {
        chinese: '我把今天的药喝了。',
        pinyin: 'Wǒ bǎ jīntiān de yào hē le.',
        meaning: 'Tôi đã uống thuốc của ngày hôm nay rồi.',
        highlightWord: '把今天的药喝了',
      },
      {
        chinese: '弟弟把桌上的牛奶喝了。',
        pinyin: 'Dìdi bǎ zhuō shàng de niúnǎi hē le.',
        meaning: 'Em trai đã uống hết cốc sữa trên bàn rồi.',
        highlightWord: '把桌上的牛奶喝了',
      },
    ],
    commonMistake: {
      wrong: '我把药喝。',
      right: '我把药喝了。',
      explanation: 'Động từ trong câu chữ 把 không được đứng một mình.',
    },
  },
  {
    id: 'bb-2',
    pattern: 'S + 把 + O + V + Bổ ngữ kết quả/xu hướng',
    type: 'ba',
    typeName: 'Câu chữ 把 kết hợp Bổ ngữ',
    formula: 'Chủ ngữ + 把 + Tân ngữ + Động từ + Bổ ngữ (完/好/开/出来/过去...)',
    meaningEffect: 'Diễn tả hành động xử lý đem lại kết quả cụ thể hoặc làm thay đổi phương hướng di chuyển của vật.',
    goldenRule: 'Đây là dạng xuất hiện nhiều nhất trong các đề thi HSK!',
    examples: [
      {
        chinese: '请你把窗户打开，房间里有点闷。',
        pinyin: 'Qǐng nǐ bǎ chuānghu dǎkāi, fángjiān lǐ yǒudiǎn mèn.',
        meaning: 'Xin bạn hãy mở cửa sổ ra, trong phòng hơi ngột ngạt.',
        highlightWord: '把窗户打开',
      },
      {
        chinese: '我已经把所有作业都做完了。',
        pinyin: 'Wǒ yǐjīng bǎ suǒyǒu zuòyè dōu zuòwán le.',
        meaning: 'Tôi đã làm xong toàn bộ bài tập rồi.',
        highlightWord: '把所有作业都做完',
      },
      {
        chinese: '他从书包里把护照拿了出来。',
        pinyin: 'Tā cóng shūbāo lǐ bǎ hùzhào ná le chūlái.',
        meaning: 'Anh ấy từ trong balo lấy hộ chiếu ra.',
        highlightWord: '把护照拿了出来',
      },
    ],
  },
  {
    id: 'bb-3',
    pattern: 'S + 把 + O + V + 在 / 到 / 给 + Nơi chốn / Người nhận',
    type: 'ba',
    typeName: 'Câu chữ 把 dịch chuyển / chuyển giao',
    formula: 'Chủ ngữ + 把 + Tân ngữ + Động từ + (在/到/给) + Tân ngữ 2',
    meaningEffect: 'Diễn tả đặt vật ở đâu (放在), đưa vật đến đâu (送到), hoặc trao/tặng/trả vật cho ai (借给, 送给, 还给).',
    goldenRule: 'Giới từ 在/到/给 gắn liền ngay sau động từ chính.',
    examples: [
      {
        chinese: '请把你的护照放在桌子上。',
        pinyin: 'Qǐng bǎ nǐ de hùzhào fàng zài zhuōzi shàng.',
        meaning: 'Xin hãy đặt hộ chiếu của bạn ở trên bàn.',
        highlightWord: '放在桌子上',
      },
      {
        chinese: '他把那本书还给了图书馆。',
        pinyin: 'Tā bǎ nà běn shū huángěi le túshūguǎn.',
        meaning: 'Anh ấy đã trả cuốn sách đó cho thư viện rồi.',
        highlightWord: '还给了图书馆',
      },
      {
        chinese: '司机把我们送到了机场。',
        pinyin: 'Sījī bǎ wǒmen sòng dào le jīchǎng.',
        meaning: 'Tài xế đã đưa chúng tôi đến tận sân bay.',
        highlightWord: '送到了机场',
      },
    ],
  },

  // 2. BEI Sentences
  {
    id: 'bb-4',
    pattern: 'O (Chịu tác động) + 被 + S (Tác nhân) + V + Thành phần khác',
    type: 'bei',
    typeName: 'Câu chữ 被 đầy đủ',
    formula: 'Đối tượng bị tác động + 被 + Tác nhân gây ra + Động từ + (了 / Bổ ngữ)',
    meaningEffect: 'Diễn tả ý nghĩa bị động, thường mang sắc thái không may, sự việc không mong muốn hoặc chịu tổn hại.',
    goldenRule: 'Trong khẩu ngữ, "被" có thể thay thế bằng "让" hoặc "叫" (nhưng sau 让/叫 bắt buộc phải có tác nhân!).',
    examples: [
      {
        chinese: '我的雨伞被大风刮坏了。',
        pinyin: 'Wǒ de yǔsǎn bèi dàfēng guāhuài le.',
        meaning: 'Cây dù của tôi bị gió lớn thổi hỏng mất rồi.',
        highlightWord: '被大风刮坏了',
      },
      {
        chinese: '放在桌上的蛋糕被弟弟吃光了。',
        pinyin: 'Fàng zài zhuō shàng de dàngāo bèi dìdi chīguāng le.',
        meaning: 'Chiếc bánh kem để trên bàn đã bị em trai ăn sạch sành sanh.',
        highlightWord: '被弟弟吃光了',
      },
    ],
  },
  {
    id: 'bb-5',
    pattern: 'O (Chịu tác động) + 被 + V + Thành phần khác (Ẩn tác nhân)',
    type: 'bei',
    typeName: 'Câu chữ 被 ẩn tác nhân',
    formula: 'Đối tượng bị tác động + 被 + Động từ + (了 / Bổ ngữ)',
    meaningEffect: 'Dùng khi không biết tác nhân là ai, hoặc không cần thiết phải nhắc đến tác nhân gây ra.',
    goldenRule: 'Chỉ có chữ "被" mới được phép ẩn tác nhân (KHÔNG ĐƯỢC ẩn tác nhân khi dùng 让 hay 叫!).',
    examples: [
      {
        chinese: '自行车被偷了。',
        pinyin: 'Zìxíngchē bèi tōu le.',
        meaning: 'Chiếc xe đạp đã bị trộm mất rồi (không biết ai trộm).',
        highlightWord: '被偷了',
      },
      {
        chinese: '昨天的考试成绩被公布了。',
        pinyin: 'Zuótiān de kǎoshì chéngjì bèi gōngbù le.',
        meaning: 'Điểm thi của ngày hôm qua đã được công bố rồi.',
        highlightWord: '被公布了',
      },
    ],
    commonMistake: {
      wrong: '自行车让偷了。',
      right: '自行车被偷了。 HOẶC 自行车让人偷了。',
      explanation: 'Dùng "让" hoặc "叫" thì BẮT BUỘC phải có tác nhân (人), chỉ có "被" mới được đứng liền trước động từ.',
    },
  },
];

export const BABEI_QUIZ_LIST: BaBeiQuizItem[] = [
  {
    id: 'bq-1',
    question: 'Chọn vị trí ĐÚNG của phó từ phủ định "没" trong câu chữ 把:',
    sentence: 'Chọn câu viết đúng ngữ pháp:',
    pinyin: 'Xuǎn chū zhèngquè de jùzi:',
    meaning: 'Tôi chưa làm xong bài tập hôm nay.',
    options: [
      '我把今天的作业没做完。',
      '我没把今天的作业做完。',
      '我把今天的作业做没完。',
      '我把没今天的作业做完。',
    ],
    correctIndex: 1,
    explanation: 'Quy tắc vàng: Phó từ phủ định "没/没有" BẮT BUỘC ĐỨNG TRƯỚC "把" -> "我没把今天的作业做完".',
    ruleTested: 'Vị trí phủ định đứng trước 把',
  },
  {
    id: 'bq-2',
    question: 'Chọn câu ĐÚNG NHẤT về vị trí động từ năng nguyện "想" (muốn):',
    sentence: 'Chọn câu viết đúng ngữ pháp:',
    pinyin: 'Xuǎn chū zhèngquè de jùzi:',
    meaning: 'Tôi muốn mang cuốn sách này trả lại cho thư viện.',
    options: [
      '我把这本书想还给图书馆。',
      '我想把这本书还给图书馆。',
      '我把想这本书还给图书馆。',
      '我这本书想还给把图书馆。',
    ],
    correctIndex: 1,
    explanation: 'Động từ năng nguyện (想, 要, 能, 可以, 应该) BẮT BUỘC ĐỨNG TRƯỚC "把" -> "我想把这本书还给图书馆".',
    ruleTested: 'Động từ năng nguyện đứng trước 把',
  },
  {
    id: 'bq-3',
    question: 'Câu nào sau đây BỊ SAI NGỮ PHÁP do động từ đứng đơn độc?',
    sentence: 'Tìm câu sai trong các câu sau:',
    pinyin: 'Qǐng xuǎn chū cuòwù de jùzi:',
    meaning: 'Tìm câu vi phạm đại kỵ câu chữ 把.',
    options: [
      '他把那杯水喝了。',
      '请你把门打开。',
      '我把电脑关。',
      '妈妈把衣服洗干净了。',
    ],
    correctIndex: 2,
    explanation: 'Đại kỵ câu chữ 把: Động từ KHÔNG ĐƯỢC đứng trơ trọi một mình. Câu "我把电脑关" sai, phải sửa thành "我把电脑关了" hoặc "我把电脑关上".',
    ruleTested: 'Động từ không được đứng đơn độc',
  },
  {
    id: 'bq-4',
    question: 'Chuyển câu chữ 把 sau sang câu chữ 被 tương đương: "弟弟把苹果吃完了。"',
    sentence: 'Câu tương đương với: "Dìdi bǎ píngguǒ chīwán le."',
    pinyin: 'Xiàngyìng de bèi zì jù:',
    meaning: 'Quả táo đã bị em trai ăn hết rồi.',
    options: [
      '苹果被弟弟吃完了。',
      '弟弟被苹果吃完了。',
      '苹果把弟弟吃完了。',
      '被弟弟苹果吃完了。',
    ],
    correctIndex: 0,
    explanation: 'Tân ngữ sau 把 (苹果) chuyển thành chủ ngữ đứng đầu câu chữ 被 -> "苹果被弟弟吃完了".',
    ruleTested: 'Chuyển đổi 2 chiều 把 sang 被',
  },
  {
    id: 'bq-5',
    question: 'Chọn câu ĐÚNG NHẤT khi dùng câu chữ 被 ẩn tác nhân:',
    sentence: 'Xe đạp của tôi bị trộm mất rồi (không rõ ai trộm):',
    pinyin: 'Wǒ de zìxíngchē bèi tōu le.',
    meaning: 'Xe đạp bị trộm mất rồi.',
    options: [
      '我的自行车让偷了。',
      '我的自行车叫偷了。',
      '我的自行车被偷了。',
      '我的自行车给偷了。',
    ],
    correctIndex: 2,
    explanation: 'Chỉ có "被" mới được phép ẩn tác nhân đứng liền trước động từ (被偷了). "让" và "叫" bắt buộc phải có tác nhân (让人偷了).',
    ruleTested: 'Chữ 被 ẩn tác nhân',
  },
  {
    id: 'bq-6',
    question: 'Động từ nào sau đây TUYỆT ĐỐI KHÔNG ĐƯỢC DÙNG trong câu chữ 把?',
    sentence: 'Chọn động từ không thể dùng với 把:',
    pinyin: 'Nǎ ge dòngcí bù néng yòng zài bǎ zì jù lǐ:',
    meaning: 'Động từ cấm kỵ trong câu chữ 把.',
    options: ['放 (đặt)', '关 (đóng)', '认识 (quen biết)', '洗 (giặt/rửa)'],
    correctIndex: 2,
    explanation: 'Động từ nhận thức, trạng thái tâm lý như "认识, 知道, 是, 有, 喜欢" không tạo ra sự biến đổi vật lý/vị trí nên cấm dùng trong câu chữ 把.',
    ruleTested: 'Động từ tâm lý không đi với 把',
  },
  {
    id: 'bq-7',
    question: 'Điền từ thích hợp: "Xin hãy đem cuốn sách này đặt ___ trên bàn."',
    sentence: '请把这本书放___桌子上。',
    pinyin: 'Qǐng bǎ zhè běn shū fàng ___ zhuōzi shàng.',
    meaning: 'Xin hãy để cuốn sách này trên bàn.',
    options: ['在', '到', '给', '完'],
    correctIndex: 0,
    explanation: 'Công thức dịch chuyển vị trí tồn tại: "放在 + Nơi chốn" (đặt ở trên bàn).',
    ruleTested: 'Cấu trúc 把...放在...',
  },
  {
    id: 'bq-8',
    question: 'Chọn câu ĐÚNG về điều kiện tân ngữ của chữ 把:',
    sentence: 'Chọn câu đúng:',
    pinyin: 'Xuǎn chū zhèngquè de jùzi:',
    meaning: 'Anh ấy đã làm mất chiếc chìa khóa đó rồi.',
    options: [
      '他把一把钥匙弄丢了。',
      '他把那把钥匙弄丢了。',
      '他弄丢了把钥匙。',
      '把钥匙他弄丢了。',
    ],
    correctIndex: 1,
    explanation: 'Tân ngữ sau 把 phải là đối tượng xác định (đã biết cụ thể -> "那把钥匙"). Không dùng số từ phiếm định "一把钥匙".',
    ruleTested: 'Tân ngữ của 把 phải xác định',
  },
  {
    id: 'bq-9',
    question: 'Điền vào chỗ trống: "Vui lòng đem bài tập giao ___ cho thầy giáo."',
    sentence: '请大家把作业交___王老师。',
    pinyin: 'Qǐng dàjiā bǎ zuòyè jiāo ___ Wáng lǎoshī.',
    meaning: 'Xin mọi người nộp bài tập cho thầy Vương.',
    options: ['给', '在', '到', '成'],
    correctIndex: 0,
    explanation: 'Công thức chuyển giao cho đối tượng tiếp nhận: "交给 + Người nhận" (nộp cho thầy).',
    ruleTested: 'Cấu trúc 把...交给...',
  },
  {
    id: 'bq-10',
    question: 'Chuyển câu chữ 被 sau sang câu chữ 把: "那个杯子被小明打碎了。"',
    sentence: 'Câu tương đương của "Nàge bēizi bèi Xiǎomíng dǎsuì le."',
    pinyin: 'Xiàngyìng de bǎ zì jù:',
    meaning: 'Tiểu Minh đã đánh vỡ chiếc cốc đó rồi.',
    options: [
      '小明把那个杯子打碎了。',
      '那个杯子把小明打碎了。',
      '小明打碎了被那个杯子。',
      '被小明把那个杯子打碎了。',
    ],
    correctIndex: 0,
    explanation: 'Tác nhân gây ra (小明) chuyển thành chủ ngữ câu 把; Đối tượng chịu tác động (那个杯子) chuyển thành tân ngữ sau 把 -> "小明把那个杯子打碎了".',
    ruleTested: 'Chuyển đổi 2 chiều 被 sang 把',
  },
];
