export interface InterrogativePronoun {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  targetType: 'thing' | 'person' | 'location' | 'reason' | 'manner' | 'quality' | 'quantity' | 'time';
  targetLabel: string;
  icon: string;
  ruleTip: string;
  combinations: string[];
  example: {
    question: string;
    pinyin: string;
    vietnamese: string;
    answer: string;
    answerPinyin: string;
    answerVietnamese: string;
  };
}

export interface QuestionPattern {
  id: string;
  title: string;
  category: 'special' | 'particle' | 'affirm_neg' | 'choice';
  categoryLabel: string;
  formula: string;
  explanation: string;
  goldenRule: string;
  examples: {
    qChinese: string;
    qPinyin: string;
    qVietnamese: string;
    aChinese: string;
    aPinyin: string;
    aVietnamese: string;
  }[];
}

export interface QuestionMistakeRule {
  id: string;
  title: string;
  ruleDescription: string;
  whyWrong: string;
  wrongExample: string;
  correctExample: string;
  pinyin: string;
  vietnamese: string;
}

export interface QuestionQuizQuestion {
  id: string;
  prompt: string;
  sentence: string;
  pinyin: string;
  vietnamese: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'pronoun' | 'pattern' | 'trap';
}

export const INTERROGATIVE_PRONOUNS: InterrogativePronoun[] = [
  {
    id: 'shenme',
    hanzi: '什么',
    pinyin: 'shénme',
    meaning: 'Cái gì, gì',
    targetType: 'thing',
    targetLabel: 'Hỏi sự vật / đồ vật',
    icon: '❓',
    ruleTip: 'Có thể đứng độc lập làm tân ngữ (你想吃什么？) hoặc làm định ngữ đứng trước danh từ (什么书, 什么名字, 什么时候 - khi nào).',
    combinations: ['什么时候 (Khi nào)', '什么人 (Người nào)', '为什么 (Tại sao)'],
    example: {
      question: '你叫什么名字？',
      pinyin: 'Nǐ jiào shénme míngzi?',
      vietnamese: 'Bạn tên là gì?',
      answer: '我叫李明。',
      answerPinyin: 'Wǒ jiào Lǐ Míng.',
      answerVietnamese: 'Tôi tên là Lý Minh.'
    }
  },
  {
    id: 'shei',
    hanzi: '谁',
    pinyin: 'shéi / shuí',
    meaning: 'Ai',
    targetType: 'person',
    targetLabel: 'Hỏi người / nhân vật',
    icon: '👤',
    ruleTip: 'Có thể làm chủ ngữ (谁是王老师？), tân ngữ (你找谁？), hoặc định ngữ biểu thị sở hữu kèm 的 (这是谁的书？).',
    combinations: ['谁的 (Của ai)', '谁去 (Ai đi)'],
    example: {
      question: '那位穿白衣服的人是谁？',
      pinyin: 'Nà wèi chuān bái yīfu de rén shì shéi?',
      vietnamese: 'Người mặc áo trắng kia là ai vậy?',
      answer: '他是我们班的新汉语老师。',
      answerPinyin: 'Tā shì wǒmen bān de xīn hànyǔ lǎoshī.',
      answerVietnamese: 'Thầy ấy là giáo viên tiếng Trung mới của lớp chúng tôi.'
    }
  },
  {
    id: 'na_nar',
    hanzi: '哪儿 / 哪里',
    pinyin: 'nǎr / nǎli',
    meaning: 'Ở đâu, chỗ nào',
    targetType: 'location',
    targetLabel: 'Hỏi nơi chốn / địa điểm',
    icon: '📍',
    ruleTip: 'Thường đi kèm giới từ 在 (在哪里/在哪儿), 去 (去哪儿), 到 (到哪儿去). Phân biệt: 哪儿 (ở đâu) vs 那儿 (chỗ kia - thanh 4).',
    combinations: ['在哪儿 (Ở đâu)', '去哪儿 (Đi đâu)', '从哪儿来 (Từ đâu đến)'],
    example: {
      question: '请问，洗手间在哪儿？',
      pinyin: 'Qǐngwèn, xǐshǒujiān zài nǎr?',
      vietnamese: 'Xin hỏi, nhà vệ sinh ở đâu?',
      answer: '就在前边右转，图书馆旁边。',
      answerPinyin: 'Jiù zài qiánbian yòuzhuǎn, túshūguǎn pángbiān.',
      answerVietnamese: 'Ở ngay phía trước rẽ phải, bên cạnh thư viện.'
    }
  },
  {
    id: 'nage',
    hanzi: '哪 / 哪个',
    pinyin: 'nǎ / nǎge',
    meaning: 'Nào, cái nào',
    targetType: 'thing',
    targetLabel: 'Hỏi lựa chọn trong phạm vi',
    icon: '🎯',
    ruleTip: 'Sau 哪 bắt buộc phải có lượng từ hoặc danh từ chỉ đơn vị (哪个, 哪本书, 哪国人 - người nước nào).',
    combinations: ['哪个 (Cái nào)', '哪国人 (Người nước nào)', '哪本书 (Quyển sách nào)'],
    example: {
      question: '你是哪国人？',
      pinyin: 'Nǐ shì nǎ guó rén?',
      vietnamese: 'Bạn là người nước nào?',
      answer: '我是越南人。',
      answerPinyin: 'Wǒ shì Yuènánrén.',
      answerVietnamese: 'Tôi là người Việt Nam.'
    }
  },
  {
    id: 'zenme',
    hanzi: '怎么',
    pinyin: 'zěnme',
    meaning: 'Như thế nào (hỏi cách thức/lý do bất ngờ)',
    targetType: 'manner',
    targetLabel: 'Hỏi cách thức hành động',
    icon: '🛠️',
    ruleTip: 'Đứng trước ĐỘNG TỪ: 怎么 + Động từ (hỏi cách làm: 怎么读 - đọc thế nào, 怎么去 - đi bằng gì, 怎么写 - viết thế nào). Còn dùng hỏi nguyên nhân ngạc nhiên: 你怎么才来？ (Sao bây giờ bạn mới đến?).',
    combinations: ['怎么去 (Đi như thế nào)', '怎么读 (Đọc thế nào)', '怎么做 (Làm thế nào)'],
    example: {
      question: '这个汉字怎么读？',
      pinyin: 'Zhè ge hànzì zěnme dú?',
      vietnamese: 'Chữ Hán này đọc như thế nào?',
      answer: '这个字读“明”，意思是明亮。',
      answerPinyin: 'Zhè ge zì dú "míng", yìsi shì míngliàng.',
      answerVietnamese: 'Chữ này đọc là "míng", nghĩa là sáng sủa.'
    }
  },
  {
    id: 'zenmeyang',
    hanzi: '怎么样',
    pinyin: 'zěnmeyàng',
    meaning: 'Như thế nào, ra sao (hỏi tính chất, tình hình hoặc trưng cầu ý kiến)',
    targetType: 'quality',
    targetLabel: 'Hỏi tính chất / trưng cầu ý kiến',
    icon: '📊',
    ruleTip: 'Thường đứng CUỐI CÂU: Chủ ngữ + 怎么样？ (Hỏi tình hình: 今天天气怎么样？, Sức khỏe ra sao: 身体怎么样？). Hoặc dùng rủ rê, hỏi ý kiến: 我们去喝奶茶，怎么样？',
    combinations: ['身体怎么样 (Sức khỏe thế nào)', '天气怎么样 (Thời tiết ra sao)', '你看怎么样 (Bạn thấy thế nào)'],
    example: {
      question: '今天北京的天气怎么样？',
      pinyin: 'Jīntiān Běijīng de tiānqì zěnmeyàng?',
      vietnamese: 'Thời tiết Bắc Kinh hôm nay thế nào?',
      answer: '今天很暖和，不冷也不热。',
      answerPinyin: 'Jīntiān hěn nuǎnhuo, bù lěng yě bú rè.',
      answerVietnamese: 'Hôm nay rất ấm áp, không lạnh cũng không nóng.'
    }
  },
  {
    id: 'ji',
    hanzi: '几',
    pinyin: 'jǐ',
    meaning: 'Mấy (số lượng nhỏ < 10 hoặc đơn vị thời gian)',
    targetType: 'quantity',
    targetLabel: 'Hỏi số lượng nhỏ (< 10)',
    icon: '🔢',
    ruleTip: 'BẮT BUỘC có lượng từ đứng sau (几本书, 几个苹果). Dùng hỏi giờ giấc (几点), ngày tháng (几月几号), tuổi trẻ nhỏ (几岁).',
    combinations: ['几点 (Mấy giờ)', '几月几号 (Ngày mấy tháng mấy)', '几岁 (Mấy tuổi)'],
    example: {
      question: '现在几点了几分？',
      pinyin: 'Xiànzài jǐ diǎn le jǐ fēn?',
      vietnamese: 'Bây giờ là mấy giờ mấy phút rồi?',
      answer: '现在上午十点一刻。',
      answerPinyin: 'Xiànzài shàngwǔ shí diǎn yí kè.',
      answerVietnamese: 'Bây giờ là 10 giờ 15 phút sáng.'
    }
  },
  {
    id: 'duoshao',
    hanzi: '多少',
    pinyin: 'duōshao',
    meaning: 'Bao nhiêu (số lượng bất kỳ hoặc lớn > 10)',
    targetType: 'quantity',
    targetLabel: 'Hỏi số lượng lớn (> 10)',
    icon: '💰',
    ruleTip: 'Có thể trực tiếp đi với danh từ mà KHÔNG CẦN lượng từ (多少人, 多少钱). Dùng đặc biệt khi hỏi giá cả, số điện thoại.',
    combinations: ['多少钱 (Bao nhiêu tiền)', '多少人 (Bao nhiêu người)', '电话号码是多少 (Số điện thoại là gì)'],
    example: {
      question: '这件红色的衣服多少钱？',
      pinyin: 'Zhè jiàn hóngsè de yīfu duōshao qián?',
      vietnamese: 'Bộ quần áo màu đỏ này bao nhiêu tiền?',
      answer: '一共一百五十块钱。',
      answerPinyin: 'Yígòng yìbǎi wǔshí kuài qián.',
      answerVietnamese: 'Tổng cộng một trăm năm mươi tệ.'
    }
  },
  {
    id: 'weishenme',
    hanzi: '为什么',
    pinyin: 'wèishénme',
    meaning: 'Tại sao, vì sao',
    targetType: 'reason',
    targetLabel: 'Hỏi nguyên nhân / lý do',
    icon: '💡',
    ruleTip: 'Đứng trước chủ ngữ hoặc trước vị ngữ (你为什么不吃？ / 为什么你迟到了？). Câu trả lời thường mở đầu bằng 因为 (yīnwèi - bởi vì).',
    combinations: ['为什么不 (Tại sao không)', '因为 (Bởi vì...)'],
    example: {
      question: '你为什么喜欢学中文？',
      pinyin: 'Nǐ wèishénme xǐhuan xué zhōngwén?',
      vietnamese: 'Tại sao bạn thích học tiếng Trung?',
      answer: '因为我想去中国旅游和工作。',
      answerPinyin: 'Yīnwèi wǒ xiǎng qù Zhōngguó lǚyóu hé gōngzuò.',
      answerVietnamese: 'Bởi vì tôi muốn đi du lịch và làm việc ở Trung Quốc.'
    }
  },
  {
    id: 'duo_adj',
    hanzi: '多 + Tính từ',
    pinyin: 'duō + Adj',
    meaning: 'Bao nhiêu... (Độ tuổi, khoảng cách, chiều cao, thời gian)',
    targetType: 'quantity',
    targetLabel: 'Hỏi mức độ kích thước/tuổi tác',
    icon: '📏',
    ruleTip: 'Cấu trúc cố định: 多大 (Bao nhiêu tuổi - người lớn), 多高 (Cao bao nhiêu), 多重 (Nặng bao nhiêu), 多远 (Xa bao nhiêu), 多久 (Bao lâu).',
    combinations: ['多大 (Bao nhiêu tuổi)', '多高 (Cao bao nhiêu)', '多久 (Bao lâu)'],
    example: {
      question: '请问王经理今年多大？',
      pinyin: 'Qǐngwèn Wáng jīnglǐ jīnnián duō dà?',
      vietnamese: 'Xin hỏi Giám đốc Vương năm nay bao nhiêu tuổi?',
      answer: '他今年三十五岁。',
      answerPinyin: 'Tā jīnnián sānshíwǔ suì.',
      answerVietnamese: 'Năm nay anh ấy ba mươi lăm tuổi.'
    }
  }
];

