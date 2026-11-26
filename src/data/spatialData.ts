export interface DirectionWord {
  id: string;
  hanzi: string;
  pinyin: string;
  vietnamese: string;
  variants: string[];
  oppositeId?: string;
  category: 'vertical' | 'horizontal' | 'depth' | 'relative' | 'cardinal';
  icon: string;
  usageTip: string;
  example: {
    sentence: string;
    pinyin: string;
    vietnamese: string;
  };
}

export interface PositionStructure {
  id: string;
  name: string;
  formula: string;
  meaning: string;
  explanation: string;
  examples: {
    chinese: string;
    pinyin: string;
    vietnamese: string;
  }[];
}

export interface ExistentialPattern {
  id: string;
  title: string;
  formula: string;
  subType: 'existence' | 'appearance' | 'disappearance';
  verbType: string;
  explanation: string;
  examples: {
    chinese: string;
    pinyin: string;
    vietnamese: string;
    breakdown: string;
  }[];
}

export interface SpatialMistakeRule {
  id: string;
  title: string;
  ruleDescription: string;
  whyWrong: string;
  wrongExample: string;
  correctExample: string;
  pinyin: string;
  vietnamese: string;
}

export interface SpatialQuizQuestion {
  id: string;
  prompt: string;
  sentence: string;
  pinyin: string;
  vietnamese: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'direction' | 'existential' | 'rule';
}

