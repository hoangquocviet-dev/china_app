import type { ChineseWord } from '../types';

export const DICTIONARY_WORDS: ChineseWord[] = [
  {
    id: 'dict_001',
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    hanviet: 'NHĨ HẢO',
    meaning: 'Xin chào',
    pos: 'Thán từ',
    level: 'HSK1',
    examples: [
      { zh: '你好！很高兴认识你。', pinyin: 'nǐ hǎo ！ hěn gāo xìng rèn shi nǐ 。', vi: 'Xin chào! Rất vui được quen biết bạn.' }
    ]
  },
  {
    id: 'dict_002',
    hanzi: '您好',
    pinyin: 'nín hǎo',
    hanviet: 'NẪM HẢO',
    meaning: 'Chào ngài, chào bác (kính ngữ)',
    pos: 'Thán từ',
    level: 'HSK2',
    examples: [
      { zh: '老师，您好！', pinyin: 'lǎo shī ， nín hǎo ！', vi: 'Em chào thầy ạ!' }
    ]
  },
  {
    id: 'dict_003',
    hanzi: '谢谢',
    pinyin: 'xiè xiè',
    hanviet: 'TẠ TẠ',
    meaning: 'Cảm ơn',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '谢谢你的热情帮助。', pinyin: 'xiè xiè nǐ de rè qíng bāng zhù 。', vi: 'Cảm ơn sự giúp đỡ nhiệt tình của bạn.' }
    ]
  },
  {
    id: 'dict_004',
    hanzi: '多谢',
    pinyin: 'duō xiè',
    hanviet: 'ĐA TẠ',
    meaning: 'Đa tạ, cảm ơn nhiều',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '多谢你的关照！', pinyin: 'duō xiè nǐ de guān zhào ！', vi: 'Đa tạ bạn đã quan tâm giúp đỡ!' }
    ]
  },
  {
    id: 'dict_005',
    hanzi: '再见',
    pinyin: 'zài jiàn',
    hanviet: 'TÁI KIẾN',
    meaning: 'Tạm biệt, hẹn gặp lại',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '明天见，再见！', pinyin: 'míng tiān jiàn ， zài jiàn ！', vi: 'Ngày mai gặp lại, tạm biệt!' }
    ]
  },
  {
    id: 'dict_006',
    hanzi: '对不起',
    pinyin: 'duì bù qǐ',
    hanviet: 'ĐỐI BẤT KHỞI',
    meaning: 'Xin lỗi',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '对不起，我迟到了。', pinyin: 'duì bù qǐ ， wǒ chí dào le 。', vi: 'Xin lỗi, tôi đến muộn.' }
    ]
  },
  {
    id: 'dict_007',
    hanzi: '没关系',
    pinyin: 'méi guān xì',
    hanviet: 'MỘI QUAN HỆ',
    meaning: 'Không có gì, không sao đâu',
    pos: 'Cụm từ',
    level: 'HSK1',
    examples: [
      { zh: '没关系，请进吧。', pinyin: 'méi guān xì ， qǐng jìn ba 。', vi: 'Không sao đâu, mời vào.' }
    ]
  },
  {
    id: 'dict_008',
    hanzi: '不客气',
    pinyin: 'bú kè qì',
    hanviet: 'BẤT KHÁCH KHÍ',
    meaning: 'Đừng khách sáo, không có chi',
    pos: 'Cụm từ',
    level: 'HSK1',
    examples: [
      { zh: '不客气，这是我应该做的。', pinyin: 'bú kè qì ， zhè shì wǒ yīng gāi zuò de 。', vi: 'Không có chi, đây là việc tôi nên làm.' }
    ]
  },
  {
    id: 'dict_009',
    hanzi: '请问',
    pinyin: 'qǐng wèn',
    hanviet: 'THỈNH VẤN',
    meaning: 'Xin hỏi, làm ơn cho hỏi',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '请问，洗手间在哪里？', pinyin: 'qǐng wèn ， xǐ shǒu jiān zài nǎ lǐ ？', vi: 'Xin hỏi, nhà vệ sinh ở đâu?' }
    ]
  },
  {
    id: 'dict_010',
    hanzi: '请',
    pinyin: 'qǐng',
    hanviet: 'THỈNH',
    meaning: 'Mời, xin mời',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '请喝茶，请坐。', pinyin: 'qǐng hē chá ， qǐng zuò 。', vi: 'Mời uống trà, mời ngồi.' }
    ]
  },
  {
    id: 'dict_011',
    hanzi: '欢迎',
    pinyin: 'huān yíng',
    hanviet: 'HOAN NGHÊNH',
    meaning: 'Hoan nghênh, chào mừng',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '欢迎你来北京！', pinyin: 'huān yíng nǐ lái běi jīng ！', vi: 'Chào mừng bạn đến Bắc Kinh!' }
    ]
  },
  {
    id: 'dict_012',
    hanzi: '我',
    pinyin: 'wǒ',
    hanviet: 'NGÃ',
    meaning: 'Tôi, mình, tao',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '我是越南人。', pinyin: 'wǒ shì yuè nán rén 。', vi: 'Tôi là người Việt Nam.' }
    ]
  },
  {
    id: 'dict_013',
    hanzi: '你',
    pinyin: 'nǐ',
    hanviet: 'NHĨ',
    meaning: 'Bạn, anh, chị, mày',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '你是学生吗？', pinyin: 'nǐ shì xué shēng ma ？', vi: 'Bạn là học sinh phải không?' }
    ]
  },
  {
    id: 'dict_014',
    hanzi: '他',
    pinyin: 'tā',
    hanviet: 'THA',
    meaning: 'Anh ấy, ông ấy, hắn',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '他是我的中文老师。', pinyin: 'tā shì wǒ de zhōng wén lǎo shī 。', vi: 'Thầy ấy là giáo viên tiếng Trung của tôi.' }
    ]
  },
  {
    id: 'dict_015',
    hanzi: '她',
    pinyin: 'tā',
    hanviet: 'THA',
    meaning: 'Cô ấy, bà ấy, nàng',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '她很漂亮也很聪明。', pinyin: 'tā hěn piào liang yě hěn cōng ming 。', vi: 'Cô ấy rất xinh đẹp và cũng rất thông minh.' }
    ]
  },
  {
    id: 'dict_016',
    hanzi: '我们',
    pinyin: 'wǒ men',
    hanviet: 'NGÃ MÔN',
    meaning: 'Chúng tôi, chúng ta',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '我们一起去吃饭吧。', pinyin: 'wǒ men yì qǐ qù chī fàn ba 。', vi: 'Chúng ta cùng đi ăn cơm đi.' }
    ]
  },
  {
    id: 'dict_017',
    hanzi: '你们',
    pinyin: 'nǐ men',
    hanviet: 'NHĨ MÔN',
    meaning: 'Các bạn, các anh chị',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '你们在看什么书？', pinyin: 'nǐ men zài kàn shén me shū ？', vi: 'Các bạn đang đọc sách gì vậy?' }
    ]
  },
  {
    id: 'dict_018',
    hanzi: '他们',
    pinyin: 'tā men',
    hanviet: 'THA MÔN',
    meaning: 'Họ, bọn họ (nam/chung)',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '他们都在公司工作。', pinyin: 'tā men dōu zài gōng sī gōng zuò 。', vi: 'Họ đều làm việc ở công ty.' }
    ]
  },
  {
    id: 'dict_019',
    hanzi: '她们',
    pinyin: 'tā men',
    hanviet: 'THA MÔN',
    meaning: 'Họ, các cô ấy (nữ)',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '她们在喝咖啡聊天。', pinyin: 'tā men zài hē kā fēi liáo tiān 。', vi: 'Các cô ấy đang uống cà phê trò chuyện.' }
    ]
  },
  {
    id: 'dict_020',
    hanzi: '大家',
    pinyin: 'dà jiā',
    hanviet: 'ĐẠI GIA',
    meaning: 'Mọi người, cả nhà',
    pos: 'Đại từ',
    level: 'HSK2',
    examples: [
      { zh: '大家好！', pinyin: 'dà jiā hǎo ！', vi: 'Chào mọi người!' }
    ]
  },
  {
    id: 'dict_021',
    hanzi: '这',
    pinyin: 'zhè',
    hanviet: 'GIÁ',
    meaning: 'Đây, này',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '这是我的手机。', pinyin: 'zhè shì wǒ de shǒu jī 。', vi: 'Đây là điện thoại của tôi.' }
    ]
  },
  {
    id: 'dict_022',
    hanzi: '那',
    pinyin: 'nà',
    hanviet: 'NA',
    meaning: 'Kia, đó',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '那是谁的书包？', pinyin: 'nà shì shuí de shū bāo ？', vi: 'Kia là cặp sách của ai?' }
    ]
  },
  {
    id: 'dict_023',
    hanzi: '这儿',
    pinyin: 'zhè ér',
    hanviet: 'GIÁ NHI',
    meaning: 'Ở đây, chỗ này',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '这儿的天气很好。', pinyin: 'zhè ér de tiān qì hěn hǎo 。', vi: 'Thời tiết ở đây rất đẹp.' }
    ]
  },
  {
    id: 'dict_024',
    hanzi: '那儿',
    pinyin: 'nà ér',
    hanviet: 'NA NHI',
    meaning: 'Ở đó, chỗ kia',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '我住在办公司那儿。', pinyin: 'wǒ zhù zài bàn gōng sī nà ér 。', vi: 'Tôi sống ở chỗ văn phòng đằng kia.' }
    ]
  },
  {
    id: 'dict_025',
    hanzi: '哪儿',
    pinyin: 'nǎ ér',
    hanviet: 'NẢ NHI',
    meaning: 'Ở đâu, chỗ nào',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '你要去哪儿？', pinyin: 'nǐ yào qù nǎ ér ？', vi: 'Bạn muốn đi đâu?' }
    ]
  },
  {
    id: 'dict_026',
    hanzi: '谁',
    pinyin: 'shuí',
    hanviet: 'THÙY',
    meaning: 'Ai, người nào',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '他是谁？', pinyin: 'tā shì shuí ？', vi: 'Anh ấy là ai?' }
    ]
  },
  {
    id: 'dict_027',
    hanzi: '什么',
    pinyin: 'shén me',
    hanviet: 'THẬP MA',
    meaning: 'Cái gì, gì',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '你喜欢吃什么？', pinyin: 'nǐ xǐ huan chī shén me ？', vi: 'Bạn thích ăn món gì?' }
    ]
  },
  {
    id: 'dict_028',
    hanzi: '多少',
    pinyin: 'duō shǎo',
    hanviet: 'ĐA THIỂU',
    meaning: 'Bao nhiêu',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '这个手机多少钱？', pinyin: 'zhè ge shǒu jī duō shǎo qián ？', vi: 'Cái điện thoại này bao nhiêu tiền?' }
    ]
  },
  {
    id: 'dict_029',
    hanzi: '几',
    pinyin: 'jǐ',
    hanviet: 'KỶ',
    meaning: 'Mấy, vài',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '现在几点了？', pinyin: 'xiàn zài jǐ diǎn le ？', vi: 'Bây giờ là mấy giờ rồi?' }
    ]
  },
  {
    id: 'dict_030',
    hanzi: '怎么',
    pinyin: 'zěn me',
    hanviet: 'CHẨM MA',
    meaning: 'Như thế nào, sao lại',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '这个汉字怎么读？', pinyin: 'zhè ge hàn zì zěn me dú ？', vi: 'Chữ Hán này đọc như thế nào?' }
    ]
  },
  {
    id: 'dict_031',
    hanzi: '怎么样',
    pinyin: 'zěn me yàng',
    hanviet: 'CHẨM MA DẠNG',
    meaning: 'Thế nào, ra sao',
    pos: 'Đại từ',
    level: 'HSK1',
    examples: [
      { zh: '今天天气怎么样？', pinyin: 'jīn tiān tiān qì zěn me yàng ？', vi: 'Thời tiết hôm nay thế nào?' }
    ]
  },
  {
    id: 'dict_032',
    hanzi: '为什么',
    pinyin: 'wèi shén me',
    hanviet: 'VI THẬP MA',
    meaning: 'Tại sao, vì sao',
    pos: 'Đại từ',
    level: 'HSK2',
    examples: [
      { zh: '你为什么喜欢学中文？', pinyin: 'nǐ wèi shén me xǐ huan xué zhōng wén ？', vi: 'Tại sao bạn lại thích học tiếng Trung?' }
    ]
  },
  {
    id: 'dict_033',
    hanzi: '一',
    pinyin: 'yī',
    hanviet: 'NHẤT',
    meaning: 'Một, số 1',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '我一个人去北京。', pinyin: 'wǒ yí gè rén qù běi jīng 。', vi: 'Tôi đi Bắc Kinh một mình.' }
    ]
  },
  {
    id: 'dict_034',
    hanzi: '二',
    pinyin: 'èr',
    hanviet: 'NHỊ',
    meaning: 'Hai, số 2',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '现在两点了。', pinyin: 'xiàn zài liǎng diǎn le 。', vi: 'Bây giờ là hai giờ rồi.' }
    ]
  },
  {
    id: 'dict_035',
    hanzi: '三',
    pinyin: 'sān',
    hanviet: 'TAM',
    meaning: 'Ba, số 3',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '我家有三口人。', pinyin: 'wǒ jiā yǒu sān kǒu rén 。', vi: 'Nhà tôi có ba người.' }
    ]
  },
  {
    id: 'dict_036',
    hanzi: '四',
    pinyin: 'sì',
    hanviet: 'TỨ',
    meaning: 'Bốn, số 4',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '这里有四本书。', pinyin: 'zhè lǐ yǒu sì běn shū 。', vi: 'Ở đây có bốn cuốn sách.' }
    ]
  },
  {
    id: 'dict_037',
    hanzi: '五',
    pinyin: 'wǔ',
    hanviet: 'NGŨ',
    meaning: 'Năm, số 5',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '五月的天气很暖和。', pinyin: 'wǔ yuè de tiān qì hěn nuǎn huo 。', vi: 'Thời tiết tháng năm rất ấm áp.' }
    ]
  },
  {
    id: 'dict_038',
    hanzi: '六',
    pinyin: 'liù',
    hanviet: 'LỤC',
    meaning: 'Sáu, số 6',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '星期六我们不用上班。', pinyin: 'xīng qī liù wǒ men bú yòng shàng bān 。', vi: 'Thứ bảy chúng tôi không phải đi làm.' }
    ]
  },
  {
    id: 'dict_039',
    hanzi: '七',
    pinyin: 'qī',
    hanviet: 'THẤT',
    meaning: 'Bảy, số 7',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '他今年七岁了。', pinyin: 'tā jīn nián qī suì le 。', vi: 'Năm nay cậu bé được bảy tuổi rồi.' }
    ]
  },
  {
    id: 'dict_040',
    hanzi: '八',
    pinyin: 'bā',
    hanviet: 'BÁT',
    meaning: 'Tám, số 8',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '我们早上八点上课。', pinyin: 'wǒ men zǎo shàng bā diǎn shàng kè 。', vi: 'Chúng tôi vào học lúc tám giờ sáng.' }
    ]
  },
  {
    id: 'dict_041',
    hanzi: '九',
    pinyin: 'jiǔ',
    hanviet: 'CỬU',
    meaning: 'Chín, số 9',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '九号是我的生日。', pinyin: 'jiǔ hào shì wǒ de shēng rì 。', vi: 'Ngày mùng chín là sinh nhật tôi.' }
    ]
  },
  {
    id: 'dict_042',
    hanzi: '十',
    pinyin: 'shí',
    hanviet: 'THẬP',
    meaning: 'Mười, số 10',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '我想买十个苹果。', pinyin: 'wǒ xiǎng mǎi shí gè píng guǒ 。', vi: 'Tôi muốn mua mười quả táo.' }
    ]
  },
  {
    id: 'dict_043',
    hanzi: '百',
    pinyin: 'bǎi',
    hanviet: 'BÁCH',
    meaning: 'Trăm, một trăm',
    pos: 'Số từ',
    level: 'HSK2',
    examples: [
      { zh: '这件衣服一百块。', pinyin: 'zhè jiàn yī fu yì bǎi kuài 。', vi: 'Chiếc áo này giá một trăm tệ.' }
    ]
  },
  {
    id: 'dict_044',
    hanzi: '千',
    pinyin: 'qiān',
    hanviet: 'THIÊN',
    meaning: 'Nghìn, một nghìn',
    pos: 'Số từ',
    level: 'HSK2',
    examples: [
      { zh: '这本书一千字。', pinyin: 'zhè běn shū yì qiān zì 。', vi: 'Cuốn sách này có một nghìn chữ.' }
    ]
  },
  {
    id: 'dict_045',
    hanzi: '零',
    pinyin: 'líng',
    hanviet: 'LINH',
    meaning: 'Số 0',
    pos: 'Số từ',
    level: 'HSK1',
    examples: [
      { zh: '今天是二零二六年。', pinyin: 'jīn tiān shì èr líng èr liù nián 。', vi: 'Hôm nay là năm 2026.' }
    ]
  },
  {
    id: 'dict_046',
    hanzi: '个',
    pinyin: 'gè',
    hanviet: 'CÁ',
    meaning: 'Cái, con, người (lượng từ chung)',
    pos: 'Lượng từ',
    level: 'HSK1',
    examples: [
      { zh: '我有一个中国朋友。', pinyin: 'wǒ yǒu yí gè zhōng guó péng yǒu 。', vi: 'Tôi có một người bạn Trung Quốc.' }
    ]
  },
  {
    id: 'dict_047',
    hanzi: '岁',
    pinyin: 'suì',
    hanviet: 'TUẾ',
    meaning: 'Tuổi',
    pos: 'Lượng từ',
    level: 'HSK1',
    examples: [
      { zh: '你今年多大岁数了？', pinyin: 'nǐ jīn nián duō dà suì shù le ？', vi: 'Năm nay bạn bao nhiêu tuổi rồi?' }
    ]
  },
  {
    id: 'dict_048',
    hanzi: '本',
    pinyin: 'běn',
    hanviet: 'BẢN',
    meaning: 'Cuốn, quyển',
    pos: 'Lượng từ',
    level: 'HSK1',
    examples: [
      { zh: '我想借两本书。', pinyin: 'wǒ xiǎng jiè liǎng běn shū 。', vi: 'Tôi muốn mượn hai quyển sách.' }
    ]
  },
  {
    id: 'dict_049',
    hanzi: '块',
    pinyin: 'kuài',
    hanviet: 'KHỐI',
    meaning: 'Đồng, tệ (tiền)',
    pos: 'Lượng từ',
    level: 'HSK1',
    examples: [
      { zh: '这杯咖啡三十块钱。', pinyin: 'zhè bēi kā fēi sān shí kuài qián 。', vi: 'Cốc cà phê này ba mươi tệ.' }
    ]
  },
  {
    id: 'dict_050',
    hanzi: '些',
    pinyin: 'xiē',
    hanviet: 'TIÊU',
    meaning: 'Một số, vài, những',
    pos: 'Lượng từ',
    level: 'HSK1',
    examples: [
      { zh: '这些苹果很好吃。', pinyin: 'zhè xiē píng guǒ hěn hǎo chī 。', vi: 'Những quả táo này rất ngon.' }
    ]
  },
  {
    id: 'dict_051',
    hanzi: '次',
    pinyin: 'cì',
    hanviet: 'THỨ',
    meaning: 'Lần, lượt',
    pos: 'Lượng từ',
    level: 'HSK2',
    examples: [
      { zh: '这是我第一次来中国。', pinyin: 'zhè shì wǒ dì yī cì lái zhōng guó 。', vi: 'Đây là lần đầu tiên tôi đến Trung Quốc.' }
    ]
  },
  {
    id: 'dict_052',
    hanzi: '件',
    pinyin: 'jiàn',
    hanviet: 'KIỆN',
    meaning: 'Chiếc, cái (áo quần, việc)',
    pos: 'Lượng từ',
    level: 'HSK2',
    examples: [
      { zh: '这件衣服很合适。', pinyin: 'zhè jiàn yī fu hěn hé shì 。', vi: 'Chiếc áo này rất vừa vặn.' }
    ]
  },
  {
    id: 'dict_053',
    hanzi: '爸爸',
    pinyin: 'bà ba',
    hanviet: 'BÁ BÁ',
    meaning: 'Bố, cha',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '我爸爸是一名医生。', pinyin: 'wǒ bà ba shì yì míng yī shēng 。', vi: 'Bố tôi là một bác sĩ.' }
    ]
  },
  {
    id: 'dict_054',
    hanzi: '妈妈',
    pinyin: 'mā ma',
    hanviet: 'MA MA',
    meaning: 'Mẹ, má',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '妈妈做的饭菜很好吃。', pinyin: 'mā ma zuò de fàn cài hěn hǎo chī 。', vi: 'Cơm mẹ nấu rất ngon.' }
    ]
  },
  {
    id: 'dict_055',
    hanzi: '儿子',
    pinyin: 'ér zi',
    hanviet: 'NHI TỬ',
    meaning: 'Con trai',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '他的儿子今年三岁。', pinyin: 'tā de ér zi jīn nián sān suì 。', vi: 'Con trai anh ấy năm nay ba tuổi.' }
    ]
  },
  {
    id: 'dict_056',
    hanzi: '女儿',
    pinyin: 'nǚ ér',
    hanviet: 'NỮ NHI',
    meaning: 'Con gái',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '我女儿很喜欢画画。', pinyin: 'wǒ nǚ ér hěn xǐ huan huà huà 。', vi: 'Con gái tôi rất thích vẽ tranh.' }
    ]
  },
  {
    id: 'dict_057',
    hanzi: '哥哥',
    pinyin: 'gē ge',
    hanviet: 'CA CA',
    meaning: 'Anh trai',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '我哥哥比我大两岁。', pinyin: 'wǒ gē ge bǐ wǒ dà liǎng suì 。', vi: 'Anh trai lớn hơn tôi hai tuổi.' }
    ]
  },
  {
    id: 'dict_058',
    hanzi: '弟弟',
    pinyin: 'dì di',
    hanviet: 'ĐỆ ĐỆ',
    meaning: 'Em trai',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '我弟弟是一名大学生。', pinyin: 'wǒ dì di shì yì míng dà xué shēng 。', vi: 'Em trai tôi là sinh viên đại học.' }
    ]
  },
  {
    id: 'dict_059',
    hanzi: '姐姐',
    pinyin: 'jiě jie',
    hanviet: 'TỶ TỶ',
    meaning: 'Chị gái',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '我姐姐在医院工作。', pinyin: 'wǒ jiě jie zài yī yuàn gōng zuò 。', vi: 'Chị gái tôi làm việc ở bệnh viện.' }
    ]
  },
  {
    id: 'dict_060',
    hanzi: '妹妹',
    pinyin: 'mèi mei',
    hanviet: 'MUỘI MUỘI',
    meaning: 'Em gái',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '妹妹喜欢唱歌跳舞。', pinyin: 'mèi mei xǐ huan chàng gē tiào wǔ 。', vi: 'Em gái thích ca hát nhảy múa.' }
    ]
  },
  {
    id: 'dict_061',
    hanzi: '朋友',
    pinyin: 'péng yǒu',
    hanviet: 'BẰNG HỮU',
    meaning: 'Bạn bè, người bạn',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '海内存知己，天涯若比邻。', pinyin: 'hǎi nèi cún zhī jǐ ， tiān yá ruò bǐ lín 。', vi: 'Bốn bể có bạn tri kỷ, chân trời tựa kề bên.' }
    ]
  },
  {
    id: 'dict_062',
    hanzi: '老师',
    pinyin: 'lǎo shī',
    hanviet: 'LÃO SƯ',
    meaning: 'Thầy giáo, cô giáo',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '李老师教我们汉语。', pinyin: 'lǐ lǎo shī jiào wǒ men hàn yǔ 。', vi: 'Cô Lý dạy chúng tôi tiếng Trung.' }
    ]
  },
  {
    id: 'dict_063',
    hanzi: '学生',
    pinyin: 'xué shēng',
    hanviet: 'HỌC SINH',
    meaning: 'Học sinh, sinh viên',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '学校里有很多外国学生。', pinyin: 'xué xiào lǐ yǒu hěn duō wài guó xué shēng 。', vi: 'Trong trường có rất nhiều lưu học sinh nước ngoài.' }
    ]
  },
  {
    id: 'dict_064',
    hanzi: '同学',
    pinyin: 'tóng xué',
    hanviet: 'ĐỒNG HỌC',
    meaning: 'Bạn học, bạn cùng lớp',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '我和他是大学同学。', pinyin: 'wǒ hé tā shì dà xué tóng xué 。', vi: 'Tôi và cậu ấy là bạn học thời đại học.' }
    ]
  },
  {
    id: 'dict_065',
    hanzi: '医生',
    pinyin: 'yī shēng',
    hanviet: 'Y SINH',
    meaning: 'Bác sĩ',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '医生说你要多喝水。', pinyin: 'yī shēng shuō nǐ yào duō hē shuǐ 。', vi: 'Bác sĩ nói bạn phải uống nhiều nước.' }
    ]
  },
  {
    id: 'dict_066',
    hanzi: '先生',
    pinyin: 'xiān shēng',
    hanviet: 'TIÊN SINH',
    meaning: 'Ông, ngài, chồng',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '王先生正在开会。', pinyin: 'wáng xiān shēng zhèng zài kāi huì 。', vi: 'Ông Vương đang họp.' }
    ]
  },
  {
    id: 'dict_067',
    hanzi: '小姐',
    pinyin: 'xiǎo jiě',
    hanviet: 'TIỂU THƯ',
    meaning: 'Cô, tiểu thư',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '请问王小姐在吗？', pinyin: 'qǐng wèn wáng xiǎo jiě zài ma ？', vi: 'Xin hỏi cô Vương có ở đây không?' }
    ]
  },
  {
    id: 'dict_068',
    hanzi: '人',
    pinyin: 'rén',
    hanviet: 'NHÂN',
    meaning: 'Người, con người',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '中国人很热情。', pinyin: 'zhōng guó rén hěn rè qíng 。', vi: 'Người Trung Quốc rất nhiệt tình.' }
    ]
  },
  {
    id: 'dict_069',
    hanzi: '男',
    pinyin: 'nán',
    hanviet: 'NAM',
    meaning: 'Nam, đàn ông',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '他是我的男朋友。', pinyin: 'tā shì wǒ de nán péng yǒu 。', vi: 'Anh ấy là bạn trai của tôi.' }
    ]
  },
  {
    id: 'dict_070',
    hanzi: '女',
    pinyin: 'nǚ',
    hanviet: 'NỮ',
    meaning: 'Nữ, phụ nữ',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '那个女孩子很聪明。', pinyin: 'nà ge nǚ hái zi hěn cōng ming 。', vi: 'Cô bé gái đó rất thông minh.' }
    ]
  },
  {
    id: 'dict_071',
    hanzi: '吃',
    pinyin: 'chī',
    hanviet: 'CẬT',
    meaning: 'Ăn',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '你喜欢吃中国菜吗？', pinyin: 'nǐ xǐ huan chī zhōng guó cài ma ？', vi: 'Bạn thích ăn món Trung Quốc không?' }
    ]
  },
  {
    id: 'dict_072',
    hanzi: '喝',
    pinyin: 'hē',
    hanviet: 'HÁT',
    meaning: 'Uống',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '我想喝一杯水。', pinyin: 'wǒ xiǎng hē yì bēi shuǐ 。', vi: 'Tôi muốn uống một cốc nước.' }
    ]
  },
  {
    id: 'dict_073',
    hanzi: '茶',
    pinyin: 'chá',
    hanviet: 'TRÀ',
    meaning: 'Trà, chè',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '中国人很喜欢喝绿茶。', pinyin: 'zhōng guó rén hěn xǐ huan hē lǜ chá 。', vi: 'Người Trung Quốc rất thích uống trà xanh.' }
    ]
  },
  {
    id: 'dict_074',
    hanzi: '水',
    pinyin: 'shuǐ',
    hanviet: 'THỦY',
    meaning: 'Nước',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '口渴了，喝点水吧。', pinyin: 'kǒu kě le ， hē diǎn shuǐ ba 。', vi: 'Khát nước rồi, uống chút nước đi.' }
    ]
  },
  {
    id: 'dict_075',
    hanzi: '米饭',
    pinyin: 'mǐ fàn',
    hanviet: 'MỄ PHẠN',
    meaning: 'Cơm',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '中午我吃了一碗米饭。', pinyin: 'zhōng wǔ wǒ chī le yì wǎn mǐ fàn 。', vi: 'Buổi trưa tôi đã ăn một bát cơm.' }
    ]
  },
  {
    id: 'dict_076',
    hanzi: '菜',
    pinyin: 'cài',
    hanviet: 'THÁI',
    meaning: 'Món ăn, rau',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '今天的菜很丰盛。', pinyin: 'jīn tiān de cài hěn fēng shèng 。', vi: 'Món ăn hôm nay rất phong phú.' }
    ]
  },
  {
    id: 'dict_077',
    hanzi: '苹果',
    pinyin: 'píng guǒ',
    hanviet: 'BÌNH QUẢ',
    meaning: 'Quả táo',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '每天吃一个苹果对健康好。', pinyin: 'měi tiān chī yí gè píng guǒ duì jiàn kāng hǎo 。', vi: 'Mỗi ngày ăn một quả táo rất tốt cho sức khỏe.' }
    ]
  },
  {
    id: 'dict_078',
    hanzi: '水果',
    pinyin: 'shuǐ guǒ',
    hanviet: 'THỦY QUẢ',
    meaning: 'Hoa quả, trái cây',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '多吃水果皮肤好。', pinyin: 'duō chī shuǐ guǒ pí fū hǎo 。', vi: 'Ăn nhiều hoa quả da dẻ sẽ đẹp.' }
    ]
  },
  {
    id: 'dict_079',
    hanzi: '面条',
    pinyin: 'miàn tiáo',
    hanviet: 'MIẾN ĐIỀU',
    meaning: 'Mì, sợi mì',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '过生日要吃长寿面条。', pinyin: 'guò shēng rì yào chī cháng shòu miàn tiáo 。', vi: 'Đến ngày sinh nhật thì nên ăn mì trường thọ.' }
    ]
  },
  {
    id: 'dict_080',
    hanzi: '咖啡',
    pinyin: 'kā fēi',
    hanviet: 'CA PHÊ',
    meaning: 'Cà phê',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '早上喝一杯咖啡很提神。', pinyin: 'zǎo shàng hē yì bēi kā fēi hěn tí shén 。', vi: 'Buổi sáng uống một tách cà phê rất tỉnh táo.' }
    ]
  },
  {
    id: 'dict_081',
    hanzi: '牛奶',
    pinyin: 'niú nǎi',
    hanviet: 'NGƯU NÃI',
    meaning: 'Sữa bò, sữa tươi',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '睡觉前喝杯热牛奶。', pinyin: 'shuì jiào qián hē bēi rè niú nǎi 。', vi: 'Trước khi đi ngủ hãy uống một cốc sữa ấm.' }
    ]
  },
  {
    id: 'dict_082',
    hanzi: '鸡蛋',
    pinyin: 'jī dàn',
    hanviet: 'KÊ ĐÃN',
    meaning: 'Trứng gà',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '早餐吃两个鸡蛋。', pinyin: 'zǎo cān chī liǎng gè jī dàn 。', vi: 'Bữa sáng ăn hai quả trứng gà.' }
    ]
  },
  {
    id: 'dict_083',
    hanzi: '鱼',
    pinyin: 'yú',
    hanviet: 'NGƯ',
    meaning: 'Cá',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '猫非常喜欢吃鱼。', pinyin: 'māo fēi cháng xǐ huan chī yú 。', vi: 'Mèo rất thích ăn cá.' }
    ]
  },
  {
    id: 'dict_084',
    hanzi: '肉',
    pinyin: 'ròu',
    hanviet: 'NHỤC',
    meaning: 'Thịt',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '我不太喜欢吃肥肉。', pinyin: 'wǒ bú tài xǐ huan chī féi ròu 。', vi: 'Tôi không thích ăn thịt mỡ lắm.' }
    ]
  },
  {
    id: 'dict_085',
    hanzi: '西瓜',
    pinyin: 'xī guā',
    hanviet: 'TÂY QUA',
    meaning: 'Dưa hấu',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '夏天的西瓜又甜又凉。', pinyin: 'xià tiān de xī guā yòu tián yòu liáng 。', vi: 'Dưa hấu mùa hè vừa ngọt vừa mát.' }
    ]
  },
  {
    id: 'dict_086',
    hanzi: '学习',
    pinyin: 'xué xí',
    hanviet: 'HỌC TẬP',
    meaning: 'Học tập, học',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '活到老，学到老。', pinyin: 'huó dào lǎo ， xué dào lǎo 。', vi: 'Học, học nữa, học mãi (sống đến già, học đến già).' }
    ]
  },
  {
    id: 'dict_087',
    hanzi: '工作',
    pinyin: 'gōng zuò',
    hanviet: 'CÔNG TÁC',
    meaning: 'Làm việc, công việc',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '他在一家外企工作。', pinyin: 'tā zài yì jiā wài qǐ gōng zuò 。', vi: 'Anh ấy làm việc ở một doanh nghiệp nước ngoài.' }
    ]
  },
  {
    id: 'dict_088',
    hanzi: '看',
    pinyin: 'kàn',
    hanviet: 'KHÁN',
    meaning: 'Xem, nhìn, ngắm',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '周末我常看电影。', pinyin: 'zhōu mò wǒ cháng kàn diàn yǐng 。', vi: 'Cuối tuần tôi thường xem phim.' }
    ]
  },
  {
    id: 'dict_089',
    hanzi: '听',
    pinyin: 'tīng',
    hanviet: 'THÍNH',
    meaning: 'Nghe',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '你听，谁在唱歌？', pinyin: 'nǐ tīng ， shuí zài chàng gē ？', vi: 'Bạn nghe kìa, ai đang hát thế?' }
    ]
  },
  {
    id: 'dict_090',
    hanzi: '说',
    pinyin: 'shuō',
    hanviet: 'THUYẾT',
    meaning: 'Nói',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '请你说慢一点儿。', pinyin: 'qǐng nǐ shuō màn yì diǎn ér 。', vi: 'Xin bạn hãy nói chậm lại một chút.' }
    ]
  },
  {
    id: 'dict_091',
    hanzi: '读',
    pinyin: 'dú',
    hanviet: 'ĐỘC',
    meaning: 'Đọc',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '老师叫我们大声朗读。', pinyin: 'lǎo shī jiào wǒ men dà shēng lǎng dú 。', vi: 'Thầy giáo bảo chúng tôi đọc to rõ ràng.' }
    ]
  },
  {
    id: 'dict_092',
    hanzi: '写',
    pinyin: 'xiě',
    hanviet: 'TẢ',
    meaning: 'Viết',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '他正在练习写汉字。', pinyin: 'tā zhèng zài liàn xí xiě hàn zì 。', vi: 'Cậu ấy đang luyện viết chữ Hán.' }
    ]
  },
  {
    id: 'dict_093',
    hanzi: '买',
    pinyin: 'mǎi',
    hanviet: 'MÃI',
    meaning: 'Mua',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '我想买这件红色的衣服。', pinyin: 'wǒ xiǎng mǎi zhè jiàn hóng sè de yī fu 。', vi: 'Tôi muốn mua chiếc áo màu đỏ này.' }
    ]
  },
  {
    id: 'dict_094',
    hanzi: '卖',
    pinyin: 'mài',
    hanviet: 'MẠI',
    meaning: 'Bán',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '这家商店卖水果吗？', pinyin: 'zhè jiā shāng diàn mài shuǐ guǒ ma ？', vi: 'Cửa hàng này có bán hoa quả không?' }
    ]
  },
  {
    id: 'dict_095',
    hanzi: '去',
    pinyin: 'qù',
    hanviet: 'KHỨ',
    meaning: 'Đi',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '我们一起去超市吧。', pinyin: 'wǒ men yì qǐ qù chāo shì ba 。', vi: 'Chúng ta cùng đi siêu thị nhé.' }
    ]
  },
  {
    id: 'dict_096',
    hanzi: '来',
    pinyin: 'lái',
    hanviet: 'LAI',
    meaning: 'Đến, tới',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '有朋自远方来，不亦乐乎。', pinyin: 'yǒu péng zì yuǎn fāng lái ， bú yì lè hū 。', vi: 'Có bạn từ phương xa tới, chẳng vui lắm sao.' }
    ]
  },
  {
    id: 'dict_097',
    hanzi: '回',
    pinyin: 'huí',
    hanviet: 'HỒI',
    meaning: 'Về, quay lại',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '我要回家做晚饭了。', pinyin: 'wǒ yào huí jiā zuò wǎn fàn le 。', vi: 'Tôi phải về nhà nấu bữa tối rồi.' }
    ]
  },
  {
    id: 'dict_098',
    hanzi: '到',
    pinyin: 'dào',
    hanviet: 'ĐÁO',
    meaning: 'Đến, tới nơi',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '我到了，你在哪儿？', pinyin: 'wǒ dào le ， nǐ zài nǎ ér ？', vi: 'Tôi đến nơi rồi, bạn ở đâu thế?' }
    ]
  },
  {
    id: 'dict_099',
    hanzi: '想',
    pinyin: 'xiǎng',
    hanviet: 'TƯỞNG',
    meaning: 'Muốn, nhớ, suy nghĩ',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '我很想念我的家人。', pinyin: 'wǒ hěn xiǎng niàn wǒ de jiā rén 。', vi: 'Tôi rất nhớ gia đình mình.' }
    ]
  },
  {
    id: 'dict_100',
    hanzi: '要',
    pinyin: 'yào',
    hanviet: 'YẾU',
    meaning: 'Cần, muốn, sắp',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '我要一杯冰红茶。', pinyin: 'wǒ yào yì bēi bīng hóng chá 。', vi: 'Tôi muốn một cốc hồng trà đá.' }
    ]
  },
  {
    id: 'dict_101',
    hanzi: '能',
    pinyin: 'néng',
    hanviet: 'NĂNG',
    meaning: 'Có thể (năng lực, điều kiện)',
    pos: 'Động từ khuyết thiếu',
    level: 'HSK1',
    examples: [
      { zh: '我能帮你做什么吗？', pinyin: 'wǒ néng bāng nǐ zuò shén me ma ？', vi: 'Tôi có thể giúp bạn việc gì không?' }
    ]
  },
  {
    id: 'dict_102',
    hanzi: '会',
    pinyin: 'huì',
    hanviet: 'HỘI',
    meaning: 'Biết (qua học hỏi), sẽ',
    pos: 'Động từ khuyết thiếu',
    level: 'HSK1',
    examples: [
      { zh: '我会说一点儿汉语。', pinyin: 'wǒ huì shuō yì diǎn ér hàn yǔ 。', vi: 'Tôi biết nói một chút tiếng Trung.' }
    ]
  },
  {
    id: 'dict_103',
    hanzi: '可以',
    pinyin: 'kě yǐ',
    hanviet: 'KHẢ DĨ',
    meaning: 'Có thể, được phép',
    pos: 'Động từ khuyết thiếu',
    level: 'HSK2',
    examples: [
      { zh: '我可以坐在这里吗？', pinyin: 'wǒ kě yǐ zuò zài zhè lǐ ma ？', vi: 'Tôi có thể ngồi ở đây được không?' }
    ]
  },
  {
    id: 'dict_104',
    hanzi: '睡觉',
    pinyin: 'shuì jiào',
    hanviet: 'THỤY GIÁC',
    meaning: 'Ngủ, đi ngủ',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '早点睡觉对身体好。', pinyin: 'zǎo diǎn shuì jiào duì shēn tǐ hǎo 。', vi: 'Đi ngủ sớm rất tốt cho cơ thể.' }
    ]
  },
  {
    id: 'dict_105',
    hanzi: '起床',
    pinyin: 'qǐ chuáng',
    hanviet: 'KHỞI SÀNG',
    meaning: 'Thức dậy',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '我每天早上六点起床。', pinyin: 'wǒ měi tiān zǎo shàng liù diǎn qǐ chuáng 。', vi: 'Mỗi sáng tôi đều thức dậy lúc sáu giờ.' }
    ]
  },
  {
    id: 'dict_106',
    hanzi: '打电话',
    pinyin: 'dǎ diàn huà',
    hanviet: 'ĐẢ ĐIỆN THOẠI',
    meaning: 'Gọi điện thoại',
    pos: 'Cụm động từ',
    level: 'HSK1',
    examples: [
      { zh: '他正在给妈妈打电话。', pinyin: 'tā zhèng zài gěi mā ma dǎ diàn huà 。', vi: 'Anh ấy đang gọi điện thoại cho mẹ.' }
    ]
  },
  {
    id: 'dict_107',
    hanzi: '开',
    pinyin: 'kāi',
    hanviet: 'KHAI',
    meaning: 'Mở, lái (xe), bật',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '请开门，是我。', pinyin: 'qǐng kāi mén ， shì wǒ 。', vi: 'Xin mở cửa, là tôi đây.' }
    ]
  },
  {
    id: 'dict_108',
    hanzi: '坐',
    pinyin: 'zuò',
    hanviet: 'TỌA',
    meaning: 'Ngồi, đi (xe)',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '请坐，喝杯热茶吧。', pinyin: 'qǐng zuò ， hē bēi rè chá ba 。', vi: 'Mời ngồi, uống một tách trà nóng nhé.' }
    ]
  },
  {
    id: 'dict_109',
    hanzi: '住',
    pinyin: 'zhù',
    hanviet: 'TRÚ',
    meaning: 'Ở, cư trú',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '他在北京住了一年。', pinyin: 'tā zài běi jīng zhù le yì nián 。', vi: 'Anh ấy đã sống ở Bắc Kinh một năm.' }
    ]
  },
  {
    id: 'dict_110',
    hanzi: '问',
    pinyin: 'wèn',
    hanviet: 'VẤN',
    meaning: 'Hỏi',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '有什么不懂的尽管问。', pinyin: 'yǒu shén me bù dǒng de jǐn guǎn wèn 。', vi: 'Có gì không hiểu bạn cứ tự nhiên hỏi nhé.' }
    ]
  },
  {
    id: 'dict_111',
    hanzi: '走',
    pinyin: 'zǒu',
    hanviet: 'TẨU',
    meaning: 'Đi bộ, rời đi',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '我们慢慢走回去吧。', pinyin: 'wǒ men màn màn zǒu huí qù ba 。', vi: 'Chúng ta thong thả đi bộ về nhé.' }
    ]
  },
  {
    id: 'dict_112',
    hanzi: '跑',
    pinyin: 'pǎo',
    hanviet: 'BÀO',
    meaning: 'Chạy',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '他跑步跑得很快。', pinyin: 'tā pǎo bù pǎo dé hěn kuài 。', vi: 'Anh ấy chạy bộ rất nhanh.' }
    ]
  },
  {
    id: 'dict_113',
    hanzi: '跳舞',
    pinyin: 'tiào wǔ',
    hanviet: 'KHIÊU VŨ',
    meaning: 'Khiêu vũ, nhảy múa',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '妹妹很擅长跳舞。', pinyin: 'mèi mei hěn shàn cháng tiào wǔ 。', vi: 'Em gái rất giỏi khiêu vũ.' }
    ]
  },
  {
    id: 'dict_114',
    hanzi: '唱歌',
    pinyin: 'chàng gē',
    hanviet: 'XƯỚNG CA',
    meaning: 'Hát, ca hát',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '我们去KTV唱歌吧。', pinyin: 'wǒ men qù K T V chàng gē ba 。', vi: 'Chúng mình đi hát karaoke đi.' }
    ]
  },
  {
    id: 'dict_115',
    hanzi: '游泳',
    pinyin: 'yóu yǒng',
    hanviet: 'DU VỊNH',
    meaning: 'Bơi lội',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '夏天游泳真舒服。', pinyin: 'xià tiān yóu yǒng zhēn shū fú 。', vi: 'Mùa hè đi bơi thật là sảng khoái.' }
    ]
  },
  {
    id: 'dict_116',
    hanzi: '旅游',
    pinyin: 'lǚ yóu',
    hanviet: 'LỮ DU',
    meaning: 'Đi du lịch',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '明年我想去中国旅游。', pinyin: 'míng nián wǒ xiǎng qù zhōng guó lǚ yóu 。', vi: 'Năm sau tôi muốn đi du lịch Trung Quốc.' }
    ]
  },
  {
    id: 'dict_117',
    hanzi: '运动',
    pinyin: 'yùn dòng',
    hanviet: 'VẬN ĐỘNG',
    meaning: 'Vận động, thể thao',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '每天运动一个小时。', pinyin: 'měi tiān yùn dòng yí gè xiǎo shí 。', vi: 'Mỗi ngày hãy vận động một tiếng đồng hồ.' }
    ]
  },
  {
    id: 'dict_118',
    hanzi: '帮助',
    pinyin: 'bāng zhù',
    hanviet: 'BANG TRỢ',
    meaning: 'Giúp đỡ',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '互相帮助是中华美德。', pinyin: 'hù xiāng bāng zhù shì zhōng huá měi dé 。', vi: 'Giúp đỡ lẫn nhau là một nét đẹp truyền thống.' }
    ]
  },
  {
    id: 'dict_119',
    hanzi: '找',
    pinyin: 'zhǎo',
    hanviet: 'TRẢO',
    meaning: 'Tìm, thối lại (tiền)',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '你在找钥匙吗？', pinyin: 'nǐ zài zhǎo yào shi ma ？', vi: 'Bạn đang tìm chìa khóa phải không?' }
    ]
  },
  {
    id: 'dict_120',
    hanzi: '穿',
    pinyin: 'chuān',
    hanviet: 'XUYÊN',
    meaning: 'Mặc (áo), đi (giày)',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '今天天冷，多穿点衣服。', pinyin: 'jīn tiān tiān lěng ， duō chuān diǎn yī fu 。', vi: 'Hôm nay trời lạnh, hãy mặc thêm áo ấm.' }
    ]
  },
  {
    id: 'dict_121',
    hanzi: '懂',
    pinyin: 'dǒng',
    hanviet: 'ĐỔNG',
    meaning: 'Hiểu, biết',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '你听懂我的话了吗？', pinyin: 'nǐ tīng dǒng wǒ de huà le ma ？', vi: 'Bạn có hiểu lời tôi nói không?' }
    ]
  },
  {
    id: 'dict_122',
    hanzi: '笑',
    pinyin: 'xiào',
    hanviet: 'TIẾU',
    meaning: 'Cười',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '她笑起来非常迷人。', pinyin: 'tā xiào qǐ lái fēi cháng mí rén 。', vi: 'Nụ cười của cô ấy vô cùng cuốn hút.' }
    ]
  },
  {
    id: 'dict_123',
    hanzi: '今天',
    pinyin: 'jīn tiān',
    hanviet: 'KIM THIÊN',
    meaning: 'Hôm nay',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '今天天气晴朗。', pinyin: 'jīn tiān tiān qì qíng lǎng 。', vi: 'Hôm nay trời nắng đẹp.' }
    ]
  },
  {
    id: 'dict_124',
    hanzi: '明天',
    pinyin: 'míng tiān',
    hanviet: 'MINH THIÊN',
    meaning: 'Ngày mai',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '明天我们要去图书馆。', pinyin: 'míng tiān wǒ men yào qù tú shū guǎn 。', vi: 'Ngày mai chúng tôi sẽ đi thư viện.' }
    ]
  },
  {
    id: 'dict_125',
    hanzi: '昨天',
    pinyin: 'zuó tiān',
    hanviet: 'TẠC THIÊN',
    meaning: 'Hôm qua',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '昨天晚上我看了场电影。', pinyin: 'zuó tiān wǎn shàng wǒ kàn le chǎng diàn yǐng 。', vi: 'Tối hôm qua tôi đã xem một bộ phim.' }
    ]
  },
  {
    id: 'dict_126',
    hanzi: '现在',
    pinyin: 'xiàn zài',
    hanviet: 'HIỆN TẠI',
    meaning: 'Bây giờ, hiện tại',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '现在是北京时间十点。', pinyin: 'xiàn zài shì běi jīng shí jiān shí diǎn 。', vi: 'Bây giờ là mười giờ theo giờ Bắc Kinh.' }
    ]
  },
  {
    id: 'dict_127',
    hanzi: '年',
    pinyin: 'nián',
    hanviet: 'NIÊN',
    meaning: 'Năm',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '新年快乐，万事如意！', pinyin: 'xīn nián kuài lè ， wàn shì rú yì ！', vi: 'Chúc mừng năm mới, vạn sự như ý!' }
    ]
  },
  {
    id: 'dict_128',
    hanzi: '月',
    pinyin: 'yuè',
    hanviet: 'NGUYỆT',
    meaning: 'Tháng, mặt trăng',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '九月一号是开学日。', pinyin: 'jiǔ yuè yī hào shì kāi xué rì 。', vi: 'Ngày mùng một tháng chín là ngày tựu trường.' }
    ]
  },
  {
    id: 'dict_129',
    hanzi: '日',
    pinyin: 'rì',
    hanviet: 'NHẬT',
    meaning: 'Ngày, mặt trời',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '今天是八月十五日。', pinyin: 'jīn tiān shì bā yuè shí wǔ rì 。', vi: 'Hôm nay là ngày 15 tháng 8.' }
    ]
  },
  {
    id: 'dict_130',
    hanzi: '号',
    pinyin: 'hào',
    hanviet: 'HIỆU',
    meaning: 'Ngày (khẩu ngữ), số',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '你的房间号是多少？', pinyin: 'nǐ de fáng jiān hào shì duō shǎo ？', vi: 'Số phòng của bạn là bao nhiêu?' }
    ]
  },
  {
    id: 'dict_131',
    hanzi: '星期',
    pinyin: 'xīng qī',
    hanviet: 'TINH KỲ',
    meaning: 'Tuần, thứ',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '一个星期有七天。', pinyin: 'yí gè xīng qī yǒu qī tiān 。', vi: 'Một tuần có bảy ngày.' }
    ]
  },
  {
    id: 'dict_132',
    hanzi: '点',
    pinyin: 'diǎn',
    hanviet: 'ĐIỂM',
    meaning: 'Giờ',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '早上七点我们吃早餐。', pinyin: 'zǎo shàng qī diǎn wǒ men chī zǎo cān 。', vi: 'Bảy giờ sáng chúng tôi ăn bữa điểm tâm.' }
    ]
  },
  {
    id: 'dict_133',
    hanzi: '分',
    pinyin: 'fēn',
    hanviet: 'PHÂN',
    meaning: 'Phút',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '现在差五分十点。', pinyin: 'xiàn zài chà wǔ fēn shí diǎn 。', vi: 'Bây giờ là mười giờ kém năm phút.' }
    ]
  },
  {
    id: 'dict_134',
    hanzi: '上午',
    pinyin: 'shàng wǔ',
    hanviet: 'THƯỢNG NGỌ',
    meaning: 'Buổi sáng',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '今天上午我有中文课。', pinyin: 'jīn tiān shàng wǔ wǒ yǒu zhōng wén kè 。', vi: 'Sáng nay tôi có tiết học tiếng Trung.' }
    ]
  },
  {
    id: 'dict_135',
    hanzi: '中午',
    pinyin: 'zhōng wǔ',
    hanviet: 'TRUNG NGỌ',
    meaning: 'Buổi trưa',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '中午我们一起吃面条吧。', pinyin: 'zhōng wǔ wǒ men yì qǐ chī miàn tiáo ba 。', vi: 'Buổi trưa chúng mình cùng ăn mì nhé.' }
    ]
  },
  {
    id: 'dict_136',
    hanzi: '下午',
    pinyin: 'xià wǔ',
    hanviet: 'HẠ NGỌ',
    meaning: 'Buổi chiều',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '下午两点我们开会。', pinyin: 'xià wǔ liǎng diǎn wǒ men kāi huì 。', vi: 'Hai giờ chiều chúng tôi họp.' }
    ]
  },
  {
    id: 'dict_137',
    hanzi: '晚上',
    pinyin: 'wǎn shàng',
    hanviet: 'VÃN THƯỢNG',
    meaning: 'Buổi tối',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '晚上我经常听音乐。', pinyin: 'wǎn shàng wǒ jīng cháng tīng yīn yuè 。', vi: 'Buổi tối tôi thường nghe nhạc.' }
    ]
  },
  {
    id: 'dict_138',
    hanzi: '时候',
    pinyin: 'shí hòu',
    hanviet: 'THỜI HẬU',
    meaning: 'Lúc, khi',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '你什么时候回国？', pinyin: 'nǐ shén me shí hòu huí guó ？', vi: 'Khi nào bạn về nước?' }
    ]
  },
  {
    id: 'dict_139',
    hanzi: '去年',
    pinyin: 'qù nián',
    hanviet: 'KHỨ NIÊN',
    meaning: 'Năm ngoái',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '我是去年开始学汉语的。', pinyin: 'wǒ shì qù nián kāi shǐ xué hàn yǔ de 。', vi: 'Tôi bắt đầu học tiếng Trung từ năm ngoái.' }
    ]
  },
  {
    id: 'dict_140',
    hanzi: '今年',
    pinyin: 'jīn nián',
    hanviet: 'KIM NIÊN',
    meaning: 'Năm nay',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '今年夏天天气特别热。', pinyin: 'jīn nián xià tiān tiān qì tè bié rè 。', vi: 'Mùa hè năm nay thời tiết đặc biệt nóng.' }
    ]
  },
  {
    id: 'dict_141',
    hanzi: '时间',
    pinyin: 'shí jiān',
    hanviet: 'THỜI GIAN',
    meaning: 'Thời gian',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '时间过得真快！', pinyin: 'shí jiān guò dé zhēn kuài ！', vi: 'Thời gian trôi nhanh thật đấy!' }
    ]
  },
  {
    id: 'dict_142',
    hanzi: '小时',
    pinyin: 'xiǎo shí',
    hanviet: 'TIỂU THỜI',
    meaning: 'Giờ đồng hồ, tiếng',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '坐飞机要三个小时。', pinyin: 'zuò fēi jī yào sān gè xiǎo shí 。', vi: 'Đi máy bay mất ba tiếng đồng hồ.' }
    ]
  },
  {
    id: 'dict_143',
    hanzi: '家',
    pinyin: 'jiā',
    hanviet: 'GIA',
    meaning: 'Nhà, gia đình',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '我想回家看望父母。', pinyin: 'wǒ xiǎng huí jiā kàn wàng fù mǔ 。', vi: 'Tôi muốn về nhà thăm bố mẹ.' }
    ]
  },
  {
    id: 'dict_144',
    hanzi: '学校',
    pinyin: 'xué xiào',
    hanviet: 'HỌC HIỆU',
    meaning: 'Trường học',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '我们的学校很美丽。', pinyin: 'wǒ men de xué xiào hěn měi lì 。', vi: 'Trường học của chúng tôi rất đẹp.' }
    ]
  },
  {
    id: 'dict_145',
    hanzi: '饭馆',
    pinyin: 'fàn guǎn',
    hanviet: 'PHẠN QUÁN',
    meaning: 'Nhà hàng, quán ăn',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '这家饭馆的菜真地道。', pinyin: 'zhè jiā fàn guǎn de cài zhēn dì dào 。', vi: 'Món ăn của quán này thật chuẩn vị.' }
    ]
  },
  {
    id: 'dict_146',
    hanzi: '商店',
    pinyin: 'shāng diàn',
    hanviet: 'THƯƠNG ĐIẾM',
    meaning: 'Cửa hàng, tiệm',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '我去商店买点日用品。', pinyin: 'wǒ qù shāng diàn mǎi diǎn rì yòng pǐn 。', vi: 'Tôi đi cửa hàng mua ít đồ dùng thường ngày.' }
    ]
  },
  {
    id: 'dict_147',
    hanzi: '医院',
    pinyin: 'yī yuàn',
    hanviet: 'Y VIỆN',
    meaning: 'Bệnh viện',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '生病了就应该去医院。', pinyin: 'shēng bìng le jiù yīng gāi qù yī yuàn 。', vi: 'Bị ốm thì nên đến bệnh viện.' }
    ]
  },
  {
    id: 'dict_148',
    hanzi: '火车站',
    pinyin: 'huǒ chē zhàn',
    hanviet: 'HỎA XA TRẠM',
    meaning: 'Ga xe lửa, ga tàu hỏa',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '他在火车站等我。', pinyin: 'tā zài huǒ chē zhàn děng wǒ 。', vi: 'Anh ấy đang đợi tôi ở ga tàu hỏa.' }
    ]
  },
  {
    id: 'dict_149',
    hanzi: '中国',
    pinyin: 'zhōng guó',
    hanviet: 'TRUNG QUỐC',
    meaning: 'Trung Quốc',
    pos: 'Danh từ riêng',
    level: 'HSK1',
    examples: [
      { zh: '中国有五千年的历史。', pinyin: 'zhōng guó yǒu wǔ qiān nián de lì shǐ 。', vi: 'Trung Quốc có năm nghìn năm lịch sử.' }
    ]
  },
  {
    id: 'dict_150',
    hanzi: '北京',
    pinyin: 'běi jīng',
    hanviet: 'BẮC KINH',
    meaning: 'Bắc Kinh',
    pos: 'Danh từ riêng',
    level: 'HSK1',
    examples: [
      { zh: '北京是中国的首都。', pinyin: 'běi jīng shì zhōng guó de shǒu dū 。', vi: 'Bắc Kinh là thủ đô của Trung Quốc.' }
    ]
  },
  {
    id: 'dict_151',
    hanzi: '机场',
    pinyin: 'jī chǎng',
    hanviet: 'CƠ TRƯỜNG',
    meaning: 'Sân bay, phi trường',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '我们开车去机场接朋友。', pinyin: 'wǒ men kāi chē qù jī chǎng jiē péng yǒu 。', vi: 'Chúng tôi lái xe ra sân bay đón bạn.' }
    ]
  },
  {
    id: 'dict_152',
    hanzi: '教室',
    pinyin: 'jiào shì',
    hanviet: 'GIÁO THẤT',
    meaning: 'Phòng học, lớp học',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '请大家安静，教室内请勿大声喧哗。', pinyin: 'qǐng dà jiā ān jìng ， jiào shì nèi qǐng wù dà shēng xuān huá 。', vi: 'Mọi người giữ trật tự, trong lớp xin đừng ồn ào.' }
    ]
  },
  {
    id: 'dict_153',
    hanzi: '房间',
    pinyin: 'fáng jiān',
    hanviet: 'PHÒNG GIAN',
    meaning: 'Căn phòng',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '我的房间很干净明亮。', pinyin: 'wǒ de fáng jiān hěn gān jìng míng liàng 。', vi: 'Phòng của tôi rất sạch sẽ và sáng sủa.' }
    ]
  },
  {
    id: 'dict_154',
    hanzi: '上',
    pinyin: 'shàng',
    hanviet: 'THƯỢNG',
    meaning: 'Trên, lên',
    pos: 'Phương vị từ',
    level: 'HSK1',
    examples: [
      { zh: '桌子上有一本书。', pinyin: 'zhuō zi shàng yǒu yì běn shū 。', vi: 'Trên bàn có một cuốn sách.' }
    ]
  },
  {
    id: 'dict_155',
    hanzi: '下',
    pinyin: 'xià',
    hanviet: 'HẠ',
    meaning: 'Dưới, xuống',
    pos: 'Phương vị từ',
    level: 'HSK1',
    examples: [
      { zh: '小猫趴在椅子下面。', pinyin: 'xiǎo māo pā zài yǐ zi xià miàn 。', vi: 'Chú mèo con nằm bò dưới ghế.' }
    ]
  },
  {
    id: 'dict_156',
    hanzi: '前',
    pinyin: 'qián',
    hanviet: 'TIỀN',
    meaning: 'Trước, phía trước',
    pos: 'Phương vị từ',
    level: 'HSK1',
    examples: [
      { zh: '学校前面是一个大公园。', pinyin: 'xué xiào qián miàn shì yí gè dà gōng yuán 。', vi: 'Phía trước trường học là một công viên lớn.' }
    ]
  },
  {
    id: 'dict_157',
    hanzi: '后',
    pinyin: 'hòu',
    hanviet: 'HẬU',
    meaning: 'Sau, phía sau',
    pos: 'Phương vị từ',
    level: 'HSK1',
    examples: [
      { zh: '房子后面有一棵大树。', pinyin: 'fáng zi hòu miàn yǒu yì kē dà shù 。', vi: 'Sau nhà có một cái cây to.' }
    ]
  },
  {
    id: 'dict_158',
    hanzi: '里',
    pinyin: 'lǐ',
    hanviet: 'LÝ',
    meaning: 'Trong, bên trong',
    pos: 'Phương vị từ',
    level: 'HSK1',
    examples: [
      { zh: '书包里有什么东西？', pinyin: 'shū bāo lǐ yǒu shén me dōng xī ？', vi: 'Trong cặp sách có những đồ vật gì?' }
    ]
  },
  {
    id: 'dict_159',
    hanzi: '外',
    pinyin: 'wài',
    hanviet: 'NGOẠI',
    meaning: 'Ngoài, bên ngoài',
    pos: 'Phương vị từ',
    level: 'HSK2',
    examples: [
      { zh: '门外有人在敲门。', pinyin: 'mén wài yǒu rén zài qiāo mén 。', vi: 'Ngoài cửa có người đang gõ cửa.' }
    ]
  },
  {
    id: 'dict_160',
    hanzi: '左边',
    pinyin: 'zuǒ biān',
    hanviet: 'TẢ BIÊN',
    meaning: 'Bên trái',
    pos: 'Phương vị từ',
    level: 'HSK2',
    examples: [
      { zh: '往左边走就是书店。', pinyin: 'wǎng zuǒ biān zǒu jiù shì shū diàn 。', vi: 'Đi về phía bên trái là tới hiệu sách.' }
    ]
  },
  {
    id: 'dict_161',
    hanzi: '右边',
    pinyin: 'yòu biān',
    hanviet: 'HỮU BIÊN',
    meaning: 'Bên phải',
    pos: 'Phương vị từ',
    level: 'HSK2',
    examples: [
      { zh: '右边的那位是王经理。', pinyin: 'yòu biān de nà wèi shì wáng jīng lǐ 。', vi: 'Vị ở bên phải là giám đốc Vương.' }
    ]
  },
  {
    id: 'dict_162',
    hanzi: '书',
    pinyin: 'shū',
    hanviet: 'THƯ',
    meaning: 'Sách, cuốn sách',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '读书破万卷，下笔如有神。', pinyin: 'dú shū pò wàn juàn ， xià bǐ rú yǒu shén 。', vi: 'Đọc vạn cuốn sách, hạ bút như có thần.' }
    ]
  },
  {
    id: 'dict_163',
    hanzi: '字',
    pinyin: 'zì',
    hanviet: 'TỰ',
    meaning: 'Chữ, từ',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '这个字你写得很端正。', pinyin: 'zhè ge zì nǐ xiě dé hěn duān zhèng 。', vi: 'Chữ này bạn viết rất ngay ngắn.' }
    ]
  },
  {
    id: 'dict_164',
    hanzi: '电脑',
    pinyin: 'diàn nǎo',
    hanviet: 'ĐIỆN NÃO',
    meaning: 'Máy tính, vi tính',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '我用电脑写毕业论文。', pinyin: 'wǒ yòng diàn nǎo xiě bì yè lùn wén 。', vi: 'Tôi dùng máy tính để viết luận văn tốt nghiệp.' }
    ]
  },
  {
    id: 'dict_165',
    hanzi: '电视',
    pinyin: 'diàn shì',
    hanviet: 'ĐIỆN THỊ',
    meaning: 'Ti vi, truyền hình',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '晚上全家人一起看电视。', pinyin: 'wǎn shàng quán jiā rén yì qǐ kàn diàn shì 。', vi: 'Buổi tối cả gia đình quây quần xem tivi.' }
    ]
  },
  {
    id: 'dict_166',
    hanzi: '电影',
    pinyin: 'diàn yǐng',
    hanviet: 'ĐIỆN ẢNH',
    meaning: 'Phim, điện ảnh',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '这部电影非常感人。', pinyin: 'zhè bù diàn yǐng fēi cháng gǎn rén 。', vi: 'Bộ phim này vô cùng cảm động.' }
    ]
  },
  {
    id: 'dict_167',
    hanzi: '飞机',
    pinyin: 'fēi jī',
    hanviet: 'PHI CƠ',
    meaning: 'Máy bay',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '坐飞机去上海只要两小时。', pinyin: 'zuò fēi jī qù shàng hǎi zhǐ yào liǎng xiǎo shí 。', vi: 'Đi máy bay đến Thượng Hải chỉ mất hai giờ.' }
    ]
  },
  {
    id: 'dict_168',
    hanzi: '出租车',
    pinyin: 'chū zū chē',
    hanviet: 'XUẤT TÔ XA',
    meaning: 'Xe taxi',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '下雨了，我们打出租车吧。', pinyin: 'xià yǔ le ， wǒ men dǎ chū zū chē ba 。', vi: 'Trời mưa rồi, chúng mình bắt taxi đi.' }
    ]
  },
  {
    id: 'dict_169',
    hanzi: '公共汽车',
    pinyin: 'gōng gòng qì chē',
    hanviet: 'CÔNG CỘNG KHÍ XA',
    meaning: 'Xe buýt, xe bus',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '坐公共汽车很环保又便宜。', pinyin: 'zuò gōng gòng qì chē hěn huán bǎo yòu pián yi 。', vi: 'Đi xe buýt rất bảo vệ môi trường và rẻ.' }
    ]
  },
  {
    id: 'dict_170',
    hanzi: '自行车',
    pinyin: 'zì xíng chē',
    hanviet: 'TỰ HÀNH XA',
    meaning: 'Xe đạp',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '骑自行车上下班有益健康。', pinyin: 'qí zì xíng chē shàng xià bān yǒu yì jiàn kāng 。', vi: 'Đạp xe đi làm rất có ích cho sức khỏe.' }
    ]
  },
  {
    id: 'dict_171',
    hanzi: '天气',
    pinyin: 'tiān qì',
    hanviet: 'THIÊN KHÍ',
    meaning: 'Thời tiết',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '晴空万里，天气真不错。', pinyin: 'qíng kōng wàn lǐ ， tiān qì zhēn bú cuò 。', vi: 'Bầu trời trong xanh, thời tiết thật đẹp.' }
    ]
  },
  {
    id: 'dict_172',
    hanzi: '雨',
    pinyin: 'yǔ',
    hanviet: 'VŨ',
    meaning: 'Mưa',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '外面下大雨了，带上伞吧。', pinyin: 'wài miàn xià dà yǔ le ， dài shàng sǎn ba 。', vi: 'Bên ngoài mưa to rồi, nhớ mang theo ô nhé.' }
    ]
  },
  {
    id: 'dict_173',
    hanzi: '雪',
    pinyin: 'xuě',
    hanviet: 'TUYẾT',
    meaning: 'Tuyết',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '冬天北京经常下雪。', pinyin: 'dōng tiān běi jīng jīng cháng xià xuě 。', vi: 'Mùa đông Bắc Kinh thường có tuyết rơi.' }
    ]
  },
  {
    id: 'dict_174',
    hanzi: '钱',
    pinyin: 'qián',
    hanviet: 'TIỀN',
    meaning: 'Tiền',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '一分钱一分货。', pinyin: 'yì fēn qián yì fēn huò 。', vi: 'Tiền nào của nấy.' }
    ]
  },
  {
    id: 'dict_175',
    hanzi: '猫',
    pinyin: 'māo',
    hanviet: 'MIÊU',
    meaning: 'Mèo',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '那只小黑猫特别黏人。', pinyin: 'nà zhī xiǎo hēi māo tè bié nián rén 。', vi: 'Chú mèo đen đó rất quấn người.' }
    ]
  },
  {
    id: 'dict_176',
    hanzi: '狗',
    pinyin: 'gǒu',
    hanviet: 'CẨU',
    meaning: 'Chó',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '狗是人类最忠实的朋友。', pinyin: 'gǒu shì rén lèi zuì zhōng shí de péng yǒu 。', vi: 'Chó là người bạn trung thành nhất của loài người.' }
    ]
  },
  {
    id: 'dict_177',
    hanzi: '好',
    pinyin: 'hǎo',
    hanviet: 'HẢO',
    meaning: 'Tốt, đẹp, hay, khỏe',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '祝你一切都好！', pinyin: 'zhù nǐ yí qiè dōu hǎo ！', vi: 'Chúc bạn mọi sự tốt lành!' }
    ]
  },
  {
    id: 'dict_178',
    hanzi: '大',
    pinyin: 'dà',
    hanviet: 'ĐẠI',
    meaning: 'To, lớn',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '这间屋子很大很明亮。', pinyin: 'zhè jiān wū zi hěn dà hěn míng liàng 。', vi: 'Căn phòng này rất rộng và sáng sủa.' }
    ]
  },
  {
    id: 'dict_179',
    hanzi: '小',
    pinyin: 'xiǎo',
    hanviet: 'TIỂU',
    meaning: 'Nhỏ, bé',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '麻雀虽小，五脏俱全。', pinyin: 'má què suī xiǎo ， wǔ zāng jù quán 。', vi: 'Chim sẻ tuy nhỏ nhưng ngũ tạng đầy đủ.' }
    ]
  },
  {
    id: 'dict_180',
    hanzi: '多',
    pinyin: 'duō',
    hanviet: 'ĐA',
    meaning: 'Nhiều',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '路上有很多车。', pinyin: 'lù shang yǒu hěn duō chē 。', vi: 'Trên đường có rất nhiều xe cộ.' }
    ]
  },
  {
    id: 'dict_181',
    hanzi: '少',
    pinyin: 'shǎo',
    hanviet: 'THIỂU',
    meaning: 'Ít',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '说话要真诚，少吹牛。', pinyin: 'shuō huà yào zhēn chéng ， shǎo chuī niú 。', vi: 'Nói năng nên chân thành, bớt khoác lác.' }
    ]
  },
  {
    id: 'dict_182',
    hanzi: '冷',
    pinyin: 'lěng',
    hanviet: 'LÃNH',
    meaning: 'Lạnh',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '多穿件衣服，别着凉了。', pinyin: 'duō chuān jiàn yī fu ， bié zháo liáng le 。', vi: 'Mặc thêm áo vào, coi chừng bị lạnh đấy.' }
    ]
  },
  {
    id: 'dict_183',
    hanzi: '热',
    pinyin: 'rè',
    hanviet: 'NHIỆT',
    meaning: 'Nóng',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '天气太热了，去吃冰淇淋吧。', pinyin: 'tiān qì tài rè le ， qù chī bīng qí lín ba 。', vi: 'Thời tiết nóng quá, đi ăn kem thôi.' }
    ]
  },
  {
    id: 'dict_184',
    hanzi: '高兴',
    pinyin: 'gāo xìng',
    hanviet: 'CAO HƯNG',
    meaning: 'Vui vẻ, phấn khởi',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '听到这个好消息，大家都很高兴。', pinyin: 'tīng dào zhè ge hǎo xiāo xī ， dà jiā dōu hěn gāo xìng 。', vi: 'Nghe được tin vui này, mọi người đều rất phấn khởi.' }
    ]
  },
  {
    id: 'dict_185',
    hanzi: '漂亮',
    pinyin: 'piào liang',
    hanviet: 'PHIÊU LƯỢNG',
    meaning: 'Xinh đẹp, đẹp đẽ',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '你穿这身裙子真漂亮！', pinyin: 'nǐ chuān zhè shēn qún zǐ zhēn piào liang ！', vi: 'Bạn mặc chiếc váy này trông xinh đẹp thật đấy!' }
    ]
  },
  {
    id: 'dict_186',
    hanzi: '累',
    pinyin: 'lèi',
    hanviet: 'LŨY',
    meaning: 'Mệt, mệt mỏi',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '工作了一整天，感觉有点累。', pinyin: 'gōng zuò le yì zhěng tiān ， gǎn jué yǒu diǎn lèi 。', vi: 'Làm việc cả ngày, cảm thấy có chút mệt mỏi.' }
    ]
  },
  {
    id: 'dict_187',
    hanzi: '忙',
    pinyin: 'máng',
    hanviet: 'MANG',
    meaning: 'Bận rộn',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '最近你忙什么呢？', pinyin: 'zuì jìn nǐ máng shén me ne ？', vi: 'Dạo này bạn đang bận rộn việc gì vậy?' }
    ]
  },
  {
    id: 'dict_188',
    hanzi: '贵',
    pinyin: 'guì',
    hanviet: 'QUÝ',
    meaning: 'Đắt, quý',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '太贵了，能不能便宜点儿？', pinyin: 'tài guì le ， néng bu néng pián yi diǎn ér ？', vi: 'Đắt quá, có thể giảm giá chút được không?' }
    ]
  },
  {
    id: 'dict_189',
    hanzi: '便宜',
    pinyin: 'pián yi',
    hanviet: 'TIỆN NGHI',
    meaning: 'Rẻ',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '这里的蔬菜又新鲜又便宜。', pinyin: 'zhè lǐ de shū cài yòu xīn xiān yòu pián yi 。', vi: 'Rau ở đây vừa tươi vừa rẻ.' }
    ]
  },
  {
    id: 'dict_190',
    hanzi: '快',
    pinyin: 'kuài',
    hanviet: 'KHOÁI',
    meaning: 'Nhanh, mau',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '快点儿，火车要开了！', pinyin: 'kuài diǎn ér ， huǒ chē yào kāi le ！', vi: 'Nhanh chân lên, tàu hỏa sắp chạy rồi!' }
    ]
  },
  {
    id: 'dict_191',
    hanzi: '慢',
    pinyin: 'màn',
    hanviet: 'MẠN',
    meaning: 'Chậm',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '路上小心，慢点儿开车。', pinyin: 'lù shang xiǎo xīn ， màn diǎn ér kāi chē 。', vi: 'Đi đường cẩn thận, lái xe chậm thôi nhé.' }
    ]
  },
  {
    id: 'dict_192',
    hanzi: '远',
    pinyin: 'yuǎn',
    hanviet: 'VIỄN',
    meaning: 'Xa',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '我家离学校不算太远。', pinyin: 'wǒ jiā lí xué xiào bú suàn tài yuǎn 。', vi: 'Nhà tôi cách trường học không xa lắm.' }
    ]
  },
  {
    id: 'dict_193',
    hanzi: '近',
    pinyin: 'jìn',
    hanviet: 'CẬN',
    meaning: 'Gần',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '超市就在旁边，离这里很近。', pinyin: 'chāo shì jiù zài páng biān ， lí zhè lǐ hěn jìn 。', vi: 'Siêu thị ở ngay bên cạnh, rất gần nơi này.' }
    ]
  },
  {
    id: 'dict_194',
    hanzi: '长',
    pinyin: 'cháng',
    hanviet: 'TRƯỜNG',
    meaning: 'Dài',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '中国有著名的万里长城。', pinyin: 'zhōng guó yǒu zhù míng de wàn lǐ cháng chéng 。', vi: 'Trung Quốc có Vạn Lý Trường Thành nổi tiếng.' }
    ]
  },
  {
    id: 'dict_195',
    hanzi: '新',
    pinyin: 'xīn',
    hanviet: 'TÂN',
    meaning: 'Mới',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '我买了一部新手机。', pinyin: 'wǒ mǎi le yí bù xīn shǒu jī 。', vi: 'Tôi mới mua một chiếc điện thoại mới.' }
    ]
  },
  {
    id: 'dict_196',
    hanzi: '旧',
    pinyin: 'jiù',
    hanviet: 'CỰU',
    meaning: 'Cũ',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '旧的不去，新的不来。', pinyin: 'jiù de bú qù ， xīn de bù lái 。', vi: 'Cái cũ không đi thì cái mới không tới.' }
    ]
  },
  {
    id: 'dict_197',
    hanzi: '晴',
    pinyin: 'qíng',
    hanviet: 'TÌNH',
    meaning: 'Trời quang, nắng',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '明天天气晴朗，适合外出。', pinyin: 'míng tiān tiān qì qíng lǎng ， shì hé wài chū 。', vi: 'Ngày mai trời nắng ráo, rất hợp đi ra ngoài.' }
    ]
  },
  {
    id: 'dict_198',
    hanzi: '阴',
    pinyin: 'yīn',
    hanviet: 'ÂM',
    meaning: 'U ám, râm mát',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '今天阴天，好像要下雨。', pinyin: 'jīn tiān yīn tiān ， hǎo xiàng yào xià yǔ 。', vi: 'Hôm nay trời râm, hình như sắp mưa rồi.' }
    ]
  },
  {
    id: 'dict_199',
    hanzi: '对',
    pinyin: 'duì',
    hanviet: 'ĐỐI',
    meaning: 'Đúng, chính xác',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '你的回答完全正确，很对！', pinyin: 'nǐ de huí dá wán quán zhèng què ， hěn duì ！', vi: 'Câu trả lời của bạn hoàn toàn chính xác, rất đúng!' }
    ]
  },
  {
    id: 'dict_200',
    hanzi: '错',
    pinyin: 'cuò',
    hanviet: 'THÁC',
    meaning: 'Sai, nhầm lẫn',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '对不起，我打错电话了。', pinyin: 'duì bù qǐ ， wǒ dǎ cuò diàn huà le 。', vi: 'Xin lỗi, tôi gọi nhầm số điện thoại rồi.' }
    ]
  },
  {
    id: 'dict_201',
    hanzi: '容易',
    pinyin: 'róng yì',
    hanviet: 'DUNG DỊ',
    meaning: 'Dễ dàng',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '学汉字其实并不容易。', pinyin: 'xué hàn zì qí shí bìng bù róng yì 。', vi: 'Học chữ Hán thực ra không hề dễ dàng.' }
    ]
  },
  {
    id: 'dict_202',
    hanzi: '很',
    pinyin: 'hěn',
    hanviet: 'HẨN',
    meaning: 'Rất',
    pos: 'Phó từ',
    level: 'HSK1',
    examples: [
      { zh: '今天我很开心。', pinyin: 'jīn tiān wǒ hěn kāi xīn 。', vi: 'Hôm nay tôi rất vui vẻ.' }
    ]
  },
  {
    id: 'dict_203',
    hanzi: '太',
    pinyin: 'tài',
    hanviet: 'THÁI',
    meaning: 'Quá, lắm',
    pos: 'Phó từ',
    level: 'HSK1',
    examples: [
      { zh: '这道菜太好吃了！', pinyin: 'zhè dào cài tài hǎo chī le ！', vi: 'Món ăn này ngon quá đi mất!' }
    ]
  },
  {
    id: 'dict_204',
    hanzi: '不',
    pinyin: 'bù',
    hanviet: 'BẤT',
    meaning: 'Không, chẳng',
    pos: 'Phó từ',
    level: 'HSK1',
    examples: [
      { zh: '我不是日本人。', pinyin: 'wǒ bú shì rì běn rén 。', vi: 'Tôi không phải là người Nhật Bản.' }
    ]
  },
  {
    id: 'dict_205',
    hanzi: '没',
    pinyin: 'méi',
    hanviet: 'MỘI',
    meaning: 'Chưa, không có',
    pos: 'Phó từ',
    level: 'HSK1',
    examples: [
      { zh: '我还没吃早饭。', pinyin: 'wǒ hái méi chī zǎo fàn 。', vi: 'Tôi vẫn chưa ăn sáng.' }
    ]
  },
  {
    id: 'dict_206',
    hanzi: '也',
    pinyin: 'yě',
    hanviet: 'DÃ',
    meaning: 'Cũng',
    pos: 'Phó từ',
    level: 'HSK2',
    examples: [
      { zh: '我也是越南留学生。', pinyin: 'wǒ yě shì yuè nán liú xué shēng 。', vi: 'Tôi cũng là du học sinh Việt Nam.' }
    ]
  },
  {
    id: 'dict_207',
    hanzi: '都',
    pinyin: 'dōu',
    hanviet: 'ĐÔ',
    meaning: 'Đều, tất cả',
    pos: 'Phó từ',
    level: 'HSK1',
    examples: [
      { zh: '我们都喜欢学汉语。', pinyin: 'wǒ men dōu xǐ huan xué hàn yǔ 。', vi: 'Chúng tôi đều thích học tiếng Trung.' }
    ]
  },
  {
    id: 'dict_208',
    hanzi: '真',
    pinyin: 'zhēn',
    hanviet: 'CHÂN',
    meaning: 'Thật, thật sự',
    pos: 'Phó từ',
    level: 'HSK2',
    examples: [
      { zh: '你真聪明！', pinyin: 'nǐ zhēn cōng ming ！', vi: 'Bạn thật là thông minh!' }
    ]
  },
  {
    id: 'dict_209',
    hanzi: '再',
    pinyin: 'zài',
    hanviet: 'TÁI',
    meaning: 'Lại, nữa',
    pos: 'Phó từ',
    level: 'HSK2',
    examples: [
      { zh: '请你再说一遍好吗？', pinyin: 'qǐng nǐ zài shuō yí biàn hǎo ma ？', vi: 'Xin bạn nói lại một lần nữa được không?' }
    ]
  },
  {
    id: 'dict_210',
    hanzi: '就',
    pinyin: 'jiù',
    hanviet: 'TỰU',
    meaning: 'Thì, liền, ngay',
    pos: 'Phó từ',
    level: 'HSK2',
    examples: [
      { zh: '我马上就到。', pinyin: 'wǒ mǎ shàng jiù dào 。', vi: 'Tôi tới ngay đây.' }
    ]
  },
  {
    id: 'dict_211',
    hanzi: '还',
    pinyin: 'hái',
    hanviet: 'HOÀN',
    meaning: 'Còn, vẫn',
    pos: 'Phó từ',
    level: 'HSK2',
    examples: [
      { zh: '还有什么事情吗？', pinyin: 'hái yǒu shén me shì qíng ma ？', vi: 'Còn việc gì nữa không?' }
    ]
  },
  {
    id: 'dict_212',
    hanzi: '和',
    pinyin: 'hé',
    hanviet: 'HÒA',
    meaning: 'Và, cùng với',
    pos: 'Liên từ',
    level: 'HSK1',
    examples: [
      { zh: '我和爸爸去公园散步。', pinyin: 'wǒ hé bà ba qù gōng yuán sàn bù 。', vi: 'Tôi và bố đi công viên dạo bộ.' }
    ]
  },
  {
    id: 'dict_213',
    hanzi: '因为',
    pinyin: 'yīn wèi',
    hanviet: 'NHÂN VI',
    meaning: 'Bởi vì, vì',
    pos: 'Liên từ',
    level: 'HSK2',
    examples: [
      { zh: '因为下雨，所以我没去。', pinyin: 'yīn wèi xià yǔ ， suǒ yǐ wǒ méi qù 。', vi: 'Bởi vì trời mưa nên tôi không đi.' }
    ]
  },
  {
    id: 'dict_214',
    hanzi: '所以',
    pinyin: 'suǒ yǐ',
    hanviet: 'SỞ DĨ',
    meaning: 'Cho nên, vì thế',
    pos: 'Liên từ',
    level: 'HSK2',
    examples: [
      { zh: '天气好，所以心情也好。', pinyin: 'tiān qì hǎo ， suǒ yǐ xīn qíng yě hǎo 。', vi: 'Thời tiết đẹp nên tâm trạng cũng vui.' }
    ]
  },
  {
    id: 'dict_215',
    hanzi: '但是',
    pinyin: 'dàn shì',
    hanviet: 'ĐÃN THỊ',
    meaning: 'Nhưng, nhưng mà',
    pos: 'Liên từ',
    level: 'HSK2',
    examples: [
      { zh: '汉字很难，但是我喜欢学。', pinyin: 'hàn zì hěn nán ， dàn shì wǒ xǐ huan xué 。', vi: 'Chữ Hán khó, nhưng tôi thích học.' }
    ]
  },
  {
    id: 'dict_216',
    hanzi: '在',
    pinyin: 'zài',
    hanviet: 'TẠI',
    meaning: 'Ở, tại, đang',
    pos: 'Giới từ',
    level: 'HSK1',
    examples: [
      { zh: '我正在房间看书。', pinyin: 'wǒ zhèng zài fáng jiān kàn shū 。', vi: 'Tôi đang ở trong phòng đọc sách.' }
    ]
  },
  {
    id: 'dict_217',
    hanzi: '比',
    pinyin: 'bǐ',
    hanviet: 'TỶ',
    meaning: 'So với',
    pos: 'Giới từ',
    level: 'HSK2',
    examples: [
      { zh: '今天比昨天暖和多了。', pinyin: 'jīn tiān bǐ zuó tiān nuǎn huo duō le 。', vi: 'Hôm nay ấm áp hơn hôm qua nhiều.' }
    ]
  },
  {
    id: 'dict_218',
    hanzi: '从',
    pinyin: 'cóng',
    hanviet: 'TÙNG',
    meaning: 'Từ (nơi chốn/thời gian)',
    pos: 'Giới từ',
    level: 'HSK2',
    examples: [
      { zh: '从我家到公司很近。', pinyin: 'cóng wǒ jiā dào gōng sī hěn jìn 。', vi: 'Từ nhà tôi đến công ty rất gần.' }
    ]
  },
  {
    id: 'dict_219',
    hanzi: '的',
    pinyin: 'de',
    hanviet: 'ĐÍCH',
    meaning: 'Của (trợ từ sở hữu)',
    pos: 'Trợ từ',
    level: 'HSK1',
    examples: [
      { zh: '这是我的书。', pinyin: 'zhè shì wǒ de shū 。', vi: 'Đây là sách của tôi.' }
    ]
  },
  {
    id: 'dict_220',
    hanzi: '了',
    pinyin: 'liǎo',
    hanviet: 'LIỄU',
    meaning: 'Rồi (hoàn thành)',
    pos: 'Trợ từ',
    level: 'HSK1',
    examples: [
      { zh: '下课了，我们去吃饭吧。', pinyin: 'xià kè le ， wǒ men qù chī fàn ba 。', vi: 'Tan học rồi, chúng ta đi ăn cơm thôi.' }
    ]
  },
  {
    id: 'dict_221',
    hanzi: '吗',
    pinyin: 'ma',
    hanviet: 'MA',
    meaning: 'Phải không, à, ư',
    pos: 'Trợ từ nghi vấn',
    level: 'HSK1',
    examples: [
      { zh: '你好吗？', pinyin: 'nǐ hǎo ma ？', vi: 'Bạn có khỏe không?' }
    ]
  },
  {
    id: 'dict_222',
    hanzi: '呢',
    pinyin: 'ne',
    hanviet: 'NIÊ',
    meaning: 'Thế, nhỉ (hỏi tiếp nối)',
    pos: 'Trợ từ',
    level: 'HSK1',
    examples: [
      { zh: '我是越南人，你呢？', pinyin: 'wǒ shì yuè nán rén ， nǐ ne ？', vi: 'Tôi là người Việt Nam, còn bạn thì sao?' }
    ]
  },
  {
    id: 'dict_223',
    hanzi: '吧',
    pinyin: 'ba',
    hanviet: 'BA',
    meaning: 'Đi, nhé, thôi (ngữ khí đề nghị)',
    pos: 'Trợ từ',
    level: 'HSK1',
    examples: [
      { zh: '我们一起走吧！', pinyin: 'wǒ men yì qǐ zǒu ba ！', vi: 'Chúng mình cùng đi nhé!' }
    ]
  },
  {
    id: 'dict_224',
    hanzi: '喂',
    pinyin: 'wèi',
    hanviet: 'UY',
    meaning: 'A lô (khi nghe máy)',
    pos: 'Thán từ',
    level: 'HSK1',
    examples: [
      { zh: '喂，请问您找谁？', pinyin: 'wèi ， qǐng wèn nín zhǎo shuí ？', vi: 'A lô, xin hỏi bác cần tìm ai?' }
    ]
  }
];
