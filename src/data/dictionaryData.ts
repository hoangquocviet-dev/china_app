import type { ChineseWord } from '../types';

export const DICTIONARY_WORDS: ChineseWord[] = [
  // --- CHÀO HỎI & GIAO TIẾP CƠ BẢN ---
  {
    id: 'dict_001',
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    hanviet: 'NHĨ HẢO',
    meaning: 'Xin chào',
    pos: 'Thán từ',
    level: 'HSK1',
    examples: [
      { zh: '你好！很高兴认识你。', pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshí nǐ.', vi: 'Xin chào! Rất vui được quen biết bạn.' }
    ]
  },
  {
    id: 'dict_002',
    hanzi: '谢谢',
    pinyin: 'xiè xie',
    hanviet: 'TẠ TẠ',
    meaning: 'Cảm ơn',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '谢谢你的帮助。', pinyin: 'Xièxie nǐ de bāngzhù.', vi: 'Cảm ơn sự giúp đỡ của bạn.' }
    ]
  },
  {
    id: 'dict_003',
    hanzi: '再见',
    pinyin: 'zài jiàn',
    hanviet: 'TÁI KIẾN',
    meaning: 'Tạm biệt, hẹn gặp lại',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '明天见，再见！', pinyin: 'Míngtiān jiàn, zàijiàn!', vi: 'Ngày mai gặp lại, tạm biệt!' }
    ]
  },
  {
    id: 'dict_004',
    hanzi: '对不起',
    pinyin: 'duì bu qǐ',
    hanviet: 'ĐỐI BẤT KHỞI',
    meaning: 'Xin lỗi',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '对不起，我迟到了。', pinyin: 'Duìbuqǐ, wǒ chídào le.', vi: 'Xin lỗi, tôi đến muộn.' }
    ]
  },
  {
    id: 'dict_005',
    hanzi: '没关系',
    pinyin: 'méi guān xi',
    hanviet: 'MỘI QUAN HỆ',
    meaning: 'Không có gì, không sao đâu',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '没关系，别客气。', pinyin: 'Méi guānxi, bié kèqi.', vi: 'Không sao đâu, đừng khách sáo.' }
    ]
  },
  {
    id: 'dict_006',
    hanzi: '不客气',
    pinyin: 'bú kè qi',
    hanviet: 'BẤT KHÁCH KHÍ',
    meaning: 'Đừng khách sáo, không có chi',
    pos: 'Thán từ',
    level: 'HSK1',
    examples: [
      { zh: 'A: 谢谢你！ B: 不客气。', pinyin: 'Xièxie nǐ! Bú kèqi.', vi: 'A: Cảm ơn bạn! B: Không có chi.' }
    ]
  },
  {
    id: 'dict_007',
    hanzi: '请问',
    pinyin: 'qǐng wèn',
    hanviet: 'THỈNH VẤN',
    meaning: 'Xin hỏi, làm ơn cho hỏi',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '请问，图书馆在哪里？', pinyin: 'Qǐngwèn, túshūguǎn zài nǎlǐ?', vi: 'Xin hỏi, thư viện ở đâu ạ?' }
    ]
  },

  // --- GIA ĐÌNH & CON NGƯỜI ---
  {
    id: 'dict_008',
    hanzi: '爸爸',
    pinyin: 'bà ba',
    hanviet: 'BÁ BÁ',
    meaning: 'Bố, cha',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '我爸爸是一名医生。', pinyin: 'Wǒ bàba shì yī míng yīshēng.', vi: 'Bố tôi là một bác sĩ.' }
    ]
  },
  {
    id: 'dict_009',
    hanzi: '妈妈',
    pinyin: 'mā ma',
    hanviet: 'MA MA',
    meaning: 'Mẹ, má',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '妈妈做的中国菜很好吃。', pinyin: 'Māma zuò de zhōngguócài hěn hǎochī.', vi: 'Món Trung Quốc mẹ nấu rất ngon.' }
    ]
  },
  {
    id: 'dict_010',
    hanzi: '朋友',
    pinyin: 'péng you',
    hanviet: 'BẰNG HỮU',
    meaning: 'Bạn bè',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '他是我的好朋友。', pinyin: 'Tā shì wǒ de hǎo péngyou.', vi: 'Anh ấy là người bạn tốt của tôi.' }
    ]
  },
  {
    id: 'dict_011',
    hanzi: '老师',
    pinyin: 'lǎo shī',
    hanviet: 'LÃO SƯ',
    meaning: 'Thầy giáo, cô giáo',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '王老师教我们汉语。', pinyin: 'Wáng lǎoshī jiāo wǒmen hànyǔ.', vi: 'Thầy Vương dạy chúng tôi tiếng Trung.' }
    ]
  },
  {
    id: 'dict_012',
    hanzi: '学生',
    pinyin: 'xué sheng',
    hanviet: 'HỌC SINH',
    meaning: 'Học sinh, sinh viên',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '这里的学生都很努力。', pinyin: 'Zhèlǐ de xuésheng dōu hěn nǔlì.', vi: 'Học sinh ở đây đều rất chăm chỉ.' }
    ]
  },
  {
    id: 'dict_013',
    hanzi: '同学',
    pinyin: 'tóng xué',
    hanviet: 'ĐỒNG HỌC',
    meaning: 'Bạn học, bạn cùng lớp',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '我们是大学同学。', pinyin: 'Wǒmen shì dàxué tóngxué.', vi: 'Chúng tôi là bạn cùng học đại học.' }
    ]
  },
  {
    id: 'dict_014',
    hanzi: '医生',
    pinyin: 'yī shēng',
    hanviet: 'Y SINH',
    meaning: 'Bác sĩ',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '他在大医院当医生。', pinyin: 'Tā zài dà yīyuàn dāng yīshēng.', vi: 'Anh ấy làm bác sĩ ở một bệnh viện lớn.' }
    ]
  },
  {
    id: 'dict_015',
    hanzi: '儿子',
    pinyin: 'ér zi',
    hanviet: 'NHI TỬ',
    meaning: 'Con trai',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '他的儿子今年五岁。', pinyin: 'Tā de érzi jīnnián wǔ suì.', vi: 'Con trai anh ấy năm nay 5 tuổi.' }
    ]
  },
  {
    id: 'dict_016',
    hanzi: '女儿',
    pinyin: 'nǚ ér',
    hanviet: 'NỮ NHI',
    meaning: 'Con gái',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '她有一个漂亮的女儿。', pinyin: 'Tā yǒu yī gè piàoliang de nǚ\'ér.', vi: 'Cô ấy có một người con gái xinh đẹp.' }
    ]
  },

  // --- ẨM THỰC, ĂN UỐNG & ĐỜI SỐNG ---
  {
    id: 'dict_017',
    hanzi: '吃',
    pinyin: 'chī',
    hanviet: 'CẬT',
    meaning: 'Ăn',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '你想吃什么？', pinyin: 'Nǐ xiǎng chī shénme?', vi: 'Bạn muốn ăn gì?' }
    ]
  },
  {
    id: 'dict_018',
    hanzi: '喝',
    pinyin: 'hē',
    hanviet: 'HÁT',
    meaning: 'Uống',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '我想喝一杯水。', pinyin: 'Wǒ xiǎng hē yī bēi shuǐ.', vi: 'Tôi muốn uống một cốc nước.' }
    ]
  },
  {
    id: 'dict_019',
    hanzi: '茶',
    pinyin: 'chá',
    hanviet: 'TRÀ',
    meaning: 'Trà, chè',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '中国人很喜欢喝绿茶。', pinyin: 'Zhōngguórén hěn xǐhuan hē lǜchá.', vi: 'Người Trung Quốc rất thích uống trà xanh.' }
    ]
  },
  {
    id: 'dict_020',
    hanzi: '水',
    pinyin: 'shuǐ',
    hanviet: 'THỦY',
    meaning: 'Nước',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '多喝水对身体好。', pinyin: 'Duō hē shuǐ duì shēntǐ hǎo.', vi: 'Uống nhiều nước rất tốt cho cơ thể.' }
    ]
  },
  {
    id: 'dict_021',
    hanzi: '米饭',
    pinyin: 'mǐ fàn',
    hanviet: 'MỄ PHẠN',
    meaning: 'Cơm trắng',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '请给我一碗米饭。', pinyin: 'Qǐng gěi wǒ yī wǎn mǐfàn.', vi: 'Làm ơn cho tôi một bát cơm trắng.' }
    ]
  },
  {
    id: 'dict_022',
    hanzi: '菜',
    pinyin: 'cài',
    hanviet: 'THÁI',
    meaning: 'Món ăn, rau cỏ',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '今天的菜非常丰盛。', pinyin: 'Jīntiān de cài fēicháng fēngshèng.', vi: 'Món ăn hôm nay vô cùng phong phú.' }
    ]
  },
  {
    id: 'dict_023',
    hanzi: '苹果',
    pinyin: 'píng guǒ',
    hanviet: 'BÌNH QUẢ',
    meaning: 'Quả táo',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '这个苹果又大又甜。', pinyin: 'Zhège píngguǒ yòu dà yòu tián.', vi: 'Quả táo này vừa to vừa ngọt.' }
    ]
  },
  {
    id: 'dict_024',
    hanzi: '水果',
    pinyin: 'shuǐ guǒ',
    hanviet: 'THỦY QUẢ',
    meaning: 'Hoa quả, trái cây',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '每天吃水果很有营养。', pinyin: 'Měitiān chī shuǐguǒ hěn yǒu yíngyǎng.', vi: 'Mỗi ngày ăn hoa quả rất giàu dinh dưỡng.' }
    ]
  },
  {
    id: 'dict_025',
    hanzi: '面条',
    pinyin: 'miàn tiáo',
    hanviet: 'MIẾN ĐIỀU',
    meaning: 'Mì sợi',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '中午我们去吃牛肉面条吧。', pinyin: 'Zhōngwǔ wǒmen qù chī niúròu miàntiáo ba.', vi: 'Trưa nay chúng mình đi ăn mì bò nhé.' }
    ]
  },
  {
    id: 'dict_026',
    hanzi: '咖啡',
    pinyin: 'kā fēi',
    hanviet: 'CA PHÊ',
    meaning: 'Cà phê',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '你喜欢喝黑咖啡吗？', pinyin: 'Nǐ xǐhuan hē hēi kāfēi ma?', vi: 'Bạn có thích uống cà phê đen không?' }
    ]
  },

  // --- HÀNH ĐỘNG & HOẠT ĐỘNG THƯỜNG NGÀY ---
  {
    id: 'dict_027',
    hanzi: '学习',
    pinyin: 'xué xí',
    hanviet: 'HỌC TẬP',
    meaning: 'Học tập, nghiên cứu',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '学习汉语很有趣。', pinyin: 'Xuéxí hànyǔ hěn yǒuqù.', vi: 'Học tiếng Trung rất thú vị.' }
    ]
  },
  {
    id: 'dict_028',
    hanzi: '工作',
    pinyin: 'gōng zuò',
    hanviet: 'CÔNG TÁC',
    meaning: 'Làm việc, công việc',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '你在哪里工作？', pinyin: 'Nǐ zài nǎlǐ gōngzuò?', vi: 'Bạn làm việc ở đâu?' }
    ]
  },
  {
    id: 'dict_029',
    hanzi: '看',
    pinyin: 'kàn',
    hanviet: 'KHÁN',
    meaning: 'Xem, nhìn, đọc (sách)',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '他在看一本中文书。', pinyin: 'Tā zài kàn yī běn zhōngwén shū.', vi: 'Anh ấy đang đọc một cuốn sách tiếng Trung.' }
    ]
  },
  {
    id: 'dict_030',
    hanzi: '听',
    pinyin: 'tīng',
    hanviet: 'THÍNH',
    meaning: 'Nghe',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '请仔细听老师说。', pinyin: 'Qǐng zǐxì tīng lǎoshī shuō.', vi: 'Làm ơn hãy lắng nghe kỹ cô giáo nói.' }
    ]
  },
  {
    id: 'dict_031',
    hanzi: '说',
    pinyin: 'shuō',
    hanviet: 'THUYẾT',
    meaning: 'Nói',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '你的汉语说得很好。', pinyin: 'Nǐ de hànyǔ shuō de hěn hǎo.', vi: 'Tiếng Trung của bạn nói rất hay.' }
    ]
  },
  {
    id: 'dict_032',
    hanzi: '写',
    pinyin: 'xiě',
    hanviet: 'TẢ',
    meaning: 'Viết',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '你会写这个汉字吗？', pinyin: 'Nǐ huì xiě zhège hànzì ma?', vi: 'Bạn có biết viết chữ Hán này không?' }
    ]
  },
  {
    id: 'dict_033',
    hanzi: '买',
    pinyin: 'mǎi',
    hanviet: 'MÃI',
    meaning: 'Mua',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '我想去超市买点东西。', pinyin: 'Wǒ xiǎng qù chāoshì mǎi diǎn dōngxi.', vi: 'Tôi muốn đi siêu thị mua một ít đồ.' }
    ]
  },
  {
    id: 'dict_034',
    hanzi: '卖',
    pinyin: 'mài',
    hanviet: 'MẠI',
    meaning: 'Bán',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '这个商店卖很多水果。', pinyin: 'Zhège shāngdiàn mài hěn duō shuǐguǒ.', vi: 'Cửa hàng này bán rất nhiều hoa quả.' }
    ]
  },
  {
    id: 'dict_035',
    hanzi: '去',
    pinyin: 'qù',
    hanviet: 'KHỨ',
    meaning: 'Đi',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '明天你想去哪里？', pinyin: 'Míngtiān nǐ xiǎng qù nǎlǐ?', vi: 'Ngày mai bạn muốn đi đâu?' }
    ]
  },
  {
    id: 'dict_036',
    hanzi: '来',
    pinyin: 'lái',
    hanviet: 'LAI',
    meaning: 'Đến, tới',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '欢迎你来我家玩。', pinyin: 'Huānyíng nǐ lái wǒ jiā wán.', vi: 'Hoan nghênh bạn đến nhà tôi chơi.' }
    ]
  },
  {
    id: 'dict_037',
    hanzi: '睡觉',
    pinyin: 'shuì jiào',
    hanviet: 'THỤY GIÁC',
    meaning: 'Đi ngủ',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '太晚了，快去睡觉吧。', pinyin: 'Tài wǎn le, kuài qù shuìjiào ba.', vi: 'Muộn quá rồi, mau đi ngủ đi thôi.' }
    ]
  },
  {
    id: 'dict_038',
    hanzi: '起床',
    pinyin: 'qǐ chuáng',
    hanviet: 'KHỞI SÀNG',
    meaning: 'Thức dậy',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '我每天早上六点起床。', pinyin: 'Wǒ měitiān zǎoshang liù diǎn qǐchuáng.', vi: 'Tôi thức dậy lúc sáu giờ mỗi sáng.' }
    ]
  },
  {
    id: 'dict_039',
    hanzi: '打电话',
    pinyin: 'dǎ diàn huà',
    hanviet: 'ĐẢ ĐIỆN THOẠI',
    meaning: 'Gọi điện thoại',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '请给我打电话。', pinyin: 'Qǐng gěi wǒ dǎ diànhuà.', vi: 'Xin hãy gọi điện thoại cho tôi.' }
    ]
  },
  {
    id: 'dict_040',
    hanzi: '跑步',
    pinyin: 'pǎo bù',
    hanviet: 'BÀO BỘ',
    meaning: 'Chạy bộ',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '他在公园里跑步。', pinyin: 'Tā zài gōngyuán lǐ pǎobù.', vi: 'Anh ấy chạy bộ trong công viên.' }
    ]
  },

  // --- THỜI GIAN & CON SỐ ---
  {
    id: 'dict_041',
    hanzi: '今天',
    pinyin: 'jīn tiān',
    hanviet: 'KIM THIÊN',
    meaning: 'Hôm nay',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '今天天气非常晴朗。', pinyin: 'Jīntiān tiānqì fēicháng qínglǎng.', vi: 'Hôm nay thời tiết rất trong lành nắng đẹp.' }
    ]
  },
  {
    id: 'dict_042',
    hanzi: '明天',
    pinyin: 'míng tiān',
    hanviet: 'MINH THIÊN',
    meaning: 'Ngày mai',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '明天是星期六。', pinyin: 'Míngtiān shì xīngqīliù.', vi: 'Ngày mai là thứ Bảy.' }
    ]
  },
  {
    id: 'dict_043',
    hanzi: '昨天',
    pinyin: 'zuó tiān',
    hanviet: 'TÁC THIÊN',
    meaning: 'Hôm qua',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '昨天下了大雨。', pinyin: 'Zuótiān xià le dàyǔ.', vi: 'Hôm qua trời đã mưa to.' }
    ]
  },
  {
    id: 'dict_044',
    hanzi: '现在',
    pinyin: 'xiàn zài',
    hanviet: 'HIỆN TẠI',
    meaning: 'Bây giờ, hiện tại',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '现在几点了？', pinyin: 'Xiànzài jǐ diǎn le?', vi: 'Bây giờ là mấy giờ rồi?' }
    ]
  },
  {
    id: 'dict_045',
    hanzi: '早上',
    pinyin: 'zǎo shang',
    hanviet: 'TẢO THƯỢNG',
    meaning: 'Buổi sáng sớm',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '早上好，吃早餐了吗？', pinyin: 'Zǎoshang hǎo, chī zǎocān le ma?', vi: 'Chào buổi sáng, bạn ăn sáng chưa?' }
    ]
  },
  {
    id: 'dict_046',
    hanzi: '晚上',
    pinyin: 'wǎn shang',
    hanviet: 'VÃN THƯỢNG',
    meaning: 'Buổi tối',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '晚上我们一起看电影吧。', pinyin: 'Wǎnshang wǒmen yīqǐ kàn diànyǐng ba.', vi: 'Buổi tối chúng mình cùng xem phim nhé.' }
    ]
  },
  {
    id: 'dict_047',
    hanzi: '星期',
    pinyin: 'xīng qī',
    hanviet: 'TINH KỲ',
    meaning: 'Tuần, thứ',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '一个星期有七天。', pinyin: 'Yī gè xīngqī yǒu qī tiān.', vi: 'Một tuần có bảy ngày.' }
    ]
  },

  // --- NƠI CHỐN & ĐỒ VẬT ---
  {
    id: 'dict_048',
    hanzi: '家',
    pinyin: 'jiā',
    hanviet: 'GIA',
    meaning: 'Nhà, gia đình',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '我家在北京。', pinyin: 'Wǒ jiā zài běijīng.', vi: 'Nhà tôi ở Bắc Kinh.' }
    ]
  },
  {
    id: 'dict_049',
    hanzi: '学校',
    pinyin: 'xué xiào',
    hanviet: 'HỌC HIỆU',
    meaning: 'Trường học',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '学校离这里不远。', pinyin: 'Xuéxiào lí zhèlǐ bù yuǎn.', vi: 'Trường học cách đây không xa.' }
    ]
  },
  {
    id: 'dict_050',
    hanzi: '商店',
    pinyin: 'shāng diàn',
    hanviet: 'THƯƠNG ĐIẾM',
    meaning: 'Cửa hàng, tiệm',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '他在商店买了一件衣服。', pinyin: 'Tā zài shāngdiàn mǎi le yī jiàn yīfu.', vi: 'Anh ấy mua một chiếc áo ở cửa hàng.' }
    ]
  },
  {
    id: 'dict_051',
    hanzi: '医院',
    pinyin: 'yī yuàn',
    hanviet: 'Y VIỆN',
    meaning: 'Bệnh viện',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '生病了要去看医生，去医院。', pinyin: 'Shēngbìng le yào qù kàn yīshēng, qù yīyuàn.', vi: 'Bị ốm thì phải đi khám bác sĩ, đi bệnh viện.' }
    ]
  },
  {
    id: 'dict_052',
    hanzi: '中国',
    pinyin: 'zhōng guó',
    hanviet: 'TRUNG QUỐC',
    meaning: 'Trung Quốc',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '我想去中国旅游。', pinyin: 'Wǒ xiǎng qù zhōngguó lǚyóu.', vi: 'Tôi muốn đi du lịch Trung Quốc.' }
    ]
  },
  {
    id: 'dict_053',
    hanzi: '北京',
    pinyin: 'běi jīng',
    hanviet: 'BẮC KINH',
    meaning: 'Bắc Kinh',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '北京是中国的首都。', pinyin: 'Běijīng shì zhōngguó de shǒudū.', vi: 'Bắc Kinh là thủ đô của Trung Quốc.' }
    ]
  },
  {
    id: 'dict_054',
    hanzi: '书',
    pinyin: 'shū',
    hanviet: 'THƯ',
    meaning: 'Sách, cuốn sách',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '桌子上有一本书。', pinyin: 'Zhuōzi shang yǒu yī běn shū.', vi: 'Trên bàn có một cuốn sách.' }
    ]
  },
  {
    id: 'dict_055',
    hanzi: '飞机',
    pinyin: 'fēi jī',
    hanviet: 'PHI CƠ',
    meaning: 'Máy bay',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '我们坐飞机去旅行。', pinyin: 'Wǒmen zuò fēijī qù lǚxíng.', vi: 'Chúng tôi đi máy bay đi du lịch.' }
    ]
  },
  {
    id: 'dict_056',
    hanzi: '出租车',
    pinyin: 'chū zū chē',
    hanviet: 'XUẤT TÔ XA',
    meaning: 'Xe taxi',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '出门可以打出租车。', pinyin: 'Chūmén kěyǐ dǎ chūzūchē.', vi: 'Ra ngoài có thể bắt xe taxi.' }
    ]
  },

  // --- CẢM XÚC, TÍNH CHẤT & MIÊU TẢ ---
  {
    id: 'dict_057',
    hanzi: '好',
    pinyin: 'hǎo',
    hanviet: 'HẢO',
    meaning: 'Tốt, đẹp, khỏe',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '他的身体很好。', pinyin: 'Tā de shēntǐ hěn hǎo.', vi: 'Sức khỏe của anh ấy rất tốt.' }
    ]
  },
  {
    id: 'dict_058',
    hanzi: '大',
    pinyin: 'dà',
    hanviet: 'ĐẠI',
    meaning: 'To, lớn',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '这个西瓜真大！', pinyin: 'Zhège xīguā zhēn dà!', vi: 'Quả dưa hấu này to thật!' }
    ]
  },
  {
    id: 'dict_059',
    hanzi: '小',
    pinyin: 'xiǎo',
    hanviet: 'TIỂU',
    meaning: 'Nhỏ, bé',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '那只小猫很可爱。', pinyin: 'Nà zhī xiǎomāo hěn kě\'ài.', vi: 'Chú mèo con kia rất đáng yêu.' }
    ]
  },
  {
    id: 'dict_060',
    hanzi: '多',
    pinyin: 'duō',
    hanviet: 'ĐA',
    meaning: 'Nhiều',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '这里的人很多。', pinyin: 'Zhèlǐ de rén hěn duō.', vi: 'Người ở đây rất đông.' }
    ]
  },
  {
    id: 'dict_061',
    hanzi: '少',
    pinyin: 'shǎo',
    hanviet: 'THIỂU',
    meaning: 'Ít',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '今天作业比较少。', pinyin: 'Jīntiān zuòyè bǐjiào shǎo.', vi: 'Hôm nay bài tập về nhà tương đối ít.' }
    ]
  },
  {
    id: 'dict_062',
    hanzi: '冷',
    pinyin: 'lěng',
    hanviet: 'LÃNH',
    meaning: 'Lạnh, rét',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '冬天天气很冷。', pinyin: 'Dōngtiān tiānqì hěn lěng.', vi: 'Mùa đông thời tiết rất lạnh.' }
    ]
  },
  {
    id: 'dict_063',
    hanzi: '热',
    pinyin: 'rè',
    hanviet: 'NHIỆT',
    meaning: 'Nóng',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '夏天这里非常热。', pinyin: 'Xiàtiān zhèlǐ fēicháng rè.', vi: 'Mùa hè ở đây cực kỳ nóng.' }
    ]
  },
  {
    id: 'dict_064',
    hanzi: '高兴',
    pinyin: 'gāo xìng',
    hanviet: 'CAO HƯNG',
    meaning: 'Vui vẻ, phấn khởi',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '今天大家都特别高兴。', pinyin: 'Jīntiān dàjiā dōu tèbié gāoxìng.', vi: 'Hôm nay mọi người đều đặc biệt vui mừng.' }
    ]
  },
  {
    id: 'dict_065',
    hanzi: '漂亮',
    pinyin: 'piào liang',
    hanviet: 'PHIÊU LƯỢNG',
    meaning: 'Xinh đẹp, đẹp đẽ',
    pos: 'Tính từ',
    level: 'HSK1',
    examples: [
      { zh: '她穿这件衣服真漂亮。', pinyin: 'Tā chuān zhè jiàn yīfu zhēn piàoliang.', vi: 'Cô ấy mặc chiếc áo này đẹp thật.' }
    ]
  },
  {
    id: 'dict_066',
    hanzi: '累',
    pinyin: 'lèi',
    hanviet: 'LŨY',
    meaning: 'Mệt mỏi, mệt',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '工作了一天，我很累。', pinyin: 'Gōngzuò le yī tiān, wǒ hěn lèi.', vi: 'Làm việc cả ngày rồi, tôi rất mệt.' }
    ]
  },
  {
    id: 'dict_067',
    hanzi: '忙',
    pinyin: 'máng',
    hanviet: 'MANG',
    meaning: 'Bận, bận rộn',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '你最近工作忙不忙？', pinyin: 'Nǐ zuìjìn gōngzuò máng bù máng?', vi: 'Dạo này công việc bạn có bận không?' }
    ]
  },
  {
    id: 'dict_068',
    hanzi: '贵',
    pinyin: 'guì',
    hanviet: 'QUÝ',
    meaning: 'Đắt tiền, quý báu',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '太贵了，可以便宜一点吗？', pinyin: 'Tài guì le, kěyǐ piányi yīdiǎn ma?', vi: 'Đắt quá rồi, có thể giảm giá rẻ hơn chút không?' }
    ]
  },
  {
    id: 'dict_069',
    hanzi: '便宜',
    pinyin: 'pián yi',
    hanviet: 'TIỆN NGHI',
    meaning: 'Rẻ, giá rẻ',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '这件衣服质量好又便宜。', pinyin: 'Zhè jiàn yīfu zhìliàng hǎo yòu piányi.', vi: 'Chiếc áo này chất lượng tốt mà lại rẻ.' }
    ]
  },
  {
    id: 'dict_070',
    hanzi: '快',
    pinyin: 'kuài',
    hanviet: 'KHOÁI',
    meaning: 'Nhanh',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '高铁跑得真快。', pinyin: 'Gāotiě pǎo de zhēn kuài.', vi: 'Tàu cao tốc chạy thật là nhanh.' }
    ]
  },
  {
    id: 'dict_071',
    hanzi: '慢',
    pinyin: 'màn',
    hanviet: 'MẠN',
    meaning: 'Chậm, thong thả',
    pos: 'Tính từ',
    level: 'HSK2',
    examples: [
      { zh: '请说慢一点，我听不太懂。', pinyin: 'Qǐng shuō màn yīdiǎn, wǒ tīng bù tài dǒng.', vi: 'Làm ơn nói chậm một chút, tôi nghe chưa hiểu lắm.' }
    ]
  },

  // --- TỪ VỰNG HSK 2 & HSK 3 THÔNG DỤNG MỞ RỘNG ---
  {
    id: 'dict_072',
    hanzi: '喜欢',
    pinyin: 'xǐ huan',
    hanviet: 'HỈ HOAN',
    meaning: 'Thích, yêu thích',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '我非常喜欢学中文。', pinyin: 'Wǒ fēicháng xǐhuan xué zhōngwén.', vi: 'Tôi vô cùng thích học tiếng Trung.' }
    ]
  },
  {
    id: 'dict_073',
    hanzi: '认识',
    pinyin: 'rèn shi',
    hanviet: 'NHẬN THỨC',
    meaning: 'Quen biết, nhận biết',
    pos: 'Động từ',
    level: 'HSK1',
    examples: [
      { zh: '认识你很高兴！', pinyin: 'Rènshi nǐ hěn gāoxìng!', vi: 'Rất vui được làm quen với bạn!' }
    ]
  },
  {
    id: 'dict_074',
    hanzi: '帮助',
    pinyin: 'bāng zhù',
    hanviet: 'BANG TRỢ',
    meaning: 'Giúp đỡ, sự giúp đỡ',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '谢谢你一直以来的帮助。', pinyin: 'Xièxie nǐ yīzhí yǐlái de bāngzhù.', vi: 'Cảm ơn sự giúp đỡ bấy lâu nay của bạn.' }
    ]
  },
  {
    id: 'dict_075',
    hanzi: '准备',
    pinyin: 'zhǔn bèi',
    hanviet: 'CHUẨN BỊ',
    meaning: 'Chuẩn bị',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '你准备好了吗？', pinyin: 'Nǐ zhǔnbèi hǎo le ma?', vi: 'Bạn đã chuẩn bị xong chưa?' }
    ]
  },
  {
    id: 'dict_076',
    hanzi: '运动',
    pinyin: 'yùn dòng',
    hanviet: 'VẬN ĐỘNG',
    meaning: 'Thể thao, vận động',
    pos: 'Danh từ',
    level: 'HSK2',
    examples: [
      { zh: '多做运动有益健康。', pinyin: 'Duō zuò yùndòng yǒuyì jiànkāng.', vi: 'Vận động nhiều có ích cho sức khỏe.' }
    ]
  },
  {
    id: 'dict_077',
    hanzi: '旅游',
    pinyin: 'lǚ yóu',
    hanviet: 'LỮ DU',
    meaning: 'Du lịch',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '暑假我们去海边旅游。', pinyin: 'Shǔjià wǒmen qù hǎibiān lǚyóu.', vi: 'Nghỉ hè chúng mình đi du lịch biển.' }
    ]
  },
  {
    id: 'dict_078',
    hanzi: '天气',
    pinyin: 'tiān qì',
    hanviet: 'THIÊN KHÍ',
    meaning: 'Thời tiết',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '明天的天气怎么样？', pinyin: 'Míngtiān de tiānqì zěnmeyàng?', vi: 'Thời tiết ngày mai như thế nào?' }
    ]
  },
  {
    id: 'dict_079',
    hanzi: '钱',
    pinyin: 'qián',
    hanviet: 'TIỀN',
    meaning: 'Tiền, tiền bạc',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '这个苹果多少钱一斤？', pinyin: 'Zhège píngguǒ duōshao qián yī jīn?', vi: 'Táo này bao nhiêu tiền một cân?' }
    ]
  },
  {
    id: 'dict_080',
    hanzi: '猫',
    pinyin: 'māo',
    hanviet: 'MIÊU',
    meaning: 'Con mèo',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '那只小猫在椅子下睡觉。', pinyin: 'Nà zhī xiǎomāo zài yǐzi xià shuìjiào.', vi: 'Chú mèo con kia đang ngủ dưới ghế.' }
    ]
  },
  {
    id: 'dict_081',
    hanzi: '狗',
    pinyin: 'gǒu',
    hanviet: 'CẨU',
    meaning: 'Con chó',
    pos: 'Danh từ',
    level: 'HSK1',
    examples: [
      { zh: '小狗很忠诚。', pinyin: 'Xiǎogǒu hěn zhōngchéng.', vi: 'Chó con rất trung thành.' }
    ]
  },
  {
    id: 'dict_082',
    hanzi: '希望',
    pinyin: 'xī wàng',
    hanviet: 'HY VỌNG',
    meaning: 'Hy vọng, mong muốn',
    pos: 'Động từ',
    level: 'HSK2',
    examples: [
      { zh: '我希望大家都健康。', pinyin: 'Wǒ xīwàng dàjiā dōu jiànkāng.', vi: 'Tôi hy vọng mọi người đều khỏe mạnh.' }
    ]
  },
  {
    id: 'dict_083',
    hanzi: '清楚',
    pinyin: 'qīng chu',
    hanviet: 'THANH SỞ',
    meaning: 'Rõ ràng, hiểu rõ',
    pos: 'Tính từ',
    level: 'HSK3',
    examples: [
      { zh: '你说得非常清楚。', pinyin: 'Nǐ shuō de fēicháng qīngchu.', vi: 'Bạn nói rất rõ ràng.' }
    ]
  },
  {
    id: 'dict_084',
    hanzi: '认真',
    pinyin: 'rèn zhēn',
    hanviet: 'NHẬN CHÂN',
    meaning: 'Nghiêm túc, chăm chỉ',
    pos: 'Tính từ',
    level: 'HSK3',
    examples: [
      { zh: '他学习一直很认真。', pinyin: 'Tā xuéxí yīzhí hěn rènzhēn.', vi: 'Anh ấy học hành luôn luôn rất nghiêm túc.' }
    ]
  },
  {
    id: 'dict_085',
    hanzi: '努力',
    pinyin: 'nǔ lì',
    hanviet: 'NỖ LỰC',
    meaning: 'Nỗ lực, cố gắng',
    pos: 'Tính từ',
    level: 'HSK3',
    examples: [
      { zh: '只要努力，就能成功。', pinyin: 'Zhǐyào nǔlì, jiù néng chénggōng.', vi: 'Chỉ cần nỗ lực thì sẽ có thể thành công.' }
    ]
  },
  {
    id: 'dict_086',
    hanzi: '成功',
    pinyin: 'chéng gōng',
    hanviet: 'THÀNH CÔNG',
    meaning: 'Thành công',
    pos: 'Động từ',
    level: 'HSK3',
    examples: [
      { zh: '祝你考试成功！', pinyin: 'Zhù nǐ kǎoshì chénggōng!', vi: 'Chúc bạn thi cử thành công!' }
    ]
  },
  {
    id: 'dict_087',
    hanzi: '简单',
    pinyin: 'jiǎn dān',
    hanviet: 'GIẢN ĐƠN',
    meaning: 'Đơn giản',
    pos: 'Tính từ',
    level: 'HSK3',
    examples: [
      { zh: '这个问题其实很简单。', pinyin: 'Zhège wèntí qíshí hěn jiǎndān.', vi: 'Vấn đề này thực ra rất đơn giản.' }
    ]
  },
  {
    id: 'dict_088',
    hanzi: '容易',
    pinyin: 'róng yì',
    hanviet: 'DUNG DỊ',
    meaning: 'Dễ dàng',
    pos: 'Tính từ',
    level: 'HSK3',
    examples: [
      { zh: '学中文不容易，但很有趣。', pinyin: 'Xué zhōngwén bù róngyì, dàn hěn yǒuqù.', vi: 'Học tiếng Trung không dễ nhưng rất thú vị.' }
    ]
  },
  {
    id: 'dict_089',
    hanzi: '历史',
    pinyin: 'lì shǐ',
    hanviet: 'LỊCH SỬ',
    meaning: 'Lịch sử',
    pos: 'Danh từ',
    level: 'HSK3',
    examples: [
      { zh: '中国有很长的历史。', pinyin: 'Zhōngguó yǒu hěn cháng de lìshǐ.', vi: 'Trung Quốc có lịch sử rất lâu đời.' }
    ]
  },
  {
    id: 'dict_090',
    hanzi: '文化',
    pinyin: 'wén huà',
    hanviet: 'VĂN HÓA',
    meaning: 'Văn hóa',
    pos: 'Danh từ',
    level: 'HSK3',
    examples: [
      { zh: '我想了解东方文化。', pinyin: 'Wǒ xiǎng liǎojiě dōngfāng wénhuà.', vi: 'Tôi muốn tìm hiểu văn hóa phương Đông.' }
    ]
  }
];