export const DIRECTION_WORDS: DirectionWord[] = [
  {
    id: 'shang',
    hanzi: '上',
    pinyin: 'shàng',
    vietnamese: 'Trên, phía trên',
    variants: ['上面 (shàngmian)', '上边 (shàngbian)', '头上 (tóushang)'],
    oppositeId: 'xia',
    category: 'vertical',
    icon: '⬆️',
    usageTip: 'Thường đứng sau danh từ tạo cụm nơi chốn (桌子上 - trên bàn, 墙上 - trên tường). Khi làm hậu tố thường đọc thanh nhẹ.',
    example: {
      sentence: '桌子上有一台电脑和一本书。',
      pinyin: 'Zhuōzi shang yǒu yì tái diànnǎo hé yì běn shū.',
      vietnamese: 'Trên bàn có một chiếc máy tính và một cuốn sách.'
    }
  },
  {
    id: 'xia',
    hanzi: '下',
    pinyin: 'xià',
    vietnamese: 'Dưới, phía dưới',
    variants: ['下面 (xiàmian)', '下边 (xiàbian)', '底下 (dǐxia)'],
    oppositeId: 'shang',
    category: 'vertical',
    icon: '⬇️',
    usageTip: 'Dùng chỉ vị trí thấp hơn bề mặt hoặc không gian bên dưới (椅子下面 - dưới ghế, 树下 - dưới gốc cây).',
    example: {
      sentence: '小猫在椅子下面睡觉。',
      pinyin: 'Xiǎomāo zài yǐzi xiàmian shuìjiào.',
      vietnamese: 'Chú mèo con đang ngủ ở dưới ghế.'
    }
  },
  {
    id: 'qian',
    hanzi: '前',
    pinyin: 'qián',
    vietnamese: 'Trước, phía trước',
    variants: ['前面 (qiánmian)', '前边 (qiánbian)', '前方 (qiánfāng)'],
    oppositeId: 'hou',
    category: 'horizontal',
    icon: '⏩',
    usageTip: 'Chỉ không gian phía trước mặt hoặc thời gian trước đó (三天前 - 3 ngày trước).',
    example: {
      sentence: '学校前面有一个很大的公园。',
      pinyin: 'Xuéxiào qiánmian yǒu yí gè hěn dà de gōngyuán.',
      vietnamese: 'Phía trước trường học có một công viên rất lớn.'
    }
  },
  {
    id: 'hou',
    hanzi: '后',
    pinyin: 'hòu',
    vietnamese: 'Sau, phía sau',
    variants: ['后面 (hòumian)', '后边 (hòubian)', '后方 (hòufāng)'],
    oppositeId: 'qian',
    category: 'horizontal',
    icon: '⏪',
    usageTip: 'Chỉ phương hướng phía sau lưng đối tượng hoặc thời gian sau (下课后 - sau khi tan học).',
    example: {
      sentence: '超市后面是一个公交车站。',
      pinyin: 'Chāoshì hòumian shì yí gè gōngjiāochē zhàn.',
      vietnamese: 'Phía sau siêu thị là một trạm xe buýt.'
    }
  },
  {
    id: 'zuo',
    hanzi: '左',
    pinyin: 'zuǒ',
    vietnamese: 'Trái, bên trái',
    variants: ['左边 (zuǒbian)', '左面 (zuǒmian)', '左手边 (zuǒshǒubiān)'],
    oppositeId: 'you',
    category: 'horizontal',
    icon: '⬅️',
    usageTip: 'Chỉ hướng bên tay trái. Kết hợp cùng 右边 tạo thành 左右 (khoảng chừng, xấp xỉ).',
    example: {
      sentence: '银行在我家的左边。',
      pinyin: 'Yínháng zài wǒ jiā de zuǒbian.',
      vietnamese: 'Ngân hàng nằm ở phía bên trái nhà tôi.'
    }
  },
  {
    id: 'you',
    hanzi: '右',
    pinyin: 'yòu',
    vietnamese: 'Phải, bên phải',
    variants: ['右边 (yòubian)', '右面 (yòumian)', '右手边 (yòushǒubiān)'],
    oppositeId: 'zuo',
    category: 'horizontal',
    icon: '➡️',
    usageTip: 'Chỉ hướng bên tay phải. Khẩu quyết phân biệt: 左工 hữu khẩu 右口.',
    example: {
      sentence: '书店在药店的右边。',
      pinyin: 'Shūdiàn zài yàodiàn de yòubian.',
      vietnamese: 'Hiệu sách ở phía bên phải tiệm thuốc.'
    }
  },
  {
    id: 'li',
    hanzi: '里',
    pinyin: 'lǐ',
    vietnamese: 'Trong, bên trong',
    variants: ['里面 (lǐmian)', '里边 (lǐbian)', '屋里 (wūli)'],
    oppositeId: 'wai',
    category: 'depth',
    icon: '📥',
    usageTip: 'Tuyệt đối KHÔNG dùng sau danh từ địa danh riêng, quốc gia (cấm nói: 在中国里, 在北京里; nói: 在中国, 在北京).',
    example: {
      sentence: '书包里放着汉语书和笔。',
      pinyin: 'Shūbāo li fàng zhe hànyǔ shū hé bǐ.',
      vietnamese: 'Trong cặp sách có để sách tiếng Trung và bút.'
    }
  },
  {
    id: 'wai',
    hanzi: '外',
    pinyin: 'wài',
    vietnamese: 'Ngoài, bên ngoài',
    variants: ['外面 (wàimian)', '外边 (wàibian)', '国外 (guówài)'],
    oppositeId: 'li',
    category: 'depth',
    icon: '📤',
    usageTip: 'Chỉ không gian vượt ra khỏi phạm vi khép kín (门外 - ngoài cửa, 国外 - nước ngoài).',
    example: {
      sentence: '外面正在下大雨，别出去了。',
      pinyin: 'Wàimian zhèngzài xià dàyǔ, bié chūqu le.',
      vietnamese: 'Bên ngoài đang mưa to, đừng đi ra ngoài nữa.'
    }
  },
  {
    id: 'pangbian',
    hanzi: '旁边',
    pinyin: 'pángbiān',
    vietnamese: 'Bên cạnh, kế bên',
    variants: ['身旁 (shēnpáng)', '近旁 (jìnpáng)'],
    category: 'relative',
    icon: '🤝',
    usageTip: 'Chỉ vị trí sát liền kề, không phân biệt trái hay phải.',
    example: {
      sentence: '咖啡馆就在图书馆旁边。',
      pinyin: 'Kāfēiguǎn jiù zài túshūguǎn pángbiān.',
      vietnamese: 'Quán cà phê nằm ngay bên cạnh thư viện.'
    }
  },
  {
    id: 'zhongjian',
    hanzi: '中间',
    pinyin: 'zhōngjiān',
    vietnamese: 'Ở giữa, chính giữa',
    variants: ['当中 (dāngzhōng)', '中心 (zhōngxīn)'],
    category: 'relative',
    icon: '🎯',
    usageTip: 'Thường dùng trong cấu trúc: 在 A 和 B (的) 中间 (Ở giữa A và B).',
    example: {
      sentence: '我就坐在小明和小华的中间。',
      pinyin: 'Wǒ jiù zuò zài Xiǎomíng hé Xiǎohuá de zhōngjiān.',
      vietnamese: 'Tôi ngồi ở ngay chính giữa Tiểu Minh và Tiểu Hoa.'
    }
  },
  {
    id: 'duimian',
    hanzi: '对面',
    pinyin: 'duìmiàn',
    vietnamese: 'Đối diện, phía đối diện',
    variants: ['对过 (duìguo)', '迎面 (yíngmiàn)'],
    category: 'relative',
    icon: '🪞',
    usageTip: 'Chỉ vị trí đối mặt trực tiếp qua một con đường, hành lang hoặc khoảng trống.',
    example: {
      sentence: '我家对面有一家中国饭馆。',
      pinyin: 'Wǒ jiā duìmiàn yǒu yì jiā zhōngguó fànguǎn.',
      vietnamese: 'Đối diện nhà tôi có một nhà hàng Trung Quốc.'
    }
  },
  {
    id: 'fujin',
    hanzi: '附近',
    pinyin: 'fùjìn',
    vietnamese: 'Gần đây, khu vực lân cận',
    variants: ['周围 (zhōuwéi)', '周边 (zhōubiān)'],
    category: 'relative',
    icon: '📍',
    usageTip: 'Chỉ vùng không gian phụ cận. Cấu trúc thường gặp: 这附近 (quanh đây), 学校附近 (quanh trường học).',
    example: {
      sentence: '这附近有地铁站吗？',
      pinyin: 'Zhè fùjìn yǒu dìtiězhàn ma?',
      vietnamese: 'Quanh khu này có trạm tàu điện ngầm không?'
    }
  },
  {
    id: 'dong',
    hanzi: '东',
    pinyin: 'dōng',
    vietnamese: 'Đông, phía Đông',
    variants: ['东边 (dōngbian)', '东方 (dōngfāng)'],
    oppositeId: 'xi',
    category: 'cardinal',
    icon: '🧭',
    usageTip: 'Phía mặt trời mọc. 4 phương vị Đông Tây Nam Bắc trong tiếng Trung đọc theo thứ tự: 东南西北.',
    example: {
      sentence: '太阳从东边升起来。',
      pinyin: 'Tàiyáng cóng dōngbian shēng qǐlai.',
      vietnamese: 'Mặt trời mọc lên từ phía Đông.'
    }
  },
  {
    id: 'xi',
    hanzi: '西',
    pinyin: 'xī',
    vietnamese: 'Tây, phía Tây',
    variants: ['西边 (xībian)', '西方 (xīfāng)'],
    oppositeId: 'dong',
    category: 'cardinal',
    icon: '🧭',
    usageTip: 'Phía mặt trời lặn. Từ 东西 (dōngxi) ghép Đông Tây lại mang nghĩa đồ đạc, vật phẩm.',
    example: {
      sentence: '火车站位于城市的西边。',
      pinyin: 'Huǒchēzhàn wèiyú chéngshì de xībian.',
      vietnamese: 'Ga xe lửa nằm ở phía Tây của thành phố.'
    }
  },
  {
    id: 'nan',
    hanzi: '南',
    pinyin: 'nán',
    vietnamese: 'Nam, phía Nam',
    variants: ['南边 (nánbian)', '南方 (nánfāng)'],
    oppositeId: 'bei',
    category: 'cardinal',
    icon: '🧭',
    usageTip: 'Phía Nam, hướng ấm áp hơn ở Trung Quốc.',
    example: {
      sentence: '冬天很多北方人去南边旅游。',
      pinyin: 'Dōngtiān hěn duō běifāngrén qù nánbian lǚyóu.',
      vietnamese: 'Mùa đông có rất nhiều người miền Bắc đi du lịch về phía Nam.'
    }
  },
  {
    id: 'bei',
    hanzi: '北',
    pinyin: 'běi',
    vietnamese: 'Bắc, phía Bắc',
    variants: ['北边 (běibian)', '北方 (běifāng)'],
    oppositeId: 'nan',
    category: 'cardinal',
    icon: '🧭',
    usageTip: 'Phía Bắc (như 北京 - Bắc Kinh, 北边 - phía bắc).',
    example: {
      sentence: '我们学校在那个商场的北边。',
      pinyin: 'Wǒmen xuéxiào zài nàge shāngchǎng de běibian.',
      vietnamese: 'Trường chúng tôi ở phía Bắc của trung tâm thương mại đó.'
    }
  }
];

