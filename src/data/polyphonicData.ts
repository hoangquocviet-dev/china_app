export interface PolyphonicReading {
  pinyin: string;
  tone: number;
  meaning: string;
  pos: string; // Từ loại
  words: string[];
  example: {
    chinese: string;
    pinyin: string;
    meaning: string;
  };
}

export interface PolyphonicCharacter {
  id: string;
  hanzi: string;
  hanviet: string;
  readings: PolyphonicReading[];
  masterContrastSentence?: {
    chinese: string;
    pinyin: string;
    meaning: string;
  };
  memoryTip: string;
}

export interface PolyphonicQuizItem {
  id: string;
  prompt: string;
  sentence: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const POLYPHONIC_CHARACTERS: PolyphonicCharacter[] = [
  {
    id: 'poly-chang-zhang',
    hanzi: '长',
    hanviet: 'TRƯỜNG / TRƯỞNG',
    memoryTip: 'Đo chiều dài là "cháng" (dài); lớn lên, làm thủ lĩnh là "zhǎng" (trưởng).',
    masterContrastSentence: {
      chinese: '小明长得很高，他的头发也很长。',
      pinyin: 'Xiǎomíng zhǎng de hěn gāo, tā de tóufa yě hěn cháng.',
      meaning: 'Tiểu Minh lớn lên (zhǎng) rất cao, tóc của cậu ấy cũng rất dài (cháng).',
    },
    readings: [
      {
        pinyin: 'cháng',
        tone: 2,
        meaning: 'Dài (khoảng cách, thời gian)',
        pos: 'Tính từ',
        words: ['很长', '长江', '特长', '长假'],
        example: {
          chinese: '长江是中国最长的河流。',
          pinyin: 'Chángjiāng shì zhōngguó zuì cháng de héliú.',
          meaning: 'Trường Giang là con sông dài nhất của Trung Quốc.',
        },
      },
      {
        pinyin: 'zhǎng',
        tone: 3,
        meaning: 'Lớn lên, trưởng thành, người đứng đầu',
        pos: 'Động từ / Danh từ',
        words: ['长大', '校长', '长辈', '队长'],
        example: {
          chinese: '李老师是我们的新校长。',
          pinyin: 'Lǐ lǎoshī shì wǒmen de xīn xiàozhǎng.',
          meaning: 'Thầy Lý là hiệu trưởng mới của chúng tôi.',
        },
      },
    ],
  },
  {
    id: 'poly-xing-hang',
    hanzi: '行',
    hanviet: 'HÀNH / HÀNG',
    memoryTip: 'Đi lại, được phép là "xíng"; ngân hàng, ngành nghề là "háng".',
    masterContrastSentence: {
      chinese: '去银行办完事，他步行回了家。',
      pinyin: 'Qù yínháng bàn wán shì, tā bùxíng huí le jiā.',
      meaning: 'Đến ngân hàng (háng) giải quyết xong việc, anh ấy đi bộ (xíng) về nhà.',
    },
    readings: [
      {
        pinyin: 'xíng',
        tone: 2,
        meaning: 'Đi lại, được, hành vi, năng lực',
        pos: 'Động từ / Tính từ',
        words: ['行人', '不行', '行动', '自行车'],
        example: {
          chinese: '明天早上八点见，行不行？',
          pinyin: 'Míngtiān zǎoshang bā diǎn jiàn, xíng bù xíng?',
          meaning: 'Sáng mai 8 giờ gặp nhau, được không?',
        },
      },
      {
        pinyin: 'háng',
        tone: 2,
        meaning: 'Hàng lối, ngân hàng, ngành nghề',
        pos: 'Danh từ / Lượng từ',
        words: ['银行', '行业', '一行字', '行情'],
        example: {
          chinese: '请问最近的中国银行在哪儿？',
          pinyin: 'Qǐngwèn zuìjìn de Zhōngguó Yínháng zài nǎr?',
          meaning: 'Xin hỏi Ngân hàng Trung Quốc gần nhất ở đâu?',
        },
      },
    ],
  },
  {
    id: 'poly-le-yue',
    hanzi: '乐',
    hanviet: 'LẠC / NHẠC',
    memoryTip: 'Vui vẻ, khoái lạc là "lè"; âm nhạc, nhạc cụ là "yuè".',
    masterContrastSentence: {
      chinese: '听着动人的音乐，他感到很快乐。',
      pinyin: 'Tīngzhe dòngrén de yīnyuè, tā gǎndào hěn kuàilè.',
      meaning: 'Lắng nghe giai điệu âm nhạc (yuè) lay động, anh ấy cảm thấy rất vui vẻ (lè).',
    },
    readings: [
      {
        pinyin: 'lè',
        tone: 4,
        meaning: 'Vui vẻ, khoái lạc, cười',
        pos: 'Tính từ / Động từ',
        words: ['快乐', '乐意', '乐观', '可口可乐'],
        example: {
          chinese: '祝你生日快乐，天天开心！',
          pinyin: 'Zhù nǐ shēngrì kuàilè, tiāntiān kāixīn!',
          meaning: 'Chúc bạn sinh nhật vui vẻ, ngày ngày hạnh phúc!',
        },
      },
      {
        pinyin: 'yuè',
        tone: 4,
        meaning: 'Âm nhạc, bản nhạc, nhạc cụ',
        pos: 'Danh từ',
        words: ['音乐', '乐器', '乐队', '乐谱'],
        example: {
          chinese: '你在听什么流行音乐呢？',
          pinyin: 'Nǐ zài tīng shénme liúxíng yīnyuè ne?',
          meaning: 'Bạn đang nghe bản nhạc thịnh hành nào thế?',
        },
      },
    ],
  },
  {
    id: 'poly-jiao-jiao',
    hanzi: '教',
    hanviet: 'GIÁO',
    memoryTip: 'Dạy học (hành động động từ) đọc thanh 1 "jiāo"; phòng học, giáo dục đọc thanh 4 "jiào".',
    masterContrastSentence: {
      chinese: '王老师在教室里教我们中文。',
      pinyin: 'Wáng lǎoshī zài jiàoshì lǐ jiāo wǒmen zhōngwén.',
      meaning: 'Thầy Vương đang ở trong phòng học (jiào) dạy (jiāo) chúng tôi tiếng Trung.',
    },
    readings: [
      {
        pinyin: 'jiāo',
        tone: 1,
        meaning: 'Dạy dỗ, truyền dạy (hành động)',
        pos: 'Động từ',
        words: ['教书', '教汉语', '请教', '教课'],
        example: {
          chinese: '你能教我怎么用筷子吗？',
          pinyin: 'Nǐ néng jiāo wǒ zěnme yòng kuàizi ma?',
          meaning: 'Bạn có thể dạy tôi cách dùng đũa được không?',
        },
      },
      {
        pinyin: 'jiào',
        tone: 4,
        meaning: 'Giáo dục, phòng học, giáo viên',
        pos: 'Danh từ',
        words: ['教室', '教师', '教育', '教材'],
        example: {
          chinese: '请大家安静，教室里正在考试。',
          pinyin: 'Qǐng dàjiā ānjìng, jiàoshì lǐ zhèngzài kǎoshì.',
          meaning: 'Xin mọi người giữ yên lặng, trong phòng học đang thi.',
        },
      },
    ],
  },
  {
    id: 'poly-pian-bian',
    hanzi: '便',
    hanviet: 'TIỆN',
    memoryTip: 'Giá rẻ là "pián" (便宜); thuận tiện, đi vệ sinh là "biàn".',
    masterContrastSentence: {
      chinese: '这家超市很方便，东西也很便宜。',
      pinyin: 'Zhè jiā chāoshì hěn fāngbiàn, dōngxi yě hěn piányi.',
      meaning: 'Siêu thị này rất thuận tiện (biàn), đồ đạc cũng rất rẻ (pián).',
    },
    readings: [
      {
        pinyin: 'pián',
        tone: 2,
        meaning: 'Rẻ, thuận lợi giá cả (chỉ dùng trong 便宜)',
        pos: 'Tính từ',
        words: ['便宜', '占便宜'],
        example: {
          chinese: '这本书真便宜，只要十块钱。',
          pinyin: 'Zhè běn shū zhēn piányi, zhǐ yào shí kuài qián.',
          meaning: 'Cuốn sách này rẻ thật đấy, chỉ có 10 tệ.',
        },
      },
      {
        pinyin: 'biàn',
        tone: 4,
        meaning: 'Thuận tiện, tiện lợi, tức là',
        pos: 'Tính từ / Phó từ',
        words: ['方便', '便饭', '便当', '便利'],
        example: {
          chinese: '坐地铁去机场又快又方便。',
          pinyin: 'Zuò dìtiě qù jīchǎng yòu kuài yòu fāngbiàn.',
          meaning: 'Đi tàu điện ngầm ra sân bay vừa nhanh vừa thuận tiện.',
        },
      },
    ],
  },
  {
    id: 'poly-jue-jiao',
    hanzi: '觉',
    hanviet: 'GIÁC / GIÁO',
    memoryTip: 'Cảm giác, cảm thấy là "jué"; đi ngủ là "jiào" (睡觉).',
    masterContrastSentence: {
      chinese: '我觉得他该去睡觉了。',
      pinyin: 'Wǒ juéde tā gāi qù shuìjiào le.',
      meaning: 'Tôi cảm thấy (jué) anh ấy nên đi ngủ (jiào) rồi.',
    },
    readings: [
      {
        pinyin: 'jué',
        tone: 2,
        meaning: 'Cảm giác, cảm thấy, nhận biết',
        pos: 'Động từ',
        words: ['觉得', '感觉', '自觉', '知觉'],
        example: {
          chinese: '你觉得今天的天气冷不冷？',
          pinyin: 'Nǐ juéde jīntiān de tiānqì lěng bù lěng?',
          meaning: 'Bạn cảm thấy thời tiết hôm nay có lạnh không?',
        },
      },
      {
        pinyin: 'jiào',
        tone: 4,
        meaning: 'Giấc ngủ',
        pos: 'Danh từ',
        words: ['睡觉', '午觉', '懒觉'],
        example: {
          chinese: '他每天晚上十点准时睡觉。',
          pinyin: 'Tā měitiān wǎnshang shí diǎn zhǔnshí shuìjiào.',
          meaning: 'Cậu ấy mỗi tối 10 giờ đúng đều đi ngủ đúng giờ.',
        },
      },
    ],
  },
  {
    id: 'poly-de-dei',
    hanzi: '得',
    hanviet: 'ĐẮC',
    memoryTip: 'Được nhận là "dé"; trợ từ nối là "de"; bắt buộc phải làm là "děi".',
    masterContrastSentence: {
      chinese: '你得跑得快一点，才能得到第一名。',
      pinyin: 'Nǐ děi pǎo de kuài yìdiǎn, cáinéng dédào dì-yī míng.',
      meaning: 'Bạn phải (děi) chạy thật nhanh (de) thì mới có thể đạt được (dé) giải nhất.',
    },
    readings: [
      {
        pinyin: 'de',
        tone: 5,
        meaning: 'Trợ từ kết cấu (nối sau động từ)',
        pos: 'Trợ từ',
        words: ['跑得快', '说得好', '吃得饱'],
        example: {
          chinese: '他的汉语说得非常棒。',
          pinyin: 'Tā de hànyǔ shuō de fēicháng bàng.',
          meaning: 'Tiếng Trung của anh ấy nói cực kỳ giỏi.',
        },
      },
      {
        pinyin: 'děi',
        tone: 3,
        meaning: 'Cần phải, bắt buộc phải',
        pos: 'Trợ động từ',
        words: ['得去', '得走', '得花钱'],
        example: {
          chinese: '时间快到了，我们得马上出发。',
          pinyin: 'Shíjiān kuài dào le, wǒmen děi mǎshàng chūfā.',
          meaning: 'Sắp đến giờ rồi, chúng ta phải xuất phát ngay thôi.',
        },
      },
      {
        pinyin: 'dé',
        tone: 2,
        meaning: 'Đạt được, nhận được',
        pos: 'Động từ',
        words: ['得到', '得分', '得意'],
        example: {
          chinese: '经过努力，他得到了大家的认可。',
          pinyin: 'Jīngguò nǔlì, tā dédào le dàjiā de rènkě.',
          meaning: 'Qua nỗ lực, anh ấy đã nhận được sự công nhận của mọi người.',
        },
      },
    ],
  },
  {
    id: 'poly-zhong-chong',
    hanzi: '重',
    hanviet: 'TRỌNG / TRÙNG',
    memoryTip: 'Cân nặng, quan trọng là "zhòng"; làm lại, trùng lặp là "chóng".',
    masterContrastSentence: {
      chinese: '这份重要的文件需要重新打印。',
      pinyin: 'Zhè fèn zhòngyào de wénjiàn xūyào chóngxīn dǎyìn.',
      meaning: 'Tài liệu quan trọng (zhòng) này cần phải in lại (chóng) từ đầu.',
    },
    readings: [
      {
        pinyin: 'zhòng',
        tone: 4,
        meaning: 'Nặng, quan trọng, nghiêm trọng',
        pos: 'Tính từ',
        words: ['重要', '很重', '重量', '严重'],
        example: {
          chinese: '身体健康是人生最重要的财富。',
          pinyin: 'Shēntǐ jiànkāng shì rénshēng zuì zhòngyào de cáifù.',
          meaning: 'Sức khỏe thể chất là tài sản quan trọng nhất của đời người.',
        },
      },
      {
        pinyin: 'chóng',
        tone: 2,
        meaning: 'Lặp lại, làm lại, tầng lớp',
        pos: 'Động từ / Phó từ',
        words: ['重新', '重复', '重温', '重逢'],
        example: {
          chinese: '请你把刚才的话重新说一遍。',
          pinyin: 'Qǐng nǐ bǎ gāngcái de huà chóngxīn shuō yí biàn.',
          meaning: 'Xin bạn hãy nhắc lại lời vừa rồi một lần nữa.',
        },
      },
    ],
  },
  {
    id: 'poly-hao-hao',
    hanzi: '好',
    hanviet: 'HẢO / HIẾU',
    memoryTip: 'Tốt, đẹp là "hǎo" (thanh 3); đam mê, thích thú là "hào" (thanh 4).',
    masterContrastSentence: {
      chinese: '他是个好人，平时的爱好就是看书。',
      pinyin: 'Tā shì gè hǎorén, píngshí de àihào jiù shì kànshū.',
      meaning: 'Anh ấy là một người tốt (hǎo), sở thích (hào) ngày thường là đọc sách.',
    },
    readings: [
      {
        pinyin: 'hǎo',
        tone: 3,
        meaning: 'Tốt, đẹp, rất, xong',
        pos: 'Tính từ / Phó từ',
        words: ['好人', '好看', '很好', '准备好'],
        example: {
          chinese: '这本小说写得真好。',
          pinyin: 'Zhè běn xiǎoshuō xiě de zhēn hǎo.',
          meaning: 'Cuốn tiểu thuyết này viết hay thật đấy.',
        },
      },
      {
        pinyin: 'hào',
        tone: 4,
        meaning: 'Thích thú, đam mê, hiếu kỳ',
        pos: 'Động từ',
        words: ['爱好', '好奇', '好客', '好胜'],
        example: {
          chinese: '你平时周末有什么爱好吗？',
          pinyin: 'Nǐ píngshí zhōumò yǒu shénme àihào ma?',
          meaning: 'Bạn ngày thường cuối tuần có sở thích gì không?',
        },
      },
    ],
  },
  {
    id: 'poly-zhe-zhao',
    hanzi: '着',
    hanviet: 'TRƯỚC',
    memoryTip: 'Đang duy trì là "zhe"; sốt ruột (着急), ngủ say (睡着) là "zháo".',
    masterContrastSentence: {
      chinese: '他心里很着急，听着音乐也睡不着。',
      pinyin: 'Tā xīnlǐ hěn zháojí, tīngzhe yīnyuè yě shuì bù zháo.',
      meaning: 'Trong lòng anh ấy rất sốt ruột (zháo), vừa nghe nhạc (zhe) cũng không ngủ được (zháo).',
    },
    readings: [
      {
        pinyin: 'zhe',
        tone: 5,
        meaning: 'Trợ từ động thái duy trì trạng thái',
        pos: 'Trợ từ',
        words: ['看着', '门开着', '拿着'],
        example: {
          chinese: '他微笑着对我点了点头。',
          pinyin: 'Tā wēixiàozhe duì wǒ diǎn le diǎn tóu.',
          meaning: 'Anh ấy mỉm cười gật gật đầu với tôi.',
        },
      },
      {
        pinyin: 'zháo',
        tone: 2,
        meaning: 'Chịu, trúng, đạt được kết quả',
        pos: 'Động từ',
        words: ['着急', '睡着', '着火', '着凉'],
        example: {
          chinese: '别着急，有什么事我们慢慢商量。',
          pinyin: 'Bié zháojí, yǒu shénme shì wǒmen mànmàn shāngliang.',
          meaning: 'Đừng vội vàng sốt ruột, có chuyện gì tụi mình từ từ bàn bạc.',
        },
      },
    ],
  },
  {
    id: 'poly-fa-fa',
    hanzi: '发',
    hanviet: 'PHÁT',
    memoryTip: 'Gửi đi, phát sinh là "fā" (thanh 1); mái tóc là "fà" (thanh 4).',
    masterContrastSentence: {
      chinese: '她理完发后，给我发了一张照片。',
      pinyin: 'Tā lǐ wán fà hòu, gěi wǒ fā le yì zhāng zhàopiàn.',
      meaning: 'Sau khi cắt tóc (fà) xong, cô ấy gửi (fā) cho tôi một bức ảnh.',
    },
    readings: [
      {
        pinyin: 'fā',
        tone: 1,
        meaning: 'Phát ra, gửi đi, xuất phát',
        pos: 'Động từ',
        words: ['发生', '发现', '发送', '出发'],
        example: {
          chinese: '我刚给你发了一封电子邮件。',
          pinyin: 'Wǒ gāng gěi nǐ fā le yì fēng diànzǐ yóujiàn.',
          meaning: 'Tôi vừa gửi cho bạn một bức thư điện tử.',
        },
      },
      {
        pinyin: 'fà',
        tone: 4,
        meaning: 'Tóc',
        pos: 'Danh từ',
        words: ['头发', '理发', '假发', '白发'],
        example: {
          chinese: '李小姐留着一头漂亮的黑头发。',
          pinyin: 'Lǐ xiǎojiě liúzhe yì tóu piàoliang de hēi tóufa.',
          meaning: 'Cô Lý để một mái tóc đen rất xinh đẹp.',
        },
      },
    ],
  },
  {
    id: 'poly-kong-kong',
    hanzi: '空',
    hanviet: 'KHÔNG',
    memoryTip: 'Bầu trời, trống rỗng là "kōng" (thanh 1); rảnh rỗi là "kòng" (thanh 4).',
    masterContrastSentence: {
      chinese: '周末有空的话，我们去公园看天空。',
      pinyin: 'Zhōumò yǒu kòng dehuà, wǒmen qù gōngyuán kàn tiānkōng.',
      meaning: 'Cuối tuần nếu có thời gian rảnh (kòng), chúng ta đi công viên ngắm bầu trời (kōng) nhé.',
    },
    readings: [
      {
        pinyin: 'kōng',
        tone: 1,
        meaning: 'Trống rỗng, không khí, bầu trời',
        pos: 'Danh từ / Tính từ',
        words: ['天空', '空气', '空间', '空手'],
        example: {
          chinese: '今天的天空非常晴朗，一片蓝。',
          pinyin: 'Jīntiān de tiānkōng fēicháng qínglǎng, yí piàn lán.',
          meaning: 'Bầu trời hôm nay rất trong xanh, một màu biếc.',
        },
      },
      {
        pinyin: 'kòng',
        tone: 4,
        meaning: 'Thời gian rảnh rỗi, chỗ trống',
        pos: 'Danh từ',
        words: ['有空', '空闲', '没空', '填空'],
        example: {
          chinese: '明天下午你有空吗？一起喝茶吧。',
          pinyin: 'Míngtiān xiàwǔ nǐ yǒu kòng ma? Yìqǐ hē chá ba.',
          meaning: 'Chiều mai bạn có rảnh không? Cùng uống trà nhé.',
        },
      },
    ],
  },
];

export const POLYPHONIC_QUIZ_LIST: PolyphonicQuizItem[] = [
  {
    id: 'q-poly-1',
    prompt: 'Trong câu: "小明长(1)得很高，他的头发也很长(2)。", hai chữ "长" phát âm theo thứ tự nào?',
    sentence: '小明长(1)得很高，他的头发也很长(2)。',
    options: ['zhǎng - cháng', 'cháng - zhǎng', 'cháng - cháng', 'zhǎng - zhǎng'],
    correctIndex: 0,
    explanation: 'Chữ (1) mang nghĩa lớn lên (trưởng thành) đọc là "zhǎng"; chữ (2) mang nghĩa độ dài (tóc dài) đọc là "cháng".',
  },
  {
    id: 'q-poly-2',
    prompt: 'Trong câu: "去银行(1)办完事，他步行(2)回家。", hai chữ "行" phát âm theo thứ tự nào?',
    sentence: '去银行(1)办完事，他步行(2)回家。',
    options: ['háng - xíng', 'xíng - háng', 'xíng - xíng', 'háng - háng'],
    correctIndex: 0,
    explanation: '"银行" (ngân hàng) đọc là yínháng; "步行" (đi bộ) đọc là bùxíng.',
  },
  {
    id: 'q-poly-3',
    prompt: 'Trong câu: "听着动人的音乐(1)，他感到很快乐(2)。", hai chữ "乐" phát âm thế nào?',
    sentence: '听着动人的音乐(1)，他感到很快乐(2)。',
    options: ['yuè - lè', 'lè - yuè', 'lè - lè', 'yuè - yuè'],
    correctIndex: 0,
    explanation: '"音乐" (âm nhạc) đọc là yīnyuè; "快乐" (khoái lạc/vui vẻ) đọc là kuàilè.',
  },
  {
    id: 'q-poly-4',
    prompt: 'Trong câu: "王老师在教室(1)里教(2)中文。", hai chữ "教" phát âm thế nào?',
    sentence: '王老师在教室(1)里教(2)中文。',
    options: ['jiào - jiāo', 'jiāo - jiào', 'jiào - jiào', 'jiāo - jiāo'],
    correctIndex: 0,
    explanation: '"教室" (phòng học - danh từ) đọc thanh 4 "jiào"; "教中文" (dạy học - động từ) đọc thanh 1 "jiāo".',
  },
  {
    id: 'q-poly-5',
    prompt: 'Trong câu: "这家超市很方便(1)，东西也很便宜(2)。", hai chữ "便" đọc là gì?',
    sentence: '这家超市很方便(1)，东西也很便宜(2)。',
    options: ['biàn - pián', 'pián - biàn', 'biàn - biàn', 'pián - pián'],
    correctIndex: 0,
    explanation: '"方便" (thuận tiện) đọc là fāngbiàn; "便宜" (giá rẻ) đọc là piányi.',
  },
  {
    id: 'q-poly-6',
    prompt: 'Trong câu: "他平时工作很忙，周末一有空(1)就喜欢看蓝色的天空(2)。", hai chữ "空" đọc là gì?',
    sentence: '他平时工作很忙，周末一有空(1)就喜欢看蓝色的天空(2)。',
    options: ['kòng - kōng', 'kōng - kòng', 'kōng - kōng', 'kòng - kòng'],
    correctIndex: 0,
    explanation: '"有空" (thời gian rảnh) đọc thanh 4 "kòng"; "天空" (bầu trời) đọc thanh 1 "kōng".',
  },
  {
    id: 'q-poly-7',
    prompt: 'Trong câu: "她理完发(1)后，给我发(2)了一封邮件。", hai chữ "发" đọc theo thứ tự nào?',
    sentence: '她理完发(1)后，给我发(2)了一封邮件。',
    options: ['fà - fā', 'fā - fà', 'fā - fā', 'fà - fà'],
    correctIndex: 0,
    explanation: '"理发" (cắt tóc) đọc thanh 4 "fà"; "发邮件" (gửi thư) đọc thanh 1 "fā".',
  },
  {
    id: 'q-poly-8',
    prompt: 'Trong câu: "你得(1)走得(2)快一点。", hai chữ "得" đọc theo thứ tự nào?',
    sentence: '你得(1)走得(2)快一点。',
    options: ['děi - de', 'de - děi', 'dé - de', 'děi - dé'],
    correctIndex: 0,
    explanation: 'Chữ (1) mang nghĩa bắt buộc ("phải đi") đọc là "děi"; chữ (2) là trợ từ kết cấu bổ ngữ đọc là "de".',
  },
];
