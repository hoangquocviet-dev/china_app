import type { ChineseWord } from '../types';

export const INITIAL_WORDS: ChineseWord[] = [
  {
    id: 'hsk1_001',
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    hanviet: 'NHĨ HẢO',
    meaning: 'Xin chào',
    pos: 'Thán từ',
    level: 'HSK1',
    examples: [
      { zh: '你好！很高兴认识你。', pinyin: 'nǐ hǎo ！ hěn gāo xìng rèn shi nǐ 。', vi: 'Xin chào! Rất vui được quen biết bạn.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_002',
    hanzi: '谢谢',
    pinyin: 'xiè xiè',
    hanviet: 'TẠ TẠ',
    meaning: 'Cảm ơn',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '谢谢你的热情帮助。', pinyin: 'xiè xiè nǐ de rè qíng bāng zhù 。', vi: 'Cảm ơn sự giúp đỡ nhiệt tình của bạn.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_003',
    hanzi: '再见',
    pinyin: 'zài jiàn',
    hanviet: 'TÁI KIẾN',
    meaning: 'Tạm biệt, hẹn gặp lại',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '明天见，再见！', pinyin: 'míng tiān jiàn ， zài jiàn ！', vi: 'Ngày mai gặp lại, tạm biệt!' }
    ],
    box: 1
  },
  {
    id: 'hsk1_004',
    hanzi: '对不起',
    pinyin: 'duì bù qǐ',
    hanviet: 'ĐỐI BẤT KHỞI',
    meaning: 'Xin lỗi',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '对不起，我迟到了。', pinyin: 'duì bù qǐ ， wǒ chí dào le 。', vi: 'Xin lỗi, tôi đến muộn.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_005',
    hanzi: '没关系',
    pinyin: 'méi guān xì',
    hanviet: 'MỘI QUAN HỆ',
    meaning: 'Không có gì, không sao đâu',
    pos: 'Cụm từ',
    level: 'HSK1',
    examples: [
      { zh: '没关系，请进吧。', pinyin: 'méi guān xì ， qǐng jìn ba 。', vi: 'Không sao đâu, mời vào.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_006',
    hanzi: '不客气',
    pinyin: 'bú kè qì',
    hanviet: 'BẤT KHÁCH KHÍ',
    meaning: 'Đừng khách sáo, không có chi',
    pos: 'Cụm từ',
    level: 'HSK1',
    examples: [
      { zh: '不客气，这是我应该做的。', pinyin: 'bú kè qì ， zhè shì wǒ yīng gāi zuò de 。', vi: 'Không có chi, đây là việc tôi nên làm.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_007',
    hanzi: '请问',
    pinyin: 'qǐng wèn',
    hanviet: 'THỈNH VẤN',
    meaning: 'Xin hỏi, làm ơn cho hỏi',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '请问，洗手间在哪里？', pinyin: 'qǐng wèn ， xǐ shǒu jiān zài nǎ lǐ ？', vi: 'Xin hỏi, nhà vệ sinh ở đâu?' }
    ],
    box: 1
  },
  {
    id: 'hsk1_008',
    hanzi: '请',
    pinyin: 'qǐng',
    hanviet: 'THỈNH',
    meaning: 'Mời, xin mời',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '请喝茶，请坐。', pinyin: 'qǐng hē chá ， qǐng zuò 。', vi: 'Mời uống trà, mời ngồi.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_009',
    hanzi: '我',
    pinyin: 'wǒ',
    hanviet: 'NGÃ',
    meaning: 'Tôi, mình, tao',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '我是越南人。', pinyin: 'wǒ shì yuè nán rén 。', vi: 'Tôi là người Việt Nam.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_010',
    hanzi: '你',
    pinyin: 'nǐ',
    hanviet: 'NHĨ',
    meaning: 'Bạn, anh, chị, mày',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '你是学生吗？', pinyin: 'nǐ shì xué shēng ma ？', vi: 'Bạn là học sinh phải không?' }
    ],
    box: 1
  },
  {
    id: 'hsk1_011',
    hanzi: '他',
    pinyin: 'tā',
    hanviet: 'THA',
    meaning: 'Anh ấy, ông ấy, hắn',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '他是我的中文老师。', pinyin: 'tā shì wǒ de zhōng wén lǎo shī 。', vi: 'Thầy ấy là giáo viên tiếng Trung của tôi.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_012',
    hanzi: '她',
    pinyin: 'tā',
    hanviet: 'THA',
    meaning: 'Cô ấy, bà ấy, nàng',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '她很漂亮也很聪明。', pinyin: 'tā hěn piào liang yě hěn cōng ming 。', vi: 'Cô ấy rất xinh đẹp và cũng rất thông minh.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_013',
    hanzi: '我们',
    pinyin: 'wǒ men',
    hanviet: 'NGÃ MÔN',
    meaning: 'Chúng tôi, chúng ta',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '我们一起去吃饭吧。', pinyin: 'wǒ men yì qǐ qù chī fàn ba 。', vi: 'Chúng ta cùng đi ăn cơm đi.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_014',
    hanzi: '你们',
    pinyin: 'nǐ men',
    hanviet: 'NHĨ MÔN',
    meaning: 'Các bạn, các anh chị',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '你们在看什么书？', pinyin: 'nǐ men zài kàn shén me shū ？', vi: 'Các bạn đang đọc sách gì vậy?' }
    ],
    box: 1
  },
  {
    id: 'hsk1_015',
    hanzi: '他们',
    pinyin: 'tā men',
    hanviet: 'THA MÔN',
    meaning: 'Họ, bọn họ (nam/chung)',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '他们都在公司工作。', pinyin: 'tā men dōu zài gōng sī gōng zuò 。', vi: 'Họ đều làm việc ở công ty.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_016',
    hanzi: '她们',
    pinyin: 'tā men',
    hanviet: 'THA MÔN',
    meaning: 'Họ, các cô ấy (nữ)',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '她们在喝咖啡聊天。', pinyin: 'tā men zài hē kā fēi liáo tiān 。', vi: 'Các cô ấy đang uống cà phê trò chuyện.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_017',
    hanzi: '这',
    pinyin: 'zhè',
    hanviet: 'GIÁ',
    meaning: 'Đây, này',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '这是我的手机。', pinyin: 'zhè shì wǒ de shǒu jī 。', vi: 'Đây là điện thoại của tôi.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_018',
    hanzi: '那',
    pinyin: 'nà',
    hanviet: 'NA',
    meaning: 'Kia, đó',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '那是谁的书包？', pinyin: 'nà shì shuí de shū bāo ？', vi: 'Kia là cặp sách của ai?' }
    ],
    box: 1
  },
  {
    id: 'hsk1_019',
    hanzi: '这儿',
    pinyin: 'zhè ér',
    hanviet: 'GIÁ NHI',
    meaning: 'Ở đây, chỗ này',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '这儿的天气很好。', pinyin: 'zhè ér de tiān qì hěn hǎo 。', vi: 'Thời tiết ở đây rất đẹp.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_020',
    hanzi: '那儿',
    pinyin: 'nà ér',
    hanviet: 'NA NHI',
    meaning: 'Ở đó, chỗ kia',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '我住在办公司那儿。', pinyin: 'wǒ zhù zài bàn gōng sī nà ér 。', vi: 'Tôi sống ở chỗ văn phòng đằng kia.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_021',
    hanzi: '哪儿',
    pinyin: 'nǎ ér',
    hanviet: 'NẢ NHI',
    meaning: 'Ở đâu, chỗ nào',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '你要去哪儿？', pinyin: 'nǐ yào qù nǎ ér ？', vi: 'Bạn muốn đi đâu?' }
    ],
    box: 1
  },
  {
    id: 'hsk1_022',
    hanzi: '谁',
    pinyin: 'shuí',
    hanviet: 'THÙY',
    meaning: 'Ai, người nào',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '他是谁？', pinyin: 'tā shì shuí ？', vi: 'Anh ấy là ai?' }
    ],
    box: 1
  },
  {
    id: 'hsk1_023',
    hanzi: '什么',
    pinyin: 'shén me',
    hanviet: 'THẬP MA',
    meaning: 'Cái gì, gì',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '你喜欢吃什么？', pinyin: 'nǐ xǐ huan chī shén me ？', vi: 'Bạn thích ăn món gì?' }
    ],
    box: 1
  },
  {
    id: 'hsk1_024',
    hanzi: '多少',
    pinyin: 'duō shǎo',
    hanviet: 'ĐA THIỂU',
    meaning: 'Bao nhiêu',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '这个手机多少钱？', pinyin: 'zhè ge shǒu jī duō shǎo qián ？', vi: 'Cái điện thoại này bao nhiêu tiền?' }
    ],
    box: 1
  },
  {
    id: 'hsk1_025',
    hanzi: '几',
    pinyin: 'jǐ',
    hanviet: 'KỶ',
    meaning: 'Mấy, vài',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '现在几点了？', pinyin: 'xiàn zài jǐ diǎn le ？', vi: 'Bây giờ là mấy giờ rồi?' }
    ],
    box: 1
  },
  {
    id: 'hsk1_026',
    hanzi: '怎么',
    pinyin: 'zěn me',
    hanviet: 'CHẨM MA',
    meaning: 'Như thế nào, sao lại',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '这个汉字怎么读？', pinyin: 'zhè ge hàn zì zěn me dú ？', vi: 'Chữ Hán này đọc như thế nào?' }
    ],
    box: 1
  },
  {
    id: 'hsk1_027',
    hanzi: '怎么样',
    pinyin: 'zěn me yàng',
    hanviet: 'CHẨM MA DẠNG',
    meaning: 'Thế nào, ra sao',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '今天天气怎么样？', pinyin: 'jīn tiān tiān qì zěn me yàng ？', vi: 'Thời tiết hôm nay thế nào?' }
    ],
    box: 1
  },
  {
    id: 'hsk1_028',
    hanzi: '一',
    pinyin: 'yī',
    hanviet: 'NHẤT',
    meaning: 'Một, số 1',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '我一个人去北京。', pinyin: 'wǒ yí gè rén qù běi jīng 。', vi: 'Tôi đi Bắc Kinh một mình.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_029',
    hanzi: '二',
    pinyin: 'èr',
    hanviet: 'NHỊ',
    meaning: 'Hai, số 2',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '现在两点了。', pinyin: 'xiàn zài liǎng diǎn le 。', vi: 'Bây giờ là hai giờ rồi.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_030',
    hanzi: '三',
    pinyin: 'sān',
    hanviet: 'TAM',
    meaning: 'Ba, số 3',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '我家有三口人。', pinyin: 'wǒ jiā yǒu sān kǒu rén 。', vi: 'Nhà tôi có ba người.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_031',
    hanzi: '四',
    pinyin: 'sì',
    hanviet: 'TỨ',
    meaning: 'Bốn, số 4',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '这里有四本书。', pinyin: 'zhè lǐ yǒu sì běn shū 。', vi: 'Ở đây có bốn cuốn sách.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_032',
    hanzi: '五',
    pinyin: 'wǔ',
    hanviet: 'NGŨ',
    meaning: 'Năm, số 5',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '五月的天气很暖和。', pinyin: 'wǔ yuè de tiān qì hěn nuǎn huo 。', vi: 'Thời tiết tháng năm rất ấm áp.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_033',
    hanzi: '六',
    pinyin: 'liù',
    hanviet: 'LỤC',
    meaning: 'Sáu, số 6',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '星期六我们不用上班。', pinyin: 'xīng qī liù wǒ men bú yòng shàng bān 。', vi: 'Thứ bảy chúng tôi không phải đi làm.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_034',
    hanzi: '七',
    pinyin: 'qī',
    hanviet: 'THẤT',
    meaning: 'Bảy, số 7',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '他今年七岁了。', pinyin: 'tā jīn nián qī suì le 。', vi: 'Năm nay cậu bé được bảy tuổi rồi.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_035',
    hanzi: '八',
    pinyin: 'bā',
    hanviet: 'BÁT',
    meaning: 'Tám, số 8',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '我们早上八点上课。', pinyin: 'wǒ men zǎo shàng bā diǎn shàng kè 。', vi: 'Chúng tôi vào học lúc tám giờ sáng.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_036',
    hanzi: '九',
    pinyin: 'jiǔ',
    hanviet: 'CỬU',
    meaning: 'Chín, số 9',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '九号是我的生日。', pinyin: 'jiǔ hào shì wǒ de shēng rì 。', vi: 'Ngày mùng chín là sinh nhật tôi.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_037',
    hanzi: '十',
    pinyin: 'shí',
    hanviet: 'THẬP',
    meaning: 'Mười, số 10',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '我想买十个苹果。', pinyin: 'wǒ xiǎng mǎi shí gè píng guǒ 。', vi: 'Tôi muốn mua mười quả táo.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_038',
    hanzi: '零',
    pinyin: 'líng',
    hanviet: 'LINH',
    meaning: 'Số 0',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '今天是二零二六年。', pinyin: 'jīn tiān shì èr líng èr liù nián 。', vi: 'Hôm nay là năm 2026.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_039',
    hanzi: '个',
    pinyin: 'gè',
    hanviet: 'CÁ',
    meaning: 'Cái, con, người (lượng từ chung)',
    pos: 'Lượng từ',
    level: 'HSK1',
    examples: [
      { zh: '我有一个中国朋友。', pinyin: 'wǒ yǒu yí gè zhōng guó péng yǒu 。', vi: 'Tôi có một người bạn Trung Quốc.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_040',
    hanzi: '岁',
    pinyin: 'suì',
    hanviet: 'TUẾ',
    meaning: 'Tuổi',
    pos: 'Lượng từ',
    level: 'HSK1',
    examples: [
      { zh: '你今年多大岁数了？', pinyin: 'nǐ jīn nián duō dà suì shù le ？', vi: 'Năm nay bạn bao nhiêu tuổi rồi?' }
    ],
    box: 1
  },
  {
    id: 'hsk1_041',
    hanzi: '本',
    pinyin: 'běn',
    hanviet: 'BẢN',
    meaning: 'Cuốn, quyển',
    pos: 'Lượng từ',
    level: 'HSK1',
    examples: [
      { zh: '我想借两本书。', pinyin: 'wǒ xiǎng jiè liǎng běn shū 。', vi: 'Tôi muốn mượn hai quyển sách.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_042',
    hanzi: '块',
    pinyin: 'kuài',
    hanviet: 'KHỐI',
    meaning: 'Đồng, tệ (tiền)',
    pos: 'Lượng từ',
    level: 'HSK1',
    examples: [
      { zh: '这杯咖啡三十块钱。', pinyin: 'zhè bēi kā fēi sān shí kuài qián 。', vi: 'Cốc cà phê này ba mươi tệ.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_043',
    hanzi: '些',
    pinyin: 'xiē',
    hanviet: 'TIÊU',
    meaning: 'Một số, vài, những',
    pos: 'Lượng từ',
    level: 'HSK1',
    examples: [
      { zh: '这些苹果很好吃。', pinyin: 'zhè xiē píng guǒ hěn hǎo chī 。', vi: 'Những quả táo này rất ngon.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_044',
    hanzi: '爸爸',
    pinyin: 'bà ba',
    hanviet: 'BÁ BÁ',
    meaning: 'Bố, cha',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '我爸爸是一名医生。', pinyin: 'wǒ bà ba shì yì míng yī shēng 。', vi: 'Bố tôi là một bác sĩ.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_045',
    hanzi: '妈妈',
    pinyin: 'mā ma',
    hanviet: 'MA MA',
    meaning: 'Mẹ, má',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '妈妈做的饭菜很好吃。', pinyin: 'mā ma zuò de fàn cài hěn hǎo chī 。', vi: 'Cơm mẹ nấu rất ngon.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_046',
    hanzi: '儿子',
    pinyin: 'ér zi',
    hanviet: 'NHI TỬ',
    meaning: 'Con trai',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '他的儿子今年三岁。', pinyin: 'tā de ér zi jīn nián sān suì 。', vi: 'Con trai anh ấy năm nay ba tuổi.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_047',
    hanzi: '女儿',
    pinyin: 'nǚ ér',
    hanviet: 'NỮ NHI',
    meaning: 'Con gái',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '我女儿很喜欢画画。', pinyin: 'wǒ nǚ ér hěn xǐ huan huà huà 。', vi: 'Con gái tôi rất thích vẽ tranh.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_048',
    hanzi: '朋友',
    pinyin: 'péng yǒu',
    hanviet: 'BẰNG HỮU',
    meaning: 'Bạn bè, người bạn',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '海内存知己，天涯若比邻。', pinyin: 'hǎi nèi cún zhī jǐ ， tiān yá ruò bǐ lín 。', vi: 'Bốn bể có bạn tri kỷ, chân trời tựa kề bên.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_049',
    hanzi: '老师',
    pinyin: 'lǎo shī',
    hanviet: 'LÃO SƯ',
    meaning: 'Thầy giáo, cô giáo',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '李老师教我们汉语。', pinyin: 'lǐ lǎo shī jiào wǒ men hàn yǔ 。', vi: 'Cô Lý dạy chúng tôi tiếng Trung.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_050',
    hanzi: '学生',
    pinyin: 'xué shēng',
    hanviet: 'HỌC SINH',
    meaning: 'Học sinh, sinh viên',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '学校里有很多外国学生。', pinyin: 'xué xiào lǐ yǒu hěn duō wài guó xué shēng 。', vi: 'Trong trường có rất nhiều lưu học sinh nước ngoài.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_051',
    hanzi: '同学',
    pinyin: 'tóng xué',
    hanviet: 'ĐỒNG HỌC',
    meaning: 'Bạn học, bạn cùng lớp',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '我和他是大学同学。', pinyin: 'wǒ hé tā shì dà xué tóng xué 。', vi: 'Tôi và cậu ấy là bạn học thời đại học.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_052',
    hanzi: '医生',
    pinyin: 'yī shēng',
    hanviet: 'Y SINH',
    meaning: 'Bác sĩ',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '医生说你要多喝水。', pinyin: 'yī shēng shuō nǐ yào duō hē shuǐ 。', vi: 'Bác sĩ nói bạn phải uống nhiều nước.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_053',
    hanzi: '先生',
    pinyin: 'xiān shēng',
    hanviet: 'TIÊN SINH',
    meaning: 'Ông, ngài, chồng',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '王先生正在开会。', pinyin: 'wáng xiān shēng zhèng zài kāi huì 。', vi: 'Ông Vương đang họp.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_054',
    hanzi: '小姐',
    pinyin: 'xiǎo jiě',
    hanviet: 'TIỂU THƯ',
    meaning: 'Cô, tiểu thư',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '请问王小姐在吗？', pinyin: 'qǐng wèn wáng xiǎo jiě zài ma ？', vi: 'Xin hỏi cô Vương có ở đây không?' }
    ],
    box: 1
  },
  {
    id: 'hsk1_055',
    hanzi: '人',
    pinyin: 'rén',
    hanviet: 'NHÂN',
    meaning: 'Người, con người',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '中国人很热情。', pinyin: 'zhōng guó rén hěn rè qíng 。', vi: 'Người Trung Quốc rất nhiệt tình.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_056',
    hanzi: '吃',
    pinyin: 'chī',
    hanviet: 'CẬT',
    meaning: 'Ăn',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '你喜欢吃中国菜吗？', pinyin: 'nǐ xǐ huan chī zhōng guó cài ma ？', vi: 'Bạn thích ăn món Trung Quốc không?' }
    ],
    box: 1
  },
  {
    id: 'hsk1_057',
    hanzi: '喝',
    pinyin: 'hē',
    hanviet: 'HÁT',
    meaning: 'Uống',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '我想喝一杯水。', pinyin: 'wǒ xiǎng hē yì bēi shuǐ 。', vi: 'Tôi muốn uống một cốc nước.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_058',
    hanzi: '茶',
    pinyin: 'chá',
    hanviet: 'TRÀ',
    meaning: 'Trà, chè',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '中国人很喜欢喝绿茶。', pinyin: 'zhōng guó rén hěn xǐ huan hē lǜ chá 。', vi: 'Người Trung Quốc rất thích uống trà xanh.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_059',
    hanzi: '水',
    pinyin: 'shuǐ',
    hanviet: 'THỦY',
    meaning: 'Nước',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '口渴了，喝点水吧。', pinyin: 'kǒu kě le ， hē diǎn shuǐ ba 。', vi: 'Khát nước rồi, uống chút nước đi.' }
    ],
    box: 1
  },
  {
    id: 'hsk1_060',
    hanzi: '米饭',
    pinyin: 'mǐ fàn',
    hanviet: 'MỄ PHẠN',
    meaning: 'Cơm',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '中午我吃了一碗米饭。', pinyin: 'zhōng wǔ wǒ chī le yì wǎn mǐ fàn 。', vi: 'Buổi trưa tôi đã ăn một bát cơm.' }
    ],
    box: 1
  }
];