export const POSITION_STRUCTURES: PositionStructure[] = [
  {
    id: 'structure_zai',
    name: 'Cấu trúc "Ở đâu" (S + 在 + Nơi chốn + Phương vị từ)',
    formula: 'Chủ ngữ (Đối tượng) + 在 + Địa điểm + Phương vị từ',
    meaning: 'Chỉ rõ một đối tượng cụ thể đang ở vị trí phương hướng nào',
    explanation: 'Dùng khi đối tượng đã xác định (người hoặc vật cụ thể) và bạn muốn thông báo địa điểm của nó.',
    examples: [
      {
        chinese: '我的钥匙在桌子上。',
        pinyin: 'Wǒ de yàoshi zài zhuōzi shang.',
        vietnamese: 'Chìa khóa của tôi ở trên bàn.'
      },
      {
        chinese: '王老师在教室里面。',
        pinyin: 'Wáng lǎoshī zài jiàoshì lǐmian.',
        vietnamese: 'Thầy Vương đang ở bên trong phòng học.'
      },
      {
        chinese: '中国银行就在地铁站对面。',
        pinyin: 'Zhōngguó Yínháng jiù zài dìtiězhàn duìmiàn.',
        vietnamese: 'Ngân hàng Trung Quốc nằm ngay đối diện ga tàu điện ngầm.'
      }
    ]
  },
  {
    id: 'structure_you',
    name: 'Cấu trúc "Có gì ở đâu" (Địa điểm + Phương vị từ + 有 + Danh từ)',
    formula: 'Địa điểm + Phương vị từ + 有 + Tân ngữ (không xác định)',
    meaning: 'Tại một vị trí nào đó có tồn tại người hoặc vật gì',
    explanation: 'Nhấn mạnh sự tồn tại của đối tượng tại vị trí đó. Tân ngữ sau 有 thường là đối tượng chưa xác định (có số lượng như 一本书, 几个人).',
    examples: [
      {
        chinese: '桌子上有两杯咖啡。',
        pinyin: 'Zhuōzi shang yǒu liǎng bēi kāfēi.',
        vietnamese: 'Trên bàn có hai tách cà phê.'
      },
      {
        chinese: '门外有几个人在等你。',
        pinyin: 'Mén wài yǒu jǐ gè rén zài děng nǐ.',
        vietnamese: 'Ngoài cửa có mấy người đang đợi bạn.'
      },
      {
        chinese: '我家附近有很多好吃的饭馆。',
        pinyin: 'Wǒ jiā fùjìn yǒu hěn duō hǎochī de fànguǎn.',
        vietnamese: 'Gần nhà tôi có rất nhiều quán ăn ngon.'
      }
    ]
  },
  {
    id: 'structure_shi',
    name: 'Cấu trúc "Là gì ở đâu" (Địa điểm + Phương vị từ + 是 + Danh từ xác định/duy nhất)',
    formula: 'Địa điểm + Phương vị từ + 是 + Tân ngữ',
    meaning: 'Toàn bộ hoặc đối tượng nổi bật nhất tại vị trí đó chính là...',
    explanation: 'Khác với 有 (chỉ sự tồn tại có thể là một phần), 是 dùng để xác định danh tính hoặc khi đối tượng chiếm trọn vẹn vị trí đó.',
    examples: [
      {
        chinese: '学校左边是图书馆，右边是操场。',
        pinyin: 'Xuéxiào zuǒbian shì túshūguǎn, yòubian shì cāochǎng.',
        vietnamese: 'Bên trái trường học là thư viện, bên phải là sân thể dục.'
      },
      {
        chinese: '前面是一家新开的面馆。',
        pinyin: 'Qiánmian shì yì jiā xīn kāi de miànguǎn.',
        vietnamese: 'Phía trước là một quán mì mới mở.'
      },
      {
        chinese: '桌子上全是书。',
        pinyin: 'Zhuōzi shang quán shì shū.',
        vietnamese: 'Trên bàn toàn là sách.'
      }
    ]
  }
];

