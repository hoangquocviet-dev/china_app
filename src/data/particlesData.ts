export interface ParticleExample {
  chinese: string;
  pinyin: string;
  meaning: string;
  highlightWord: string;
}

export interface ParticleItem {
  id: string;
  hanzi: string;
  pinyin: string;
  name: string;
  nickname: string; // e.g. "Bạch thược Đích (白勺的)"
  category: 'structural' | 'aspect' | 'modal';
  categoryName: string;
  formula: string;
  usageRule: string;
  memoryMnemonic: string; // Câu thần chú ghi nhớ
  examples: ParticleExample[];
  commonMistake?: {
    wrong: string;
    right: string;
    explanation: string;
  };
}

export interface ParticleQuizItem {
  id: string;
  sentence: string; // with blank: "他跑___很快。"
  pinyin: string;
  meaning: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  particleType: 'de_distinction' | 'aspect_particle' | 'modal_particle';
}

export const THREE_DE_SUMMARY = {
  title: 'Khẩu Quyết Vàng Phân Biệt 3 Chữ "ĐÍCH" (的三的)',
  goldenPoem: [
    'Trắng (白勺) đứng trước Danh từ: dùng 的 (Bạch thược Đích)',
    'Đất (土地) đứng trước Động từ: dùng 地 (Thổ địa Địa)',
    'Kép (双人) theo sau Động/Tính từ: dùng 得 (Song nhân Đắc)',
  ],
  masterSentence: {
    chinese: '他高兴地对我说，我的汉语考得很好！',
    pinyin: 'Tā gāoxìng de duì wǒ shuō, wǒ de hànyǔ kǎo de hěn hǎo!',
    meaning: 'Anh ấy vui vẻ (地) nói với tôi rằng, tiếng Trung của tôi (的) thi được (得) rất tốt!',
  },
};

