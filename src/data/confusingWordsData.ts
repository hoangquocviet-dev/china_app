export interface ConfusingWordItem {
  hanzi: string;
  pinyin: string;
  meaning: string;
  usageRule: string;
}

export interface ExampleComparison {
  correct: {
    hanzi: string;
    pinyin: string;
    meaning: string;
  };
  wrong: {
    hanzi: string;
    explanation: string;
  };
}

export interface ConfusingPair {
  id: string;
  title: string;
  level: 'HSK 1' | 'HSK 2';
  category: 'number_amount' | 'verb_action' | 'adverb_particle' | 'noun_time';
  categoryName: string;
  wordA: ConfusingWordItem;
  wordB: ConfusingWordItem;
  wordC?: ConfusingWordItem;
  coreDifference: string;
  goldenRule: string;
  examples: ExampleComparison[];
  quizPrompt: {
    sentence: string;
    blankSentence: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
}

export const CONFUSING_PAIRS: ConfusingPair[] = [
  {
    id: 'er_vs_liang',
    title: '二 (èr) vs 两 (liǎng)',
    level: 'HSK 1',
    category: 'number_amount',
    categoryName: 'Số từ & Lượng từ',
    wordA: {
      hanzi: '二',
      pinyin: 'èr',
      meaning: 'Số 2 (đếm số, số thứ tự, số nhà, số điện thoại)',
      usageRule: 'Dùng khi đếm số thuần túy (一, 二, 三...), số thứ tự (第二), số điện thoại, số tầng/phòng, phân số/thập phân.',
    },
    wordB: {
      hanzi: '两',
      pinyin: 'liǎng',
      meaning: 'Hai / đôi (chỉ số lượng đứng TRƯỚC LƯỢNG TỪ)',
      usageRule: 'Bắt buộc dùng khi đứng trước LƯỢNG TỪ (两本书, 两个人, 两个月) hoặc đơn vị đo lường truyền thống.',
    },
    coreDifference: '二 đếm số thứ tự, 两 biểu thị số lượng trước lượng từ.',
    goldenRule: 'Quy tắc vàng: Cứ thấy phía sau có LƯỢNG TỪ (个, 本, 块, 只...) thì 99% dùng 两, không dùng 二.',
    examples: [
      {
        correct: {
          hanzi: '我买了两本书。',
          pinyin: 'wǒ mǎi le liǎng běn shū 。',
          meaning: 'Tôi đã mua hai quyển sách.',
        },
        wrong: {
          hanzi: '我买了二本书。',
          explanation: 'Sai vì 本 là lượng từ, bắt buộc dùng 两.',
        },
      },
      {
        correct: {
          hanzi: '我的房间在二楼。',
          pinyin: 'wǒ de fáng jiān zài èr lóu 。',
          meaning: 'Phòng của tôi ở tầng hai.',
        },
        wrong: {
          hanzi: '我的房间在两楼。',
          explanation: 'Sai vì tầng hai là số thứ tự, phải dùng 二.',
        },
      },
    ],
    quizPrompt: {
      sentence: '我有两个中国朋友。',
      blankSentence: '我有 ___ 个中国朋友。',
      options: ['二', '两'],
      correctAnswer: '两',
      explanation: 'Phía sau có lượng từ 个, bắt buộc dùng 两.',
    },
  },
  {
    id: 'renshi_vs_zhidao',
    title: '认识 (rènshi) vs 知道 (zhīdào)',
    level: 'HSK 1',
    category: 'verb_action',
    categoryName: 'Động từ nhận thức',
    wordA: {
      hanzi: '认识',
      pinyin: 'rèn shi',
      meaning: 'Quen biết (người), nhận biết mặt chữ/đường sá',
      usageRule: 'Dùng khi quen biết một người (có tương tác, gặp gỡ), hoặc nhận diện được mặt chữ Hán, nhận ra con đường.',
    },
    wordB: {
      hanzi: '知道',
      pinyin: 'zhī dào',
      meaning: 'Biết (thông tin, sự thật, tin tức, nội dung)',
      usageRule: 'Dùng khi biết một tin tức, thông tin, số điện thoại, địa chỉ hoặc sự thật nào đó (sau 知道 thường là một mệnh đề).',
    },
    coreDifference: '认识 là quen biết người hoặc nhận diện mặt chữ; 知道 là nắm được thông tin/tin tức.',
    goldenRule: 'Quen bạn bè, người quen dùng 认识; biết chuyện gì, ở đâu, mấy giờ dùng 知道.',
    examples: [
      {
        correct: {
          hanzi: '很高兴认识你。',
          pinyin: 'hěn gāo xìng rèn shi nǐ 。',
          meaning: 'Rất vui được quen biết bạn.',
        },
        wrong: {
          hanzi: '很高兴知道你。',
          explanation: 'Sai vì làm quen với người phải dùng 认识.',
        },
      },
      {
        correct: {
          hanzi: '我知道他的电话号码。',
          pinyin: 'wǒ zhī dào tā de diàn huà hào mǎ 。',
          meaning: 'Tôi biết số điện thoại của anh ấy.',
        },
        wrong: {
          hanzi: '我认识他的电话号码。',
          explanation: 'Sai vì số điện thoại là thông tin dữ liệu, phải dùng 知道.',
        },
      },
    ],
    quizPrompt: {
      sentence: '你认识那个新来的同学吗？',
      blankSentence: '你 ___ 那个新来的同学吗？',
      options: ['认识', '知道'],
      correctAnswer: '认识',
      explanation: 'Đối tượng là người (bạn học mới), dùng 认识 để hỏi quen biết.',
    },
  },
  {
    id: 'hui_neng_keyi',
    title: '会 (huì) vs 能 (néng) vs 可以 (kěyǐ)',
    level: 'HSK 1',
    category: 'verb_action',
    categoryName: 'Động từ năng nguyện',
    wordA: {
      hanzi: '会',
      pinyin: 'huì',
      meaning: 'Biết làm gì (nhờ qua học tập, rèn luyện)',
      usageRule: 'Diễn đạt kỹ năng có được do học hỏi: 会游泳 (biết bơi), 会说汉语 (biết nói tiếng Trung), 会做饭 (biết nấu ăn).',
    },
    wordB: {
      hanzi: '能',
      pinyin: 'néng',
      meaning: 'Có thể (điều kiện, thể lực, hoàn cảnh cho phép)',
      usageRule: 'Diễn đạt năng lực tự nhiên hoặc hoàn cảnh thực tế cho phép: 我今天身体好了，能去上班了 (Hôm nay khỏe rồi, có thể đi làm).',
    },
    wordC: {
      hanzi: '可以',
      pinyin: 'kě yǐ',
      meaning: 'Có thể / Được phép (sự cho phép, đồng ý)',
      usageRule: 'Diễn đạt sự cho phép về mặt quy định hoặc hỏi ý kiến: 这里可以抽烟吗？ (Ở đây được hút thuốc không?).',
    },
    coreDifference: '会 do học tập mà biết; 能 do điều kiện/sức khỏe cho phép; 可以 do quy định hoặc người khác cho phép.',
    goldenRule: 'Kỹ năng học hỏi dùng 会; Năng lực/hoàn cảnh dùng 能; Xin phép/cho phép dùng 可以.',
    examples: [
      {
        correct: {
          hanzi: '我会说一点儿汉语。',
          pinyin: 'wǒ huì shuō yì diǎnr hàn yǔ 。',
          meaning: 'Tôi biết nói một chút tiếng Trung.',
        },
        wrong: {
          hanzi: '我能说一点儿汉语。（khi chưa học mà nói）',
          explanation: 'Ngôn ngữ là kỹ năng phải học tập, diễn đạt sự hiểu biết bắt buộc dùng 会.',
        },
      },
      {
        correct: {
          hanzi: '请问，我可以坐在这里吗？',
          pinyin: 'qǐng wèn ， wǒ kě yǐ zuò zài zhè lǐ ma ？',
          meaning: 'Xin hỏi, tôi có thể ngồi ở đây được không?',
        },
        wrong: {
          hanzi: '请问，我会坐在这里吗？',
          explanation: 'Sai vì đây là câu hỏi xin phép lịch sự, phải dùng 可以.',
        },
      },
    ],
    quizPrompt: {
      sentence: '弟弟今年五岁，已经会游泳了。',
      blankSentence: '弟弟今年五岁，已经 ___ 游泳了。',
      options: ['会', '可以'],
      correctAnswer: '会',
      explanation: 'Bơi lội là kỹ năng vận động có được qua tập luyện, dùng 会.',
    },
  },
  {
    id: 'xiang_vs_yao',
    title: '想 (xiǎng) vs 要 (yào)',
    level: 'HSK 1',
    category: 'verb_action',
    categoryName: 'Động từ năng nguyện',
    wordA: {
      hanzi: '想',
      pinyin: 'xiǎng',
      meaning: 'Muốn (nguyện vọng, dự định trong suy nghĩ) / Nhớ / Nghĩ',
      usageRule: 'Thể hiện ý muốn mang tính chủ quan, có thể chưa thực hiện ngay. Phủ định là 不想 (không muốn). Ngoài ra còn nghĩa "nhớ" (想妈妈) hoặc "suy nghĩ" (想一想).',
    },
    wordB: {
      hanzi: '要',
      pinyin: 'yào',
      meaning: 'Muốn / Cần / Sắp sửa (quyết tâm cao, đòi hỏi thực tế)',
      usageRule: 'Thể hiện quyết tâm cao, sắp sửa thực hiện ngay lập tức hoặc là yêu cầu cần thiết. Phủ định của ý muốn dùng 不想, phủ định nhắc nhở dùng 不要 / 别 (đừng).',
    },
    coreDifference: '想 là mong muốn trong tâm trí (dự định mềm); 要 là quyết tâm muốn làm hoặc sắp sửa làm (dự định cứng).',
    goldenRule: 'Gọi món ở nhà hàng hoặc mua hàng dứt khoát dùng 我要... (Tôi lấy...); dự định tương lai mơ ước dùng 我想... (Tôi muốn...).',
    examples: [
      {
        correct: {
          hanzi: '服务员，我要一杯热茶。',
          pinyin: 'fú wù yuán ， wǒ yào yì bēi rè chá 。',
          meaning: 'Phục vụ, tôi muốn một cốc trà nóng (gọi món).',
        },
        wrong: {
          hanzi: '服务员，我想一杯热茶。',
          explanation: 'Gọi món thực tế lấy hàng ngay phải dùng 要, không dùng 想 đứng trước danh từ.',
        },
      },
      {
        correct: {
          hanzi: '我想去中国留学。',
          pinyin: 'wǒ xiǎng qù zhōng guó liú xué 。',
          meaning: 'Tôi muốn đi Trung Quốc du học (ước mơ, dự định).',
        },
        wrong: {
          hanzi: '我不想去，但我要去。（nghĩa mâu thuẫn）',
          explanation: 'Dự định nguyện vọng trong lòng dùng 想.',
        },
      },
    ],
    quizPrompt: {
      sentence: '在饭馆点菜时说：我要一碗米饭。',
      blankSentence: '老板，我 ___ 一碗米饭。',
      options: ['要', '想'],
      correctAnswer: '要',
      explanation: 'Gọi món trực tiếp lấy đồ dùng 要.',
    },
  },
  {
    id: 'yidianr_vs_youdianr',
    title: '一点儿 (yìdiǎnr) vs 有点儿 (yǒudiǎnr)',
    level: 'HSK 2',
    category: 'adverb_particle',
    categoryName: 'Phó từ chỉ mức độ',
    wordA: {
      hanzi: '一点儿',
      pinyin: 'yì diǎnr',
      meaning: 'Một chút (Đứng TRƯỚC danh từ hoặc SAU tính từ)',
      usageRule: '1. Đứng trước danh từ: 一点儿水 (chút nước), 一点儿钱 (chút tiền). 2. Đứng SAU tính từ thể hiện sự so sánh: 便宜一点儿 (rẻ hơn một chút).',
    },
    wordB: {
      hanzi: '有点儿',
      pinyin: 'yǒu diǎnr',
      meaning: 'Hơi hơi (Đứng TRƯỚC tính từ, thường mang nghĩa tiêu cực/phàn nàn)',
      usageRule: 'Luôn đứng TRƯỚC tính từ hoặc động từ tâm lý, thường biểu thị sự việc không như ý: 有点儿累 (hơi mệt), 有点儿冷 (hơi lạnh), 有点儿贵 (hơi đắt).',
    },
    coreDifference: '有点儿 + Tính từ (hơi mệt); Tính từ + 一点儿 (rẻ hơn một chút); 一点儿 + Danh từ (chút nước).',
    goldenRule: 'Cứ chê bai, phàn nàn không như ý thì dùng 有点儿 đứng TRƯỚC tính từ: 有点儿冷, 有点儿贵.',
    examples: [
      {
        correct: {
          hanzi: '今天天气有点儿冷。',
          pinyin: 'jīn tiān tiān qì yǒu diǎnr lěng 。',
          meaning: 'Thời tiết hôm nay hơi lạnh (phàn nàn).',
        },
        wrong: {
          hanzi: '今天天气冷有点儿。/ 今天天气一点儿冷。',
          explanation: 'Sai vì 有点儿 phải đứng trước tính từ 冷.',
        },
      },
      {
        correct: {
          hanzi: '这件衣服太贵了，能不能便宜一点儿？',
          pinyin: 'zhè jiàn yī fu tài guì le ， néng bu néng pián yi yì diǎnr ？',
          meaning: 'Bộ quần áo này đắt quá, có thể rẻ hơn một chút được không?',
        },
        wrong: {
          hanzi: '能不能有点儿便宜？',
          explanation: 'Sai vì so sánh mong muốn mức độ phải dùng Tính từ + 一点儿.',
        },
      },
    ],
    quizPrompt: {
      sentence: '今天工作太多了，我觉得有点儿累。',
      blankSentence: '今天工作太多了，我觉得 ___ 累。',
      options: ['有点儿', '一点儿'],
      correctAnswer: '有点儿',
      explanation: 'Đứng trước tính từ 累 (mệt) mang nghĩa phàn nàn, dùng 有点儿.',
    },
  },
  {
    id: 'huozhe_vs_haishi',
    title: '或者 (huòzhě) vs 还是 (háishì)',
    level: 'HSK 2',
    category: 'adverb_particle',
    categoryName: 'Liên từ lựa chọn',
    wordA: {
      hanzi: '或者',
      pinyin: 'huò zhě',
      meaning: 'Hoặc / Hoặc là (DÙNG TRONG CÂU TRẦN THUẬT)',
      usageRule: 'Chuyên dùng trong câu khẳng định, trần thuật để liên kết hai hay nhiều phương án: 我喝茶或者咖啡都可以 (Tôi uống trà hoặc cà phê đều được).',
    },
    wordB: {
      hanzi: '还是',
      pinyin: 'hái shì',
      meaning: 'Hay là (DÙNG TRONG CÂU HỎI LỰA CHỌN)',
      usageRule: 'Chuyên dùng trong câu nghi vấn để yêu cầu người nghe chọn một trong hai phương án: 你喝茶还是喝咖啡？ (Bạn uống trà hay uống cà phê?).',
    },
    coreDifference: '或者 dùng trong câu kể trần thuật; 还是 dùng trong câu hỏi nghi vấn.',
    goldenRule: 'Thấy cuối câu có dấu hỏi chấm (?) thì dùng 还是; thấy câu kể dấu chấm (.) thì dùng 或者.',
    examples: [
      {
        correct: {
          hanzi: '你想吃米饭还是吃面条？',
          pinyin: 'nǐ xiǎng chī mǐ fàn hái shì chī miàn tiáo ？',
          meaning: 'Bạn muốn ăn cơm hay ăn mì?',
        },
        wrong: {
          hanzi: '你想吃米饭或者吃面条？',
          explanation: 'Sai vì câu hỏi lựa chọn không bao giờ dùng 或者.',
        },
      },
      {
        correct: {
          hanzi: '星期六或者星期天我都可以在家。',
          pinyin: 'xīng qī liù huò zhě xīng qī tiān wǒ dōu kě yǐ zài jiā 。',
          meaning: 'Thứ Bảy hoặc Chủ Nhật tôi đều có thể ở nhà.',
        },
        wrong: {
          hanzi: '星期六还是星期天我都可以在家。',
          explanation: 'Sai vì câu trần thuật khẳng định không dùng 还是 để liên kết.',
        },
      },
    ],
    quizPrompt: {
      sentence: '请问你喝茶还是喝咖啡？',
      blankSentence: '请问你喝茶 ___ 喝咖啡？',
      options: ['还是', '或者'],
      correctAnswer: '还是',
      explanation: 'Đây là câu hỏi lựa chọn có dấu hỏi chấm, bắt buộc dùng 还是.',
    },
  },
  {
    id: 'zai_vs_you',
    title: '再 (zài) vs 又 (yòu)',
    level: 'HSK 2',
    category: 'adverb_particle',
    categoryName: 'Phó từ chỉ sự lặp lại',
    wordA: {
      hanzi: '再',
      pinyin: 'zài',
      meaning: 'Lại / Nữa (Hành động CHƯA XẢY RA, sẽ lặp lại ở tương lai)',
      usageRule: 'Diễn tả hành động sẽ lặp lại hoặc tiếp tục trong tương lai: 再见 (Hẹn gặp lại), 欢迎下次再来 (Hoan nghênh lần sau lại đến).',
    },
    wordB: {
      hanzi: '又',
      pinyin: 'yòu',
      meaning: 'Lại (Hành động ĐÃ XẢY RA, đã lặp lại trong quá khứ)',
      usageRule: 'Diễn tả hành động hoặc trạng thái đã lặp lại trong quá khứ (thường kèm trợ từ 了): 昨天他又迟到了 (Hôm qua anh ấy lại đi muộn rồi).',
    },
    coreDifference: '再 lặp lại ở tương lai; 又 lặp lại trong quá khứ.',
    goldenRule: 'Chưa làm mà sẽ làm lại ➔ dùng 再 (再见); Đã làm xong rồi mà lại tái diễn ➔ dùng 又 (...又...了).',
    examples: [
      {
        correct: {
          hanzi: '今天他又没来上课。',
          pinyin: 'jīn tiān tā yòu méi lái shàng kè 。',
          meaning: 'Hôm nay anh ấy lại không đến lớp (đã xảy ra).',
        },
        wrong: {
          hanzi: '今天他再没来上课。',
          explanation: 'Sai vì hành động không đến lớp đã diễn ra trong thực tế, phải dùng 又.',
        },
      },
      {
        correct: {
          hanzi: '请你再说一遍。',
          pinyin: 'qǐng nǐ zài shuō yí biàn 。',
          meaning: 'Xin bạn nói lại một lần nữa (hành động sắp tới).',
        },
        wrong: {
          hanzi: '请你又说一遍。',
          explanation: 'Sai vì yêu cầu ai làm việc gì ở tương lai phải dùng 再.',
        },
      },
    ],
    quizPrompt: {
      sentence: '今天下雨了，明天可能又下雨了？不对，请再说一遍。',
      blankSentence: '这本书很好看，我想 ___ 看一次。',
      options: ['再', '又'],
      correctAnswer: '再',
      explanation: 'Dự định muốn đọc lại ở tương lai, dùng 再.',
    },
  },
  {
    id: 'gang_vs_gangcai',
    title: '刚 (gāng) vs 刚才 (gāngcái)',
    level: 'HSK 2',
    category: 'noun_time',
    categoryName: 'Thời gian & Phó từ',
    wordA: {
      hanzi: '刚',
      pinyin: 'gāng',
      meaning: 'Vừa mới (PHÓ TỪ, đứng SAU chủ ngữ, TRƯỚC động từ)',
      usageRule: 'Chỉ khoảng thời gian ngắn theo cảm nhận chủ quan của người nói (có thể là vài phút, vài ngày, thậm chí vài tháng): 我刚来中国一个月 (Tôi mới đến Trung Quốc được 1 tháng).',
    },
    wordB: {
      hanzi: '刚才',
      pinyin: 'gāng cái',
      meaning: 'Vừa nãy / Vừa rồi (DANH TỪ THỜI GIAN, đứng TRƯỚC hoặc SAU chủ ngữ)',
      usageRule: 'Chỉ thời điểm khách quan ngay trước lúc nói chỉ vài phút: 刚才谁来了？ (Vừa nãy ai đến đấy?). Có thể đứng đầu câu trước chủ ngữ.',
    },
    coreDifference: '刚 là phó từ (chủ quan, đứng trước động từ); 刚才 là danh từ chỉ thời gian vài phút trước (đứng trước hoặc sau chủ ngữ).',
    goldenRule: 'Muốn đặt ở đầu câu ➔ Bắt buộc dùng 刚才 (刚才我去洗手了). Đứng kẹp giữa Chủ ngữ và Động từ ➔ Dùng 刚 (我刚到).',
    examples: [
      {
        correct: {
          hanzi: '刚才你去哪儿了？',
          pinyin: 'gāng cái nǐ qù nǎr le ？',
          meaning: 'Vừa nãy bạn đã đi đâu đấy?',
        },
        wrong: {
          hanzi: '刚你去哪儿了？',
          explanation: 'Sai vì 刚 là phó từ, không thể đứng đầu câu trước chủ ngữ 你.',
        },
      },
      {
        correct: {
          hanzi: '我刚到家，有点儿累。',
          pinyin: 'wǒ gāng dào jiā ， yǒu diǎnr lèi 。',
          meaning: 'Tôi vừa mới về đến nhà, hơi mệt.',
        },
        wrong: {
          hanzi: '我刚才到家了三个小时。（thời gian dài）',
          explanation: '刚才 chỉ thời điểm vài phút trước, không dùng cho khoảng thời gian kéo dài.',
        },
      },
    ],
    quizPrompt: {
      sentence: '刚才你在给谁打电话？',
      blankSentence: '___ 你在给谁打电话？',
      options: ['刚才', '刚'],
      correctAnswer: '刚才',
      explanation: 'Vị trí ở đầu câu đứng trước chủ ngữ 你, chỉ có danh từ thời gian 刚才 mới đứng được.',
    },
  },
  {
    id: 'qu_vs_zou',
    title: '去 (qù) vs 走 (zǒu)',
    level: 'HSK 1',
    category: 'verb_action',
    categoryName: 'Động từ di chuyển',
    wordA: {
      hanzi: '去',
      pinyin: 'qù',
      meaning: 'Đi (Có MỤC ĐÍCH hoặc NƠI ĐẾN cụ thể)',
      usageRule: 'Sau 去 BẮT BUỘC có thể mang tân ngữ nơi chốn: 去学校 (đi trường học), 去北京 (đi Bắc Kinh), 去商店 (đi cửa hàng).',
    },
    wordB: {
      hanzi: '走',
      pinyin: 'zǒu',
      meaning: 'Đi bộ / Bước đi / Rời đi (KHÔNG mang tân ngữ nơi chốn)',
      usageRule: 'Nhấn mạnh hành động bước đi bằng chân hoặc rời khỏi một nơi: 我们走路去 (chúng ta đi bộ đi), 时间不早了，我该走了 (Muộn rồi, tôi phải đi về đây). TUYỆT ĐỐI KHÔNG NÓI "走学校".',
    },
    coreDifference: '去 + Nơi chốn (đi đến đâu); 走 KHÔNG mang nơi chốn (đi bộ hoặc rời đi).',
    goldenRule: 'Sai lầm kinh điển: "我走学校" ➔ Sai nghiêm trọng! Bắt buộc nói "我去学校" hoặc "我走路去学校".',
    examples: [
      {
        correct: {
          hanzi: '明天我想去图书馆看书。',
          pinyin: 'míng tiān wǒ xiǎng qù tú shū guǎn kàn shū 。',
          meaning: 'Ngày mai tôi muốn đến thư viện đọc sách.',
        },
        wrong: {
          hanzi: '明天我想走图书馆看书。',
          explanation: 'Sai vì 走 không được mang trực tiếp danh từ nơi chốn phía sau.',
        },
      },
      {
        correct: {
          hanzi: '太晚了，我先走了。',
          pinyin: 'tài wǎn le ， wǒ xiān zǒu le 。',
          meaning: 'Muộn quá rồi, tôi xin phép rời đi trước.',
        },
        wrong: {
          hanzi: '太晚了，我先去了。（thiếu nơi đến）',
          explanation: 'Sai vì 去 cần có đích đến cụ thể, rời đi dùng 走.',
        },
      },
    ],
    quizPrompt: {
      sentence: '周末我们一起去公园玩吧。',
      blankSentence: '周末我们一起 ___ 公园玩吧。',
      options: ['去', '走'],
      correctAnswer: '去',
      explanation: 'Phía sau có danh từ nơi chốn 公园 (công viên), bắt buộc dùng 去.',
    },
  },
  {
    id: 'kan_vs_kanjian',
    title: '看 (kàn) vs 看见 (kànjiàn)',
    level: 'HSK 1',
    category: 'verb_action',
    categoryName: 'Động từ tri giác',
    wordA: {
      hanzi: '看',
      pinyin: 'kàn',
      meaning: 'Nhìn / Xem / Đọc (HÀNH ĐỘNG nhìn có chủ đích)',
      usageRule: 'Nhấn mạnh vào quá trình thực hiện hành vi: 看书 (đọc sách), 看电影 (xem phim), 看黑板 (nhìn lên bảng).',
    },
    wordB: {
      hanzi: '看见',
      pinyin: 'kàn jiàn',
      meaning: 'Nhìn thấy (KẾT QUẢ của hành động nhìn)',
      usageRule: 'Nhấn mạnh thị giác đã thu nhận được kết quả (thấy được người/vật): 我看见他了 (Tôi đã nhìn thấy anh ấy).',
    },
    coreDifference: '看 là động tác nhìn/xem; 看见 là kết quả nhìn thấy.',
    goldenRule: 'Đọc sách, xem TV dùng 看; tìm thấy ai hoặc bắt gặp gì đó dùng 看见.',
    examples: [
      {
        correct: {
          hanzi: '你在看什么书？',
          pinyin: 'nǐ zài kàn shén me shū ？',
          meaning: 'Bạn đang đọc sách gì thế?',
        },
        wrong: {
          hanzi: '你在看见什么书？',
          explanation: 'Sai vì đọc sách là quá trình hành động, phải dùng 看.',
        },
      },
      {
        correct: {
          hanzi: '昨天我在超市看见了王老师。',
          pinyin: 'zuó tiān wǒ zài chāo shì kàn jiàn le wáng lǎo shī 。',
          meaning: 'Hôm qua tôi đã nhìn thấy thầy Vương ở siêu thị.',
        },
        wrong: {
          hanzi: '昨天我在超市看了王老师。（nghĩa là nhìn chằm chằm thầy）',
          explanation: 'Bắt gặp, trông thấy người quen phải dùng kết quả 看见.',
        },
      },
    ],
    quizPrompt: {
      sentence: '我的眼镜呢？你看见了吗？',
      blankSentence: '我的眼镜呢？你 ___ 了吗？',
      options: ['看见', '看'],
      correctAnswer: '看见',
      explanation: 'Hỏi có nhìn thấy kính không (hỏi kết quả), dùng 看见.',
    },
  },
  {
    id: 'changchang_vs_jingchang',
    title: '常常 (chángcháng) vs 经常 (jīngcháng)',
    level: 'HSK 2',
    category: 'adverb_particle',
    categoryName: 'Phó từ chỉ tần suất',
    wordA: {
      hanzi: '常常',
      pinyin: 'cháng cháng',
      meaning: 'Thường thường (Thiên về thói quen trong quá khứ / hiện tại)',
      usageRule: 'Nhấn mạnh tần suất lặp lại theo thói quen cá nhân. Phủ định thường dùng 不常 (không hay làm), ít khi dùng 不常常.',
    },
    wordB: {
      hanzi: '经常',
      pinyin: 'jīng cháng',
      meaning: 'Thường xuyên (Quy luật ổn định, có thể làm tính từ)',
      usageRule: 'Vừa là phó từ, vừa có thể làm định ngữ (经常的工作 - công việc thường xuyên). Phủ định có thể dùng 不经常.',
    },
    coreDifference: 'Cả hai đồng nghĩa khi làm phó từ; 经常 trang trọng hơn và có thể bổ nghĩa cho danh từ.',
    goldenRule: 'Phủ định của thói quen hãy nói 不常 hoặc 不经常, đừng nói 不常常.',
    examples: [
      {
        correct: {
          hanzi: '周末我常常去图书馆。',
          pinyin: 'zhōu mò wǒ cháng cháng qù tú shū guǎn 。',
          meaning: 'Cuối tuần tôi thường đến thư viện.',
        },
        wrong: {
          hanzi: '这是我的常常工作。',
          explanation: 'Sai vì 常常 không thể làm định ngữ cho danh từ 工作, phải dùng 经常.',
        },
      },
    ],
    quizPrompt: {
      sentence: '他不常喝咖啡。',
      blankSentence: '他 ___ 喝咖啡，只喜欢喝茶。',
      options: ['不常', '不常常'],
      correctAnswer: '不常',
      explanation: 'Phủ định thói quen dùng 不常, không dùng 不常常.',
    },
  },
  {
    id: 'bu_vs_mei_deep',
    title: '不 (bù) vs 没 (méi)',
    level: 'HSK 1',
    category: 'adverb_particle',
    categoryName: 'Phó từ phủ định',
    wordA: {
      hanzi: '不',
      pinyin: 'bù',
      meaning: 'Không (Phủ định chủ quan, thói quen, hiện tại, tương lai, tính từ)',
      usageRule: 'Dùng phủ định ý muốn chủ quan (我不去 - Tôi không muốn đi), thói quen (我不吸烟 - Tôi không hút thuốc), tính từ (不冷 - Không lạnh).',
    },
    wordB: {
      hanzi: '没',
      pinyin: 'méi',
      meaning: 'Chưa / Không (Phủ định khách quan, hành động quá khứ)',
      usageRule: 'Dùng phủ định sự việc chưa xảy ra hoặc không xảy ra trong quá khứ (我没去 - Tôi chưa đi/không đi). Duy nhất phủ định của 有 là 没有.',
    },
    coreDifference: '不 mang tính chủ quan/thói quen; 没 mang tính khách quan/quá khứ chưa làm.',
    goldenRule: 'Phủ định tính từ ➔ luôn dùng 不 (不热, 不高兴); Phủ định chữ 有 ➔ luôn dùng 没 (没有).',
    examples: [
      {
        correct: {
          hanzi: '今天天气不热。',
          pinyin: 'jīn tiān tiān qì bú rè 。',
          meaning: 'Hôm nay trời không nóng.',
        },
        wrong: {
          hanzi: '今天天气没热。',
          explanation: 'Sai vì phủ định tính từ 熱 phải dùng 不.',
        },
      },
      {
        correct: {
          hanzi: '昨天他没来上课。',
          pinyin: 'zuó tiān tā méi lái shàng kè 。',
          meaning: 'Hôm qua anh ấy không đến lớp (quá khứ).',
        },
        wrong: {
          hanzi: '昨天他不来上课。（trừ khi biểu thị anh ta bướng bỉnh từ chối）',
          explanation: 'Sự việc khách quan trong quá khứ chưa xảy ra phải dùng 没.',
        },
      },
    ],
    quizPrompt: {
      sentence: '我今天没有时间去买东西。',
      blankSentence: '我今天 ___ 有时间去买东西。',
      options: ['没', '不'],
      correctAnswer: '没',
      explanation: 'Phủ định của động từ 有 duy nhất chỉ có 没有, tuyệt đối không có 不有.',
    },
  },
  {
    id: 'shijian_vs_shihou',
    title: '时间 (shíjiān) vs 时候 (shíhou)',
    level: 'HSK 1',
    category: 'noun_time',
    categoryName: 'Danh từ chỉ thời gian',
    wordA: {
      hanzi: '时间',
      pinyin: 'shí jiān',
      meaning: 'Thời gian (KHOẢNG THỜI GIAN, số lượng đo đếm được)',
      usageRule: 'Là danh từ độc lập: 有时间 (có thời gian), 没有时间 (không có thời gian), 很长时间 (thời gian rất dài).',
    },
    wordB: {
      hanzi: '时候',
      pinyin: 'shí hou',
      meaning: 'Lúc / Khi (THỜI ĐIỂM, thường đi trong cụm ...的时候)',
      usageRule: 'Không đứng một mình mà thường tạo thành cụm: 什么时候 (khi nào/bao giờ), 吃饭的时候 (lúc ăn cơm), 小的时候 (hồi còn nhỏ).',
    },
    coreDifference: '时间 là lượng thời gian; 时候 là mốc thời điểm trong cụm (...的时候 / 什么时候).',
    goldenRule: '"Có rảnh không" ➔ 有时间吗? ; "Khi nào đi" ➔ 什么时候去? ; "Lúc ăn cơm" ➔ 吃饭的时候.',
    examples: [
      {
        correct: {
          hanzi: '你什么时候来我家玩？',
          pinyin: 'nǐ shén me shí hou lái wǒ jiā wán ？',
          meaning: 'Khi nào bạn đến nhà tôi chơi?',
        },
        wrong: {
          hanzi: '你什么时间来我家玩？（khẩu ngữ không tự nhiên bằng）',
          explanation: 'Hỏi thời điểm bao giờ trong giao tiếp bắt buộc dùng 什么时候.',
        },
      },
      {
        correct: {
          hanzi: '我今天太忙了，没有时间看电视。',
          pinyin: 'wǒ jīn tiān tài máng le ， méi yǒu shí jiān kàn diàn shì 。',
          meaning: 'Hôm nay tôi bận quá, không có thời gian xem TV.',
        },
        wrong: {
          hanzi: '我今天太忙了，没有时候看电视。',
          explanation: 'Sai vì khoảng thời gian độc lập phải dùng 时间, không dùng 时候.',
        },
      },
    ],
    quizPrompt: {
      sentence: '我们吃饭的时候不要看手机。',
      blankSentence: '我们吃饭的 ___ 不要看手机。',
      options: ['时候', '时间'],
      correctAnswer: '时候',
      explanation: 'Cấu trúc ...的时候 biểu thị "lúc / khi đang làm gì".',
    },
  },
  {
    id: 'jia_vs_fangjian',
    title: '家 (jiā) vs 房间 (fángjiān)',
    level: 'HSK 1',
    category: 'noun_time',
    categoryName: 'Danh từ không gian',
    wordA: {
      hanzi: '家',
      pinyin: 'jiā',
      meaning: 'Nhà / Gia đình (Mái ấm, nơi ở, gia đình gồm các thành viên)',
      usageRule: 'Mang ý nghĩa tình cảm và tổng thể: 回家 (về nhà), 我家有四口人 (Nhà tôi có 4 người). Còn làm lượng từ cho công ty/cửa hàng (一家公司).',
    },
    wordB: {
      hanzi: '房间',
      pinyin: 'fáng jiān',
      meaning: 'Căn phòng (Không gian phòng ốc vật lý bên trong ngôi nhà)',
      usageRule: 'Chỉ phòng ốc cụ thể: 我的房间很干净 (Căn phòng của tôi rất sạch sẽ), 两个房间 (hai căn phòng).',
    },
    coreDifference: '家 là ngôi nhà/gia đình tổng thể; 房间 là từng căn phòng cụ thể bên trong.',
    goldenRule: 'Về nhà nói 回家 (không nói 回房间 trừ khi đang ở ký túc xá). Đếm phòng ốc dùng 房间.',
    examples: [
      {
        correct: {
          hanzi: '下班以后我就回家。',
          pinyin: 'xià bān yǐ hòu wǒ jiù huí jiā 。',
          meaning: 'Tan làm xong là tôi về nhà ngay.',
        },
        wrong: {
          hanzi: '下班以后我就回房间。（nếu đang sống cùng gia đình）',
          explanation: 'Về mái ấm gia đình dùng 回家.',
        },
      },
    ],
    quizPrompt: {
      sentence: '我的房间不大，但是很舒服。',
      blankSentence: '我的 ___ 不大，但是很舒服。',
      options: ['房间', '家'],
      correctAnswer: '房间',
      explanation: 'Miêu tả không gian phòng ngủ/phòng riêng, dùng 房间.',
    },
  },
  {
    id: 'zenme_vs_zenmeyang',
    title: '怎么 (zěnme) vs 怎么样 (zěnmeyàng)',
    level: 'HSK 1',
    category: 'adverb_particle',
    categoryName: 'Đại từ nghi vấn',
    wordA: {
      hanzi: '怎么',
      pinyin: 'zěn me',
      meaning: 'Làm sao / Thế nào / Bằng cách nào (HỎI PHƯƠNG THỨC hoặc NGUYÊN NHÂN)',
      usageRule: 'Luôn đứng TRƯỚC ĐỘNG TỪ: 怎么走 (đi như thế nào), 这个字怎么写 (chữ này viết thế nào), 你怎么没来 (sao bạn lại không đến - hỏi lý do).',
    },
    wordB: {
      hanzi: '怎么样',
      pinyin: 'zěn me yàng',
      meaning: 'Thế nào / Ra sao (HỎI TÍNH CHẤT, TÌNH HÌNH hoặc THĂM DÒ Ý KIẾN)',
      usageRule: 'Thường đứng ở CUỐI CÂU: 今天天气怎么样？ (Thời tiết hôm nay thế nào?), 我们去吃火锅，怎么样？ (Chúng ta đi ăn lẩu nhé, thấy thế nào?).',
    },
    coreDifference: '怎么 + Động từ (hỏi cách làm/nguyên nhân); ...怎么样? (hỏi ý kiến/tình hình ở cuối câu).',
    goldenRule: 'Đứng trước động từ ➔ 怎么 (怎么去, 怎么写); Đứng ở cuối câu ➔ 怎么样 (身体怎么样, 怎么样?).',
    examples: [
      {
        correct: {
          hanzi: '请问去火车站怎么走？',
          pinyin: 'qǐng wèn qù huǒ chē zhàn zěn me zǒu ？',
          meaning: 'Xin hỏi đi đến ga tàu hỏa đi như thế nào?',
        },
        wrong: {
          hanzi: '请问去火车站怎么样走？',
          explanation: 'Sai vì hỏi phương thức hành động trước động từ 走 phải dùng 怎么.',
        },
      },
      {
        correct: {
          hanzi: '你最近身体怎么样？',
          pinyin: 'nǐ zuì jìn shēn tǐ zěn me yàng ？',
          meaning: 'Dạo này sức khỏe của bạn thế nào?',
        },
        wrong: {
          hanzi: '你最近身体怎么？',
          explanation: 'Sai vì hỏi tình hình ở cuối câu phải dùng 怎么样.',
        },
      },
    ],
    quizPrompt: {
      sentence: '这个汉字怎么读？',
      blankSentence: '这个汉字 ___ 读？',
      options: ['怎么', '怎么样'],
      correctAnswer: '怎么',
      explanation: 'Đứng trước động từ 读 (đọc) để hỏi cách đọc, bắt buộc dùng 怎么.',
    },
  },
  {
    id: 'yiqian_vs_yihou',
    title: '以前 (yǐqián) vs 以后 (yǐhòu)',
    level: 'HSK 2',
    category: 'noun_time',
    categoryName: 'Thời gian & Thứ tự',
    wordA: {
      hanzi: '以前',
      pinyin: 'yǐ qián',
      meaning: 'Trước đây / Trước khi',
      usageRule: '1. Độc lập: 以前我不喜欢吃辣 (Trước đây tôi không thích ăn cay). 2. Sau mốc thời gian/hành động: 吃饭以前 (Trước khi ăn cơm), 三天以前 (3 ngày trước).',
    },
    wordB: {
      hanzi: '以后',
      pinyin: 'yǐ hòu',
      meaning: 'Sau này / Sau khi',
      usageRule: '1. Độc lập: 以后常来玩 (Sau này thường xuyên đến chơi nhé). 2. Sau mốc thời gian/hành động: 下课以后 (Sau khi tan học), 毕业以后 (Sau khi tốt nghiệp).',
    },
    coreDifference: '以前 là quá khứ/trước khi; 以后 là tương lai/sau khi.',
    goldenRule: 'Chú ý trật tự từ: Tiếng Việt nói "Sau khi tan học" ➔ Tiếng Trung nói "下课以后" (Tan học sau khi).',
    examples: [
      {
        correct: {
          hanzi: '吃饭以前要洗手。',
          pinyin: 'chī fàn yǐ qián yào xǐ shǒu 。',
          meaning: 'Trước khi ăn cơm phải rửa tay.',
        },
        wrong: {
          hanzi: '以前吃饭要洗手。',
          explanation: 'Sai vì "trước khi làm gì" phải đặt 以前 ở sau hành động 吃饭.',
        },
      },
    ],
    quizPrompt: {
      sentence: '我们下课以后去打篮球吧。',
      blankSentence: '我们下课 ___ 去打篮球吧。',
      options: ['以后', '以前'],
      correctAnswer: '以后',
      explanation: 'Tan học rồi mới đi chơi bóng rổ (sau khi tan học), dùng 以后.',
    },
  },
];