export const EXISTENTIAL_PATTERNS: ExistentialPattern[] = [
  {
    id: 'exist_zhe',
    title: 'Câu Tồn Tại Trạng Thái (Nơi chốn + Động từ + 着 + Tân ngữ)',
    formula: 'Nơi chốn + Động từ (放, 挂, 坐, 站, 躺, 停, 摆...) + 着 + Số lượng/Danh từ',
    subType: 'existence',
    verbType: 'Động từ tư thế/bố trí: 放 (đặt), 挂 (treo), 站 (đứng), 坐 (ngồi), 停 (đỗ xe), 种 (trồng), 贴 (dán)',
    explanation: 'Biểu thị một hành động đã diễn ra và kết quả/trạng thái của nó vẫn đang duy trì ổn định tại nơi chốn đó. Cực kỳ phổ biến trong đề thi HSK!',
    examples: [
      {
        chinese: '墙上挂着一张世界地图。',
        pinyin: 'Qiáng shang guà zhe yì zhāng shìjiè dìtú.',
        vietnamese: 'Trên tường đang treo một bức bản đồ thế giới.',
        breakdown: '墙上 (Nơi chốn) + 挂 (Treo) + 着 (Duy trì) + 一张世界地图 (Tân ngữ chưa xác định)'
      },
      {
        chinese: '门前停着一辆黑色汽车。',
        pinyin: 'Mén qián tíng zhe yí liàng hēisè qìchē.',
        vietnamese: 'Trước cửa đang đỗ một chiếc xe ô tô màu đen.',
        breakdown: '门前 (Trước cửa) + 停 (Đỗ xe) + 着 + 一辆黑色汽车'
      },
      {
        chinese: '沙发上坐着一位老爷爷。',
        pinyin: 'Shāfā shang zuò zhe yí wèi lǎo yéye.',
        vietnamese: 'Trên ghế sofa đang ngồi một cụ ông.',
        breakdown: '沙发上 (Trên sofa) + 坐 (Ngồi) + 着 + 一位老爷爷'
      },
      {
        chinese: '院子里种着很多漂亮的花。',
        pinyin: 'Yuànzi li zhòng zhe hěn duō piàoliang de huā.',
        vietnamese: 'Trong sân đang trồng rất nhiều hoa đẹp.',
        breakdown: '院子里 (Trong sân) + 种 (Trồng) + 着 + 很多漂亮的花'
      }
    ]
  },
  {
    id: 'exist_le',
    title: 'Câu Xuất Hiện & Biến Mất (Nơi chốn + Động từ + 了 + Tân ngữ)',
    formula: 'Nơi chốn + Động từ (来, 去, 走, 跑, 发生, 死...) + 了 + Số lượng/Danh từ',
    subType: 'appearance',
    verbType: 'Động từ biến chuyển: 来 (đến), 走 (đi), 跑 (chạy), 丢 (mất), 飞 (bay)',
    explanation: 'Biểu thị tại một địa điểm vừa xuất hiện hoặc mất đi một người/vật nào đó. Tân ngữ bắt buộc phải là đối tượng mới xuất hiện/chưa xác định.',
    examples: [
      {
        chinese: '前边走过来一个人。',
        pinyin: 'Qiánbian zǒu guòlai le yí gè rén.',
        vietnamese: 'Phía trước vừa có một người đi lại.',
        breakdown: '前边 (Phía trước) + 走过来 (Đi lại) + 了 + 一个人 (Xuất hiện người mới)'
      },
      {
        chinese: '我们班今天来了一个新同学。',
        pinyin: 'Wǒmen bān jīntiān lái le yí gè xīn tóngxué.',
        vietnamese: 'Lớp chúng tôi hôm nay vừa đến một bạn học mới.',
        breakdown: '我们班 (Lớp chúng tôi) + 来了 (Đến) + 一个新同学 (Đối tượng mới)'
      },
      {
        chinese: '家里走了一只小猫。',
        pinyin: 'Jiā li zǒu le yì zhī xiǎomāo.',
        vietnamese: 'Nhà bị lạc mất một chú mèo con.',
        breakdown: '家里 (Trong nhà) + 走了 (Đi mất) + 一只小猫 (Biến mất)'
      }
    ]
  }
];