export const QUESTION_PATTERNS: QuestionPattern[] = [
  {
    id: 'pat_special',
    title: '1. Câu Hỏi Đặc Vấn (Dùng Đại Từ Nghi Vấn)',
    category: 'special',
    categoryLabel: 'Đặc Vấn',
    formula: 'Giữ nguyên trật tự câu trần thuật, thành phần cần hỏi ở đâu thì đặt đại từ nghi vấn (什么, 谁, 哪儿...) vào đúng vị trí đó!',
    explanation: 'Tiếng Trung KHÔNG có hiện tượng đảo trợ động từ lên đầu câu như tiếng Anh (Are you, Do you). Quy tắc vàng: Bạn muốn hỏi thành phần nào trong câu, chỉ cần thay đại từ nghi vấn vào đúng vị trí đó.',
    goldenRule: 'CẤM thêm trợ từ 吗 ở cuối câu hỏi đặc vấn!',
    examples: [
      {
        qChinese: '你在做什么呢？',
        qPinyin: 'Nǐ zài zuò shénme ne?',
        qVietnamese: 'Bạn đang làm cái gì thế?',
        aChinese: '我正在看书。',
        aPinyin: 'Wǒ zhèngzài kàn shū.',
        aVietnamese: 'Tôi đang đọc sách.'
      },
      {
        qChinese: '谁给你打电话？',
        qPinyin: 'Shéi gěi nǐ dǎ diànhuà?',
        qVietnamese: 'Ai gọi điện thoại cho bạn vậy?',
        aChinese: '我妈妈给我打电话。',
        aPinyin: 'Wǒ māma gěi wǒ dǎ diànhuà.',
        aVietnamese: 'Mẹ tôi gọi điện thoại cho tôi.'
      }
    ]
  },
  {
    id: 'pat_particle',
    title: '2. Câu Hỏi Ngữ Khí Cuối Câu (吗 / 呢 / 吧)',
    category: 'particle',
    categoryLabel: 'Ngữ Khí (吗/呢/吧)',
    formula: 'Câu trần thuật + 吗？ (Hỏi Có/Không) | Danh từ + 呢？ (Hỏi vắn tắt/ở đâu) | Câu phỏng đoán + 吧？ (Hỏi xác nhận)',
    explanation: '1) "吗": Biến câu trần thuật thành câu hỏi Yes/No; 2) "呢": Hỏi vắn tắt (Còn... thì sao?) hoặc tìm đồ vật/người (S + 呢: ...ở đâu?); 3) "吧": Đã đoán được 80% câu trả lời, hỏi để người nghe xác nhận lại.',
    goldenRule: 'Phân biệt rõ: 吗 (chưa biết gì, hỏi thật) vs 吧 (đã đoán chắc, hỏi xác nhận).',
    examples: [
      {
        qChinese: '你会说汉语吗？',
        qPinyin: 'Nǐ huì shuō hànyǔ ma?',
        qVietnamese: 'Bạn biết nói tiếng Trung không?',
        aChinese: '我会说一点儿。',
        aPinyin: 'Wǒ huì shuō yìdiǎnr.',
        aVietnamese: 'Tôi biết nói một chút.'
      },
      {
        qChinese: '我的手机呢？',
        qPinyin: 'Wǒ de shǒujī ne?',
        qVietnamese: 'Điện thoại của tôi đâu rồi nhỉ?',
        aChinese: '在桌子上面呢。',
        aPinyin: 'Zài zhuōzi shàngmian ne.',
        aVietnamese: 'Ở trên bàn kìa.'
      },
      {
        qChinese: '你就是张老师吧？',
        qPinyin: 'Nǐ jiù shì Zhāng lǎoshī ba?',
        qVietnamese: 'Bạn chính là thầy Trương đúng không?',
        aChinese: '对，我就是张华。',
        aPinyin: 'Duì, wǒ jiù shì Zhāng Huá.',
        aVietnamese: 'Đúng vậy, tôi chính là Trương Hoa.'
      }
    ]
  },
  {
    id: 'pat_affirm_neg',
    title: '3. Câu Hỏi Chính - Phản (V + 不/没 + V)',
    category: 'affirm_neg',
    categoryLabel: 'Chính - Phản',
    formula: 'Động từ 1 âm tiết: V + 不/没 + V？ | Tính từ: Adj + 不 + Adj？ | Động từ 2 âm tiết AB: A + 不 + AB？',
    explanation: 'Ghép dạng khẳng định và phủ định liền nhau để tạo câu hỏi nghi vấn trực diện. Hành động chưa xảy ra hoặc thường xuyên dùng "不", hành động đã xảy ra trong quá khứ dùng "没".',
    goldenRule: 'Tuyệt đối KHÔNG thêm 吗 ở cuối câu hỏi Chính - Phản!',
    examples: [
      {
        qChinese: '你今天去不去学校？',
        qPinyin: 'Nǐ jīntiān qù bu qù xuéxiào?',
        qVietnamese: 'Hôm nay bạn có đi trường học không?',
        aChinese: '我去学校。/ 我不去。',
        aPinyin: 'Wǒ qù xuéxiào. / Wǒ bú qù.',
        aVietnamese: 'Tôi đi. / Tôi không đi.'
      },
      {
        qChinese: '你喜不喜欢中国菜？ (A+不+AB)',
        qPinyin: 'Nǐ xǐ bu xǐhuan zhōngguó cài?',
        qVietnamese: 'Bạn có thích món ăn Trung Quốc không?',
        aChinese: '我非常喜欢。',
        aPinyin: 'Wǒ fēicháng xǐhuan.',
        aVietnamese: 'Tôi rất thích.'
      },
      {
        qChinese: '昨天晚上的电影你看没看？',
        qPinyin: 'Zuótiān wǎnshang de diànyǐng nǐ kàn mei kàn?',
        qVietnamese: 'Bộ phim tối hôm qua bạn đã xem chưa?',
        aChinese: '我看了，很好看。',
        aPinyin: 'Wǒ kàn le, hěn hǎokàn.',
        aVietnamese: 'Tôi xem rồi, rất hay.'
      }
    ]
  },
  {
    id: 'pat_choice',
    title: '4. Câu Hỏi Lựa Chọn (A + 还是 + B)',
    category: 'choice',
    categoryLabel: 'Lựa Chọn (还是)',
    formula: 'Chủ ngữ + Vị ngữ + A + 还是 + B？',
    explanation: 'Đưa ra hai hay nhiều phương án để người nghe lựa chọn một trong số đó. Trong câu hỏi lựa chọn, liên từ "hoặc/hay là" BẮT BUỘC dùng 还是 (háishi), tuyệt đối không dùng 或者 (huòzhě - chỉ dùng cho câu khẳng định).',
    goldenRule: 'Câu hỏi dùng 还是, câu khẳng định dùng 或者.',
    examples: [
      {
        qChinese: '你想喝茶还是喝咖啡？',
        qPinyin: 'Nǐ xiǎng hē chá háishi hē kāfēi?',
        qVietnamese: 'Bạn muốn uống trà hay uống cà phê?',
        aChinese: '我想喝一杯热茶。',
        aPinyin: 'Wǒ xiǎng hē yì bēi rè chá.',
        aVietnamese: 'Tôi muốn uống một tách trà nóng.'
      },
      {
        qChinese: '我们坐出租车去还是坐地铁去？',
        qPinyin: 'Wǒmen zuò chūzūchē qù háishi zuò dìtiě qù?',
        qVietnamese: 'Chúng ta đi taxi hay đi tàu điện ngầm?',
        aChinese: '坐地铁更快，我们坐地铁吧。',
        aPinyin: 'Zuò dìtiě gèng kuài, wǒmen zuò dìtiě ba.',
        aVietnamese: 'Đi tàu điện ngầm nhanh hơn, chúng ta đi tàu điện ngầm đi.'
      }
    ]
  }
];