export const PARTICLES_LIST: ParticleItem[] = [
  // 1. Structural Particles (Trợ từ kết cấu: 的, 得, 地)
  {
    id: 'pt-de-1',
    hanzi: '的',
    pinyin: 'de',
    name: 'Trợ từ kết cấu 的 (Sở hữu / Định ngữ)',
    nickname: 'Bạch thược Đích (白勺的)',
    category: 'structural',
    categoryName: 'Trợ từ kết cấu',
    formula: 'Định ngữ (Tính từ / Đại từ / Danh từ) + 的 + Danh từ trung tâm',
    usageRule: 'Dùng khi bổ nghĩa hoặc biểu thị quan hệ sở hữu cho một DANH TỪ phía sau. Phía sau "的" luôn là Danh từ.',
    memoryMnemonic: 'Nhìn phía sau là Đồ vật, Con người (Danh từ) ➔ 100% chọn 的 (trắng)!',
    examples: [
      {
        chinese: '这是我的汉语词典。',
        pinyin: 'Zhè shì wǒ de hànyǔ cídiǎn.',
        meaning: 'Đây là từ điển tiếng Trung của tôi.',
        highlightWord: '我的',
      },
      {
        chinese: '她是一个很漂亮的女孩。',
        pinyin: 'Tā shì yí gè hěn piàoliang de nǚhái.',
        meaning: 'Cô ấy là một cô gái rất xinh đẹp.',
        highlightWord: '漂亮的',
      },
      {
        chinese: '北京的天气怎么样？',
        pinyin: 'Běijīng de tiānqì zěnmeyàng?',
        meaning: 'Thời tiết của Bắc Kinh thế nào?',
        highlightWord: '北京的',
      },
    ],
    commonMistake: {
      wrong: '跑的很快 (Sai)',
      right: '跑得很快 (Đúng)',
      explanation: 'Phía sau là mức độ "很快" (rất nhanh) bổ nghĩa cho hành động chạy "跑", bắt buộc dùng "得", không dùng "的".',
    },
  },
  {
    id: 'pt-de-2',
    hanzi: '得',
    pinyin: 'de',
    name: 'Trợ từ kết cấu 得 (Bổ ngữ trạng thái / Trình độ)',
    nickname: 'Song nhân Đắc (双人得)',
    category: 'structural',
    categoryName: 'Trợ từ kết cấu',
    formula: 'Động từ / Tính từ + 得 + Bổ ngữ (Trạng thái / Mức độ / Khả năng)',
    usageRule: 'Đứng sau ĐỘNG TỪ hoặc TÍNH TỪ để dẫn ra mức độ, kết quả hoặc trạng thái thực hiện hành động (như thế nào, ra sao).',
    memoryMnemonic: 'Nhìn phía trước là Động từ, phía sau là tính từ đánh giá (tốt, nhanh, giỏi...) ➔ Chọn 得!',
    examples: [
      {
        chinese: '他说汉语说得非常流利。',
        pinyin: 'Tā shuō hànyǔ shuō de fēicháng liúlì.',
        meaning: 'Anh ấy nói tiếng Trung nói rất trôi chảy.',
        highlightWord: '说得',
      },
      {
        chinese: '昨天晚上我睡得很好。',
        pinyin: 'Zuótiān wǎnshang wǒ shuì de hěn hǎo.',
        meaning: 'Tối hôm qua tôi ngủ rất ngon giấc.',
        highlightWord: '睡得',
      },
      {
        chinese: '听到这个好消息，他高兴得跳了起来。',
        pinyin: 'Tīngdào zhège hǎo xiāoxi, tā gāoxìng de tiào le qǐlái.',
        meaning: 'Nghe tin vui này, anh ấy mừng đến mức nhảy cẫng lên.',
        highlightWord: '高兴得',
      },
    ],
    commonMistake: {
      wrong: '他写字写的很漂亮 (Sai)',
      right: '他写字写得很漂亮 (Đúng)',
      explanation: 'Sau động từ lặp lại "写" là nhận xét mức độ "很漂亮", phải dùng "得".',
    },
  },
  {
    id: 'pt-de-3',
    hanzi: '地',
    pinyin: 'de',
    name: 'Trợ từ kết cấu 地 (Trạng ngữ nối Động từ)',
    nickname: 'Thổ địa Địa (土地地)',
    category: 'structural',
    categoryName: 'Trợ từ kết cấu',
    formula: 'Trạng ngữ (Tính từ / Phó từ mô tả cách thức) + 地 + Động từ',
    usageRule: 'Đứng trước ĐỘNG TỪ để mô tả cách thức, thái độ hoặc tâm thế diễn ra của hành động (một cách...).',
    memoryMnemonic: 'Nhìn phía sau là Hành động (Động từ) ➔ Chọn 地 (đất)! Tương đương hậu tố "-ly" trong tiếng Anh.',
    examples: [
      {
        chinese: '同学们正在认真地听课。',
        pinyin: 'Tóngxuémen zhèngzài rènzhēn de tīngkè.',
        meaning: 'Các bạn học sinh đang chăm chú (một cách nghiêm túc) nghe giảng.',
        highlightWord: '认真地',
      },
      {
        chinese: '老人慢慢地走过马路。',
        pinyin: 'Lǎorén mànmàn de zǒu guò mǎlù.',
        meaning: 'Cụ già chầm chậm (một cách từ từ) bước qua đường.',
        highlightWord: '慢慢地',
      },
      {
        chinese: '大家高兴地唱起歌来。',
        pinyin: 'Dàjiā gāoxìng de chàng qǐ gē lái.',
        meaning: 'Mọi người vui vẻ cùng nhau cất tiếng hát.',
        highlightWord: '高兴地',
      },
    ],
    commonMistake: {
      wrong: '他认真的看书 (Dễ nhầm)',
      right: '他认真地看书 (Chuẩn văn phong)',
      explanation: 'Trước động từ "看书" cần trợ từ trạng ngữ "地", không nên lạm dụng "的".',
    },
  },

  // 2. Aspect Particles (Trợ từ động thái: 了, 着, 过)
  {
    id: 'pt-aspect-le',
    hanzi: '了',
    pinyin: 'le',
    name: 'Trợ từ động thái & ngữ khí 了 (Hoàn thành / Biến đổi)',
    nickname: 'Trợ từ "Liễu" (了)',
    category: 'aspect',
    categoryName: 'Trợ từ động thái',
    formula: 'Động từ + 了 (Động thái hoàn thành) | Cuối câu + 了 (Biến đổi tình thái mới)',
    usageRule: '1) Đứng sau Động từ biểu thị động tác đã hoàn thành hoặc thực hiện xong. 2) Đứng cuối câu biểu thị sự xuất hiện tình huống mới, sự thay đổi trạng thái (trời mưa rồi, biết rồi).',
    memoryMnemonic: '"Xong xuôi" hoặc "Tình huống mới phát sinh" ➔ Dùng 了!',
    examples: [
      {
        chinese: '我吃了早饭就去上班。',
        pinyin: 'Wǒ chī le zǎofàn jiù qù shàngbān.',
        meaning: 'Tôi ăn xong bữa sáng là đi làm ngay.',
        highlightWord: '吃了',
      },
      {
        chinese: '下雨了，出门记得带伞！',
        pinyin: 'Xiàyǔ le, chūmén jìde dài sǎn!',
        meaning: 'Trời đổ mưa rồi, ra ngoài nhớ mang theo ô nhé!',
        highlightWord: '下雨了',
      },
      {
        chinese: '我已经懂了。',
        pinyin: 'Wǒ yǐjīng dǒng le.',
        meaning: 'Tôi đã hiểu ra rồi.',
        highlightWord: '懂了',
      },
    ],
    commonMistake: {
      wrong: '我昨天没去了学校 (Sai nghiêm trọng)',
      right: '我昨天没去学校 (Đúng)',
      explanation: 'Trong câu phủ định với 没 / 没有, TUYỆT ĐỐI KHÔNG ĐƯỢC dùng "了" ở sau động từ!',
    },
  },
  {
    id: 'pt-aspect-zhe',
    hanzi: '着',
    pinyin: 'zhe',
    name: 'Trợ từ động thái 着 (Duy trì trạng thái / Đang)',
    nickname: 'Trợ từ "Trước" (着)',
    category: 'aspect',
    categoryName: 'Trợ từ động thái',
    formula: 'Động từ + 着 (+ Tân ngữ) | Động từ 1 + 着 + Động từ 2',
    usageRule: 'Biểu thị hành động hoặc trạng thái đang được tiếp diễn, duy trì tư thế liên tục (cửa đang mở, đang mặc áo khoác, đứng nói chuyện).',
    memoryMnemonic: 'Trạng thái đang "treo/giữ nguyên tư thế" ➔ Dùng 着!',
    examples: [
      {
        chinese: '门开着呢，请进吧。',
        pinyin: 'Mén kāi zhe ne, qǐng jìn ba.',
        meaning: 'Cửa đang mở đấy, xin mời vào.',
        highlightWord: '开着',
      },
      {
        chinese: '他手里拿着一本书。',
        pinyin: 'Tā shǒulǐ ná zhe yì běn shū.',
        meaning: 'Trong tay anh ấy đang cầm một quyển sách.',
        highlightWord: '拿着',
      },
      {
        chinese: '他们坐着聊了很久。',
        pinyin: 'Tāmen zuò zhe liáo le hěn jiǔ.',
        meaning: 'Họ ngồi (vừa ngồi vừa) trò chuyện rất lâu.',
        highlightWord: '坐着',
      },
    ],
  },
  {
    id: 'pt-aspect-guo',
    hanzi: '过',
    pinyin: 'guo',
    name: 'Trợ từ động thái 过 (Từng trải qua / Từng làm)',
    nickname: 'Trợ từ "Quá" (过)',
    category: 'aspect',
    categoryName: 'Trợ từ động thái',
    formula: 'Chủ ngữ + Động từ + 过 (+ Tân ngữ) | Phủ định: 没 / 没有 + Động từ + 过',
    usageRule: 'Biểu thị một hành động hay trải nghiệm đã từng xảy ra trong quá khứ và nay không còn tiếp diễn nữa (tương đương "đã từng" trong tiếng Việt).',
    memoryMnemonic: 'Nói về trải nghiệm "từng đi đâu, từng ăn gì, từng gặp ai" ➔ Dùng 过!',
    examples: [
      {
        chinese: '你去过中国吗？',
        pinyin: 'Nǐ qù guo zhōngguó ma?',
        meaning: 'Bạn đã từng đi Trung Quốc chưa?',
        highlightWord: '去过',
      },
      {
        chinese: '我吃过北京烤鸭，非常好吃。',
        pinyin: 'Wǒ chī guo Běijīng kǎoyā, fēicháng hǎochī.',
        meaning: 'Tôi đã từng ăn vịt quay Bắc Kinh, rất ngon.',
        highlightWord: '吃过',
      },
      {
        chinese: '我从没学过法语。',
        pinyin: 'Wǒ cóng méi xué guo fǎyǔ.',
        meaning: 'Tôi chưa bao giờ từng học tiếng Pháp.',
        highlightWord: '没学过',
      },
    ],
  },

  // 3. Modal Particles (Trợ từ ngữ khí cuối câu: 吧, 呢, 吗, 啊)
  {
    id: 'pt-modal-ba',
    hanzi: '吧',
    pinyin: 'ba',
    name: 'Trợ từ ngữ khí 吧 (Đề xuất / Phỏng đoán / Đồng ý)',
    nickname: 'Trợ từ "Ba" (吧)',
    category: 'modal',
    categoryName: 'Trợ từ ngữ khí',
    formula: 'Cuối câu + 吧',
    usageRule: '1) Rủ rê, đề xuất nhẹ nhàng ("đi thôi nhé", "ăn đi nào"). 2) Phỏng đoán với độ chắc chắn khá cao ("chắc là anh ấy nhỉ?"). 3) Đồng ý miễn cưỡng ("thôi được rồi").',
    memoryMnemonic: 'Đề nghị, gợi ý, rủ rê ("nhé, đi, nha") ➔ Đặt 吧 cuối câu!',
    examples: [
      {
        chinese: '时间不早了，我们走吧！',
        pinyin: 'Shíjiān bù zǎo le, wǒmen zǒu ba!',
        meaning: 'Thời gian không còn sớm nữa, tụi mình đi thôi nào!',
        highlightWord: '走吧',
      },
      {
        chinese: '你也是越南人吧？',
        pinyin: 'Nǐ yě shì yuènánrén ba?',
        meaning: 'Bạn chắc cũng là người Việt Nam nhỉ?',
        highlightWord: '人吧',
      },
      {
        chinese: '好吧，那就听你的。',
        pinyin: 'Hǎo ba, nà jiù tīng nǐ de.',
        meaning: 'Được thôi, vậy thì nghe theo bạn.',
        highlightWord: '好吧',
      },
    ],
  },
  {
    id: 'pt-modal-ne',
    hanzi: '呢',
    pinyin: 'ne',
    name: 'Trợ từ ngữ khí 呢 (Hỏi ngược lại / Tiếp diễn / Nhấn mạnh)',
    nickname: 'Trợ từ "Ni" (呢)',
    category: 'modal',
    categoryName: 'Trợ từ ngữ khí',
    formula: 'Danh từ/Đại từ + 呢？ | (正在) + Động từ + ... + 呢',
    usageRule: '1) Hỏi vắn tắt đối tượng ("còn ... thì sao?"). 2) Đứng cuối câu kết hợp với 正在/正/在 biểu thị hành động đang tiếp diễn ("đang làm gì đấy").',
    memoryMnemonic: '"Còn bạn thì sao?" (你呢?) & "Đang diễn ra nhé" ➔ Dùng 呢!',
    examples: [
      {
        chinese: '我喜欢喝茶，你呢？',
        pinyin: 'Wǒ xǐhuan hē chá, nǐ ne?',
        meaning: 'Tôi thích uống trà, còn bạn thì sao?',
        highlightWord: '你呢',
      },
      {
        chinese: '妈妈正在厨房做饭呢。',
        pinyin: 'Māma zhèngzài chúfáng zuòfàn ne.',
        meaning: 'Mẹ đang nấu cơm trong bếp đấy.',
        highlightWord: '做饭呢',
      },
      {
        chinese: '我的手机呢？你看到了吗？',
        pinyin: 'Wǒ de shǒujī ne? Nǐ kàndào le ma?',
        meaning: 'Điện thoại của tôi đâu rồi nhỉ? Bạn có thấy không?',
        highlightWord: '手机呢',
      },
    ],
  },
  {
    id: 'pt-modal-ma',
    hanzi: '吗',
    pinyin: 'ma',
    name: 'Trợ từ ngữ khí 吗 (Nghi vấn Có/Không)',
    nickname: 'Trợ từ "Ma" (吗)',
    category: 'modal',
    categoryName: 'Trợ từ ngữ khí',
    formula: 'Câu trần thuật + 吗？',
    usageRule: 'Biến một câu trần thuật thành câu hỏi Nghi vấn toàn thể Có / Không (tương đương "...không?", "...phải không?" trong tiếng Việt).',
    memoryMnemonic: 'Câu hỏi có / không đơn thuần ➔ Đặt 吗 cuối câu!',
    examples: [
      {
        chinese: '你认识李老师吗？',
        pinyin: 'Nǐ rènshi Lǐ lǎoshī ma?',
        meaning: 'Bạn có quen biết thầy giáo Lý không?',
        highlightWord: '老师吗',
      },
      {
        chinese: '这是你的雨伞吗？',
        pinyin: 'Zhè shì nǐ de yǔsǎn ma?',
        meaning: 'Đây là cái ô che mưa của bạn phải không?',
        highlightWord: '雨伞吗',
      },
      {
        chinese: '今天天气冷吗？',
        pinyin: 'Jīntiān tiānqì lěng ma?',
        meaning: 'Hôm nay thời tiết có lạnh không?',
        highlightWord: '冷吗',
      },
    ],
    commonMistake: {
      wrong: '你是哪国人吗？ (Sai nghiêm trọng)',
      right: '你是哪国人？ (Đúng)',
      explanation: 'Trong câu đã có đại từ nghi vấn (như 哪, 谁, 什么, 怎么, 几...), TUYỆT ĐỐI KHÔNG ĐƯỢC thêm "吗" vào cuối câu!',
    },
  },
];