export const SPATIAL_MISTAKE_RULES: SpatialMistakeRule[] = [
  {
    id: 'rule_1',
    title: 'Đại Kỵ 1: CẤM dùng "在" trước chủ ngữ nơi chốn trong câu tồn hiện',
    ruleDescription: 'Trong câu tồn hiện, cụm từ chỉ nơi chốn đóng vai trò là CHỦ NGỮ đứng đầu câu. Tuyệt đối không thêm giới từ "在" vào trước.',
    whyWrong: 'Thêm "在" sẽ biến chủ ngữ thành trạng ngữ chỉ địa điểm, làm câu bị khuyết chủ ngữ.',
    wrongExample: '在桌子上放着一本书。 (Sai nghiêm trọng)',
    correctExample: '桌子上放着一本书。 (Đúng)',
    pinyin: 'Zhuōzi shang fàng zhe yì běn shū.',
    vietnamese: 'Trên bàn đang đặt một cuốn sách.'
  },
  {
    id: 'rule_2',
    title: 'Đại Kỵ 2: Người hoặc Vật KHÔNG ĐƯỢC trực tiếp làm từ chỉ nơi chốn',
    ruleDescription: 'Danh từ hoặc đại từ chỉ người/vật (tôi, bạn, giáo viên, bác sĩ) không thể tự mình chỉ địa điểm. Muốn biến thành nơi chốn BẮT BUỘC phải thêm "这儿" (chỗ này) hoặc "那儿" (chỗ kia).',
    whyWrong: 'Người là thực thể sống, không phải là tọa độ không gian.',
    wrongExample: '你明天来我。/ 字典在王老师。(Sai ngữ pháp)',
    correctExample: '你明天来我这儿。/ 字典在王老师那儿。(Đúng)',
    pinyin: 'Nǐ míngtiān lái wǒ zhèr. / Zìdiǎn zài Wáng lǎoshī nàr.',
    vietnamese: 'Ngày mai bạn đến chỗ tôi nhé. / Cuốn từ điển đang ở chỗ thầy Vương.'
  },
  {
    id: 'rule_3',
    title: 'Đại Kỵ 3: CẤM thêm "里" sau tên quốc gia, thành phố, địa danh riêng',
    ruleDescription: 'Sau tên nước (Trung Quốc, Việt Nam, Nhật Bản) hoặc địa danh riêng (Bắc Kinh, Thượng Hải, Hà Nội), tuyệt đối KHÔNG thêm phương vị từ "里" hay "里面".',
    whyWrong: 'Địa danh hành chính đã tự thân mang nghĩa phạm vi không gian trọn vẹn.',
    wrongExample: '我在中国里学汉语。/ 他在北京里面工作。(Sai)',
    correctExample: '我在中国学汉语。/ 他在北京工作。(Đúng)',
    pinyin: 'Wǒ zài Zhōngguó xué hànyǔ. / Tā zài Běijīng gōngzuò.',
    vietnamese: 'Tôi học tiếng Trung ở Trung Quốc. / Anh ấy làm việc ở Bắc Kinh.'
  },
  {
    id: 'rule_4',
    title: 'Đại Kỵ 4: Tân ngữ câu tồn hiện PHẢI là đối tượng chưa xác định',
    ruleDescription: 'Sau cụm "Động từ + 着/了" trong câu tồn hiện, tân ngữ bắt buộc phải là đối tượng mới hoặc chưa xác định (thường có số lượng từ như 一个, 几本, 很多). Tuyệt đối KHÔNG dùng "这" (này), "那" (kia) hay tên người cụ thể.',
    whyWrong: 'Câu tồn hiện mang bản chất thông báo về sự tồn tại của một sự vật mới trong tầm mắt, không dùng cho sự vật đã biết cụ thể từ trước.',
    wrongExample: '桌子上放着这本书。/ 门外站着小明。(Sai trong câu tồn hiện)',
    correctExample: '桌子上放着一本书。/ 门外站着一个人。(Đúng)',
    pinyin: 'Zhuōzi shang fàng zhe yì běn shū. / Mén wài zhàn zhe yí gè rén.',
    vietnamese: 'Trên bàn đang đặt một cuốn sách. / Ngoài cửa đang đứng một người.'
  }
];