export const QUESTION_MISTAKE_RULES: QuestionMistakeRule[] = [
  {
    id: 'rule_1',
    title: 'Đại Kỵ 1: CẤM dùng trợ từ "吗" trong câu có Đại từ nghi vấn',
    ruleDescription: 'Khi trong câu đã có đại từ nghi vấn (什么, 谁, 哪儿, 怎么, 为什么, 几, 多少...), bản thân câu đó ĐÃ LÀ câu hỏi rồi. Tuyệt đối không thêm "吗" vào cuối câu!',
    whyWrong: 'Thêm "吗" gây hiện tượng trùng lặp chức năng hỏi, tạo ra câu hỏi vô nghĩa hoặc tối nghĩa.',
    wrongExample: '你是谁吗？ / 他买什么吗？ (Sai nghiêm trọng)',
    correctExample: '你是谁？ / 他买什么？ (Đúng)',
    pinyin: 'Nǐ shì shéi? / Tā mǎi shénme?',
    vietnamese: 'Bạn là ai? / Anh ấy mua cái gì?'
  },
  {
    id: 'rule_2',
    title: 'Đại Kỵ 2: CẤM dùng "或者" trong câu hỏi lựa chọn (Bắt buộc dùng 还是)',
    ruleDescription: 'Cả 还是 và 或者 đều dịch là "hoặc, hay là", nhưng phạm vi sử dụng hoàn toàn tách biệt: 还是 dùng độc quyền trong CÂU HỎI; 或者 chỉ dùng trong CÂU KHẲNG ĐỊNH.',
    whyWrong: 'Nhầm lẫn hai từ nối này là lỗi sai phổ biến nhất của người Việt học tiếng Trung.',
    wrongExample: '你想吃米饭或者面条？ (Sai trong câu hỏi)',
    correctExample: '你想吃米饭还是面条？ (Đúng chuẩn)',
    pinyin: 'Nǐ xiǎng chī mǐfàn háishi miàntiáo?',
    vietnamese: 'Bạn muốn ăn cơm hay ăn mì sợi?'
  },
  {
    id: 'rule_3',
    title: 'Đại Kỵ 3: CẤM dùng "吗" ở cuối câu hỏi Chính - Phản (V + 不 + V)',
    ruleDescription: 'Câu hỏi chính phản (như 去不去, 好不好, 是不是) đã tự thân mang nghĩa nghi vấn lựa chọn giữa Có và Không, tuyệt đối không đặt thêm trợ từ "吗" ở cuối câu.',
    whyWrong: 'Thêm "吗" tạo thành lỗi ngữ pháp đa trùng nghi vấn bị trừ điểm tuyệt đối trong bài thi HSK.',
    wrongExample: '你明天去不去学校吗？ (Sai)',
    correctExample: '你明天去不去学校？ (Đúng)',
    pinyin: 'Nǐ míngtiān qù bu qù xuéxiào?',
    vietnamese: 'Ngày mai bạn có đi trường học không?'
  },
  {
    id: 'rule_4',
    title: 'Đại Kỵ 4: Nhầm lẫn giữa "几" và "多少" khi hỏi số lượng',
    ruleDescription: '1) "几": Chỉ dùng khi dự đoán số lượng nhỏ dưới 10 và BẮT BUỘC phải kèm lượng từ (几个人, 几本书); 2) "多少": Dùng cho số lượng lớn hoặc không giới hạn, có thể đi kèm hoặc KHÔNG cần lượng từ (多少人, 多少钱).',
    whyWrong: 'Dùng sai từ để hỏi số lượng gây mất tự nhiên và sai lệch ngữ cảm bản xứ.',
    wrongExample: '你买几钱？ / 你们学校有几学生？ (Sai ngữ pháp)',
    correctExample: '这个多少钱？ / 你们学校有多少学生？ (Đúng chuẩn)',
    pinyin: 'Zhège duōshao qián? / Nǐmen xuéxiào yǒu duōshao xuésheng?',
    vietnamese: 'Cái này bao nhiêu tiền? / Trường của các bạn có bao nhiêu học sinh?'
  }
];