export const PARTICLES_QUIZ_LIST: ParticleQuizItem[] = [
  {
    id: 'q-pt-1',
    sentence: '他跑___非常快，我们都追不上他。',
    pinyin: 'Tā pǎo ___ fēicháng kuài, wǒmen dōu zhuī bú shàng tā.',
    meaning: 'Anh ấy chạy rất nhanh, chúng tôi đều đuổi không kịp.',
    options: ['的', '得', '地', '了'],
    correctIndex: 1,
    explanation: 'Sau động từ "跑" là mức độ trạng thái "非常快", cần dùng trợ từ kết cấu "得" (Song nhân đắc).',
    particleType: 'de_distinction',
  },
  {
    id: 'q-pt-2',
    sentence: '她是一个很善良___女孩。',
    pinyin: 'Tā shì yí gè hěn shànliáng ___ nǚhái.',
    meaning: 'Cô ấy là một cô gái rất lương thiện.',
    options: ['地', '得', '的', '着'],
    correctIndex: 2,
    explanation: 'Phía sau là danh từ "女孩" (cô gái), phía trước là tính từ định ngữ "很善良", phải dùng "的" (Bạch thược đích).',
    particleType: 'de_distinction',
  },
  {
    id: 'q-pt-3',
    sentence: '同学们认真___听老师讲课。',
    pinyin: 'Tóngxuémen rènzhēn ___ tīng lǎoshī jiǎngkè.',
    meaning: 'Các bạn học sinh chăm chú nghe thầy giáo giảng bài.',
    options: ['的', '得', '地', '过'],
    correctIndex: 2,
    explanation: 'Phía sau là cụm động từ "听老师讲课", phía trước là tính từ mô tả cách thức "认真", phải dùng "地" (Thổ địa địa).',
    particleType: 'de_distinction',
  },
  {
    id: 'q-pt-4',
    sentence: '我以前去___中国，那里的风景很美。',
    pinyin: 'Wǒ yǐqián qù ___ zhōngguó, nàlǐ de fēngjǐng hěn měi.',
    meaning: 'Tôi trước đây từng đi Trung Quốc, phong cảnh ở đó rất đẹp.',
    options: ['着', '过', '得', '呢'],
    correctIndex: 1,
    explanation: 'Nói về trải nghiệm trong quá khứ ("đã từng đi"), dùng trợ từ động thái "过".',
    particleType: 'aspect_particle',
  },
  {
    id: 'q-pt-5',
    sentence: '外面下雨___，我们别出去了。',
    pinyin: 'Wàimiàn xiàyǔ ___ , wǒmen bié chūqù le.',
    meaning: 'Bên ngoài đổ mưa rồi, tụi mình đừng ra ngoài nữa.',
    options: ['过', '着', '了', '吗'],
    correctIndex: 2,
    explanation: 'Biểu thị sự việc mới phát sinh, biến đổi trạng thái thời tiết ("đổ mưa rồi"), dùng "了".',
    particleType: 'aspect_particle',
  },
  {
    id: 'q-pt-6',
    sentence: '天黑了，我们赶紧回家___！',
    pinyin: 'Tiān hēi le, wǒmen gǎnjǐn huíjiā ___ !',
    meaning: 'Trời tối rồi, tụi mình mau về nhà thôi!',
    options: ['吧', '吗', '呢', '得'],
    correctIndex: 0,
    explanation: 'Đưa ra lời gợi ý, thúc giục rủ rê nhẹ nhàng ("về nhà thôi!"), dùng trợ từ ngữ khí "吧".',
    particleType: 'modal_particle',
  },
  {
    id: 'q-pt-7',
    sentence: '我喜欢吃米饭，你___？',
    pinyin: 'Wǒ xǐhuan chī mǐfàn, nǐ ___ ?',
    meaning: 'Tôi thích ăn cơm, còn bạn thì sao?',
    options: ['吗', '吧', '呢', '了'],
    correctIndex: 2,
    explanation: 'Câu hỏi tỉnh lược hỏi ngược lại đối tượng ("Còn bạn thì sao?"), dùng "你呢？".',
    particleType: 'modal_particle',
  },
  {
    id: 'q-pt-8',
    sentence: '墙上挂___一张中国地图。',
    pinyin: 'Qiáng shàng guà ___ yì zhāng zhōngguó dìtú.',
    meaning: 'Trên tường đang treo một tấm bản đồ Trung Quốc.',
    options: ['着', '过', '得', '吧'],
    correctIndex: 0,
    explanation: 'Biểu thị trạng thái đang duy trì liên tục của vật (bản đồ đang được treo trên tường), dùng trợ từ động thái "着".',
    particleType: 'aspect_particle',
  },
];