export const SPATIAL_QUIZ_QUESTIONS: SpatialQuizQuestion[] = [
  {
    id: 'sq_1',
    prompt: 'Chọn câu ĐÚNG ngữ pháp biểu thị sự tồn tại (Câu tồn hiện):',
    sentence: 'Trên tường đang treo một bức tranh sơn dầu rất đẹp.',
    pinyin: 'Qiáng shang guà zhe yì zhāng hěn piàoliang de yóuhuà.',
    vietnamese: 'Trên tường đang treo một bức tranh sơn dầu rất đẹp.',
    options: [
      '在墙上挂着一张很漂亮的油画。',
      '墙上挂着一张很漂亮的油画。',
      '墙上挂着这张很漂亮的油画。',
      '墙里挂着一张很漂亮的油画。'
    ],
    correctIndex: 1,
    explanation: 'Chủ ngữ nơi chốn trong câu tồn hiện tuyệt đối không có "在" (loại câu 1), tân ngữ không dùng "这" (loại câu 3), trên bề mặt tường dùng "墙上" chứ không dùng "墙里" (loại câu 4).',
    category: 'existential'
  },
  {
    id: 'sq_2',
    prompt: 'Điền từ thích hợp: "如果你有问题，随时来我______。"',
    sentence: 'Rúguǒ nǐ yǒu wèntí, suíshí lái wǒ ______.',
    pinyin: 'Rúguǒ nǐ yǒu wèntí, suíshí lái wǒ ______.',
    vietnamese: 'Nếu bạn có thắc mắc, cứ đến chỗ tôi bất cứ lúc nào.',
    options: [
      '里边',
      '这儿',
      '地方',
      '中间'
    ],
    correctIndex: 1,
    explanation: 'Đại từ chỉ người "我" không thể làm nơi chốn, phải thêm "这儿" (chỗ tôi) hoặc "那儿" để tạo thành từ chỉ địa điểm.',
    category: 'rule'
  },
  {
    id: 'sq_3',
    prompt: 'Chọn câu biểu đạt ĐÚNG về nơi làm việc tại thành phố:',
    sentence: 'Anh ấy đang làm việc ở Thượng Hải.',
    pinyin: 'Tā zài Shànghǎi gōngzuò.',
    vietnamese: 'Anh ấy đang làm việc ở Thượng Hải.',
    options: [
      '他在上海里面工作。',
      '他在上海里工作。',
      '他在上海工作。',
      '他工作在上海里。'
    ],
    correctIndex: 2,
    explanation: 'Sau tên địa danh riêng hoặc tên thành phố/quốc gia (như 上海, 北京, 中国), tuyệt đối không thêm phương vị từ "里" hay "里面".',
    category: 'rule'
  },
  {
    id: 'sq_4',
    prompt: 'Điền phương vị từ thích hợp: "银行在超市的______，过一条马路就到了。"',
    sentence: 'Yínháng zài chāoshì de ______, guò yì tiáo mǎlù jiù dào le.',
    pinyin: 'Yínháng zài chāoshì de ______, guò yì tiáo mǎlù jiù dào le.',
    vietnamese: 'Ngân hàng ở ______ siêu thị, qua một con đường là tới.',
    options: [
      '对面 (Đối diện)',
      '中间 (Ở giữa)',
      '底下 (Bên dưới)',
      '里边 (Bên trong)'
    ],
    correctIndex: 0,
    explanation: 'Gợi ý "qua một con đường là tới" (过一条马路就到了) chỉ vị trí đối diện qua đường ➔ Chọn "对面 (duìmiàn)".',
    category: 'direction'
  },
  {
    id: 'sq_5',
    prompt: 'Chọn câu sử dụng cấu trúc "Động từ + 着" đúng chuẩn:',
    sentence: 'Trước cửa đang đỗ một chiếc xe đạp màu xanh lá cây.',
    pinyin: 'Mén kǒu tíng zhe yí liàng lǜsè de zìxíngchē.',
    vietnamese: 'Trước cửa đang đỗ một chiếc xe đạp màu xanh lá cây.',
    options: [
      '门口停了一辆绿色的自行车。',
      '在门口停着一辆绿色的自行车。',
      '门口停着一辆绿色的自行车。',
      '门口停着这辆绿色的自行车。'
    ],
    correctIndex: 2,
    explanation: '"门口" là chủ ngữ nơi chốn (không có "在"), động từ "停着" biểu thị trạng thái đỗ xe duy trì ổn định, tân ngữ "一辆" là số lượng từ chưa xác định.',
    category: 'existential'
  },
  {
    id: 'sq_6',
    prompt: 'Điền từ thích hợp vào cấu trúc: "小李坐在小王和小张的______。"',
    sentence: 'Xiǎo Lǐ zuò zài Xiǎo Wáng hé Xiǎo Zhāng de ______.',
    pinyin: 'Xiǎo Lǐ zuò zài Xiǎo Wáng hé Xiǎo Zhāng de ______.',
    vietnamese: 'Tiểu Lý ngồi ở ______ Tiểu Vương và Tiểu Trương.',
    options: [
      '旁边 (Bên cạnh)',
      '中间 (Ở giữa)',
      '对面 (Đối diện)',
      '周围 (Xung quanh)'
    ],
    correctIndex: 1,
    explanation: 'Cấu trúc "在 A 和 B 的中间" nghĩa là "ở giữa A và B". Do có hai người A và B nên từ chính xác nhất là "中间 (zhōngjiān)".',
    category: 'direction'
  },
  {
    id: 'sq_7',
    prompt: 'Chọn câu diễn tả sự xuất hiện người mới (Câu tồn hiện xuất hiện):',
    sentence: 'Phòng học vừa bước vào một vị giáo viên mới.',
    pinyin: 'Jiàoshì li zǒu jìn lai le yí wèi xīn lǎoshī.',
    vietnamese: 'Phòng học vừa bước vào một vị giáo viên mới.',
    options: [
      '教室里走进来了一位新老师。',
      '在教室里走进来了一位新老师。',
      '教室里走进了那位新老师。',
      '教室里面走进来新老师了。'
    ],
    correctIndex: 0,
    explanation: 'Mẫu câu tồn hiện xuất hiện: Nơi chốn (教室里) + Động từ xu hướng (走进来) + 了 + Tân ngữ chưa xác định (一位新老师).',
    category: 'existential'
  },
  {
    id: 'sq_8',
    prompt: 'Cặp phương vị từ nào sau đây là TRÁI NGHĨA trực tiếp của nhau?',
    sentence: 'Phía Đông (东) đối lập với phía nào?',
    pinyin: 'Dōngbian hé nǎge fāngwèicí xiāngduì?',
    vietnamese: 'Phía Đông (东) đối lập với phía nào?',
    options: [
      '东 vs 南',
      '东 vs 西',
      '东 vs 北',
      '左 vs 前'
    ],
    correctIndex: 1,
    explanation: 'Đông (东 dōng) đối diện trực tiếp với Tây (西 xī), Nam (南 nán) đối lập với Bắc (北 běi).',
    category: 'direction'
  },
  {
    id: 'sq_9',
    prompt: 'Điền từ thích hợp: "桌子上______三杯茶，请大家喝。"',
    sentence: 'Zhuōzi shang ______ sān bēi chá, qǐng dàjiā hē.',
    pinyin: 'Zhuōzi shang ______ sān bēi chá, qǐng dàjiā hē.',
    vietnamese: 'Trên bàn ______ 3 tách trà, mời mọi người uống.',
    options: [
      '放着',
      '放了着',
      '在放',
      '是放'
    ],
    correctIndex: 0,
    explanation: 'Cấu trúc biểu thị sự duy trì trạng thái đồ vật: Động từ + 着 ➔ "放着" (đang đặt/đang để).',
    category: 'existential'
  },
  {
    id: 'sq_10',
    prompt: 'Tại sao câu "在院子里种着很多树" bị coi là sai ngữ pháp trong đề thi?',
    sentence: 'Zài yuànzi li zhòng zhe hěn duō shù.',
    pinyin: 'Zài yuànzi li zhòng zhe hěn duō shù.',
    vietnamese: 'Tại sao câu trên bị coi là sai ngữ pháp?',
    options: [
      'Vì thiếu trợ từ 了',
      'Vì có chữ "在" làm câu mất chủ ngữ trong câu tồn hiện',
      'Vì "很多树" không có số lượng cụ thể',
      'Vì từ "种" không được đi với "着"'
    ],
    correctIndex: 1,
    explanation: 'Đại kỵ 1 của câu tồn hiện: Nơi chốn làm chủ ngữ đứng đầu câu, có chữ "在" sẽ biến chủ ngữ thành trạng ngữ khiến câu cụt, vô chủ.',
    category: 'rule'
  }
];