export const QUESTION_QUIZ_QUESTIONS: QuestionQuizQuestion[] = [
  {
    id: 'qq_1',
    prompt: 'Chọn câu hỏi ĐÚNG ngữ pháp (Tránh bẫy trợ từ 吗):',
    sentence: 'Bạn đang tìm ai thế?',
    pinyin: 'Nǐ zài zhǎo shéi?',
    vietnamese: 'Bạn đang tìm ai thế?',
    options: [
      '你在找谁吗？',
      '你在找谁？',
      '谁在找你吗？',
      '你在谁找？'
    ],
    correctIndex: 1,
    explanation: 'Câu đã có đại từ nghi vấn "谁" (ai) thì tuyệt đối KHÔNG thêm trợ từ "吗" ở cuối câu.',
    category: 'trap'
  },
  {
    id: 'qq_2',
    prompt: 'Điền liên từ thích hợp: "今天下午我们去看电影______去图书馆？"',
    sentence: 'Jīntiān xiàwǔ wǒmen qù kàn diànyǐng ______ qù túshūguǎn?',
    pinyin: 'Jīntiān xiàwǔ wǒmen qù kàn diànyǐng ______ qù túshūguǎn?',
    vietnamese: 'Chiều hôm nay chúng mình đi xem phim hay là đi thư viện?',
    options: [
      '或者 (hoặc - câu khẳng định)',
      '还是 (hay là - câu hỏi)',
      '但是 (nhưng)',
      '所以 (cho nên)'
    ],
    correctIndex: 1,
    explanation: 'Đây là câu hỏi lựa chọn giữa hai hành động (xem phim hay đi thư viện), bắt buộc phải dùng "还是 (háishi)". Tuyệt đối không dùng "或者" trong câu nghi vấn.',
    category: 'pattern'
  },
  {
    id: 'qq_3',
    prompt: 'Hỏi tuổi của một cụ ông lớn tuổi hoặc sếp, cách nói nào LỊCH SỰ và CHUẨN XÁC nhất?',
    sentence: 'Xin hỏi cụ/ngài năm nay bao nhiêu tuổi rồi ạ?',
    pinyin: 'Qǐngwèn nín jīnnián...',
    vietnamese: 'Xin hỏi cụ/ngài năm nay bao nhiêu tuổi rồi ạ?',
    options: [
      '您今年几岁了？',
      '您今年多大了？ / 您今年高寿？',
      '您今年多少岁？',
      '您今年怎么大？'
    ],
    correctIndex: 1,
    explanation: '"几岁" chỉ dùng hỏi trẻ con dưới 10 tuổi. Với người lớn/người cao tuổi, dùng "多大" hoặc trang trọng hơn là "高寿 (gāoshòu)".',
    category: 'pronoun'
  },
  {
    id: 'qq_4',
    prompt: 'Chọn câu hỏi Chính - Phản viết ĐÚNG chuẩn ngữ pháp:',
    sentence: 'Bạn có biết thầy Vương không?',
    pinyin: 'Nǐ rènshi bu rènshi Wáng lǎoshī?',
    vietnamese: 'Bạn có biết thầy Vương không?',
    options: [
      '你认识不认识王老师吗？',
      '你认不认识王老师？',
      '你认识不王老师？',
      '你认识王老师不认识？'
    ],
    correctIndex: 1,
    explanation: 'Đối với động từ 2 âm tiết AB (认识), dạng chính phản chuẩn là A + 不 + AB (认不认识) và tuyệt đối KHÔNG có "吗" ở cuối câu.',
    category: 'pattern'
  },
  {
    id: 'qq_5',
    prompt: 'Điền từ để hỏi thích hợp: "请问，去火车站______走？"',
    sentence: 'Qǐngwèn, qù huǒchēzhàn ______ zǒu?',
    pinyin: 'Qǐngwèn, qù huǒchēzhàn ______ zǒu?',
    vietnamese: 'Xin hỏi, đi đến ga xe lửa thì đi như thế nào?',
    options: [
      '怎么',
      '怎么样',
      '什么',
      '哪儿'
    ],
    correctIndex: 0,
    explanation: 'Hỏi cách thức thực hiện hành động: 怎么 + Động từ ➔ "怎么走" (đi thế nào, đi theo đường nào). "怎么样" thường đứng cuối câu hỏi tính chất/tình hình.',
    category: 'pronoun'
  },
  {
    id: 'qq_6',
    prompt: 'Điền từ để hỏi thích hợp: "今天晚上我们一起去吃火锅，______？"',
    sentence: 'Jīntiān wǎnshang wǒmen yìqǐ qù chī huǒguō, ______?',
    pinyin: 'Jīntiān wǎnshang wǒmen yìqǐ qù chī huǒguō, ______?',
    vietnamese: 'Tối nay chúng mình cùng nhau đi ăn lẩu, thấy thế nào / được không?',
    options: [
      '怎么',
      '怎么样',
      '为什么',
      '哪个'
    ],
    correctIndex: 1,
    explanation: 'Đứng cuối câu để hỏi ý kiến, rủ rê, trưng cầu đề xuất người nghe ➔ Dùng "怎么样 (zěnmeyàng)".',
    category: 'pronoun'
  },
  {
    id: 'qq_7',
    prompt: 'Điền từ hỏi số lượng: "今天是你儿子______岁生日？"',
    sentence: 'Jīntiān shì nǐ érzi ______ suì shēngrì?',
    pinyin: 'Jīntiān shì nǐ érzi ______ suì shēngrì?',
    vietnamese: 'Hôm nay là sinh nhật mấy tuổi của con trai bạn?',
    options: [
      '多少',
      '几',
      '多',
      '什么'
    ],
    correctIndex: 1,
    explanation: 'Hỏi tuổi của con nhỏ và phía sau có đơn vị danh từ/lượng từ "岁" ➔ Dùng "几 (jǐ)".',
    category: 'pronoun'
  },
  {
    id: 'qq_8',
    prompt: 'Phân biệt sắc thái: Câu "你也是留学生吧？" khác câu "你也是留学生吗？" ở điểm nào?',
    sentence: 'Sắc thái giữa 吧 và 吗:',
    pinyin: 'Bǎ hé ma de qūbié:',
    vietnamese: 'Sắc thái giữa 吧 và 吗:',
    options: [
      'Không có khác biệt nào, thay thế nhau thoải mái',
      'Câu dùng "吧" thể hiện người nói đã đoán chắc được phần lớn và hỏi để xác nhận lại; câu dùng "吗" là chưa biết',
      'Câu dùng "吧" là câu khẳng định, không phải câu hỏi',
      'Câu dùng "吗" chỉ dùng cho người thân thiết'
    ],
    correctIndex: 1,
    explanation: 'Trợ từ "吧" dùng trong câu hỏi phỏng đoán (đã nắm chắc 80%, hỏi để xác thực); còn "吗" dùng hỏi thuần túy khi chưa biết thông tin.',
    category: 'pattern'
  },
  {
    id: 'qq_9',
    prompt: 'Điền từ thích hợp vào câu tìm đồ: "奇怪，我的护照______？"',
    sentence: 'Qíguài, wǒ de hùzhào ______?',
    pinyin: 'Qíguài, wǒ de hùzhào ______?',
    vietnamese: 'Kỳ lạ thật, hộ chiếu của tôi đâu rồi nhỉ?',
    options: [
      '呢',
      '吗',
      '吧',
      '了'
    ],
    correctIndex: 0,
    explanation: 'Cấu trúc "Danh từ + 呢？" dùng để hỏi tìm đồ vật hoặc người đang ở đâu khi đột nhiên không thấy (tương đương 在哪儿).',
    category: 'pattern'
  },
  {
    id: 'qq_10',
    prompt: 'Chọn câu hỏi có trật tự từ ĐÚNG chuẩn tiếng Trung:',
    sentence: 'Ngày mai bạn đi Bắc Kinh bằng phương tiện gì?',
    pinyin: 'Nǐ míngtiān zěnme qù Běijīng?',
    vietnamese: 'Ngày mai bạn đi Bắc Kinh bằng phương tiện gì?',
    options: [
      '怎么你明天去北京？',
      '你明天怎么去北京？',
      '你明天去北京怎么？',
      '你明天去怎么北京？'
    ],
    correctIndex: 1,
    explanation: 'Trật tự câu hỏi tiếng Trung tuân thủ: Chủ ngữ (你) + Thời gian (明天) + Từ để hỏi phương thức (怎么) + Động từ/Vị ngữ (去北京). Không đảo từ để hỏi ra trước chủ ngữ hay cuối câu.',
    category: 'trap'
  }
];
