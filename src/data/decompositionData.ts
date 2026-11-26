export interface ComponentItem {
  component: string;
  pinyin: string;
  name: string;
  meaning: string;
}

export interface HanziDecompositionItem {
  id: string;
  hanzi: string;
  pinyin: string;
  hanviet: string;
  meaning: string;
  category: 'compound_classic' | 'mind_emotion' | 'human_life' | 'nature_elements';
  categoryLabel: string;
  formula: string; // e.g. "亻 (Người) + 木 (Cây)"
  components: ComponentItem[];
  mnemonicStory: string; // Câu chuyện chiết tự dễ nhớ
  culturalNote?: string; // Ghi chú văn hóa / nguồn gốc chữ
  hskLevel: 'HSK 1' | 'HSK 2' | 'HSK 3+';
  exampleWord?: {
    word: string;
    pinyin: string;
    meaning: string;
  };
}

export const HANZI_DECOMPOSITION_LIST: HanziDecompositionItem[] = [
  {
    id: 'xiu',
    hanzi: '休',
    pinyin: 'xiū',
    hanviet: 'HƯU',
    meaning: 'Nghỉ ngơi, ngừng',
    category: 'human_life',
    categoryLabel: 'Con người & Đời sống',
    formula: '亻 (Nhân đứng - Người) + 木 (Mộc - Cây)',
    components: [
      { component: '亻', pinyin: 'rén', name: 'Bộ Nhân đứng', meaning: 'Người' },
      { component: '木', pinyin: 'mù', name: 'Bộ Mộc', meaning: 'Cây gỗ, thân cây' }
    ],
    mnemonicStory: 'Con người sau những giờ lao động vất vả tựa lưng vào gốc cây mát rượi để nghỉ ngơi.',
    culturalNote: 'Chữ tượng ý kinh điển trong lục thư chữ Hán, thể hiện sự hòa hợp giữa con người và thiên nhiên.',
    hskLevel: 'HSK 1',
    exampleWord: { word: '休息', pinyin: 'xiūxi', meaning: 'Nghỉ ngơi' }
  },
  {
    id: 'ming',
    hanzi: '明',
    pinyin: 'míng',
    hanviet: 'MINH',
    meaning: 'Sáng sủa, ngày mai, rõ ràng',
    category: 'nature_elements',
    categoryLabel: 'Thiên nhiên & Vũ trụ',
    formula: '日 (Nhật - Mặt trời) + 月 (Nguyệt - Mặt trăng)',
    components: [
      { component: '日', pinyin: 'rì', name: 'Bộ Nhật', meaning: 'Mặt trời, ban ngày' },
      { component: '月', pinyin: 'yuè', name: 'Bộ Nguyệt', meaning: 'Mặt trăng, ánh trăng' }
    ],
    mnemonicStory: 'Mặt trời ban ngày kết hợp cùng mặt trăng ban đêm, hai nguồn sáng lớn nhất của vũ trụ hội tụ tạo nên ánh sáng rực rỡ.',
    culturalNote: 'Chữ Nhật và chữ Nguyệt ghép lại thành chữ Minh - sáng tỏ, minh bạch.',
    hskLevel: 'HSK 1',
    exampleWord: { word: '明天', pinyin: 'míngtiān', meaning: 'Ngày mai' }
  },
  {
    id: 'an',
    hanzi: '安',
    pinyin: 'ān',
    hanviet: 'AN',
    meaning: 'Bình an, yên ổn, an toàn',
    category: 'human_life',
    categoryLabel: 'Con người & Đời sống',
    formula: '宀 (Miên - Mái nhà) + 女 (Nữ - Phụ nữ)',
    components: [
      { component: '宀', pinyin: 'mián', name: 'Bộ Miên', meaning: 'Mái nhà, tổ ấm' },
      { component: '女', pinyin: 'nǚ', name: 'Bộ Nữ', meaning: 'Người phụ nữ, người mẹ' }
    ],
    mnemonicStory: 'Dưới mái nhà có bóng dáng người phụ nữ chu toàn chăm sóc thì cả gia đình ấm êm, yên bình.',
    culturalNote: 'Quan niệm phương Đông xưa xem sự hiện diện của người phụ nữ trong nhà là biểu tượng của sự ổn định, an cư lạc nghiệp.',
    hskLevel: 'HSK 1',
    exampleWord: { word: '早安', pinyin: 'zǎo\'ān', meaning: 'Chào buổi sáng (Bình an buổi sáng)' }
  },
  {
    id: 'hao',
    hanzi: '好',
    pinyin: 'hǎo',
    hanviet: 'HẢO',
    meaning: 'Tốt, đẹp, khỏe mạnh, thích',
    category: 'human_life',
    categoryLabel: 'Con người & Đời sống',
    formula: '女 (Nữ - Con gái) + 子 (Tử - Con trai)',
    components: [
      { component: '女', pinyin: 'nǚ', name: 'Bộ Nữ', meaning: 'Người mẹ, con gái' },
      { component: '子', pinyin: 'zǐ', name: 'Bộ Tử', meaning: 'Đứa con, con trai' }
    ],
    mnemonicStory: 'Gia đình có đủ cả con gái (女) lẫn con trai (子), trọn vẹn nếp lẫn tẻ, chính là điều tuyệt vời, tốt đẹp nhất.',
    culturalNote: 'Cũng có lý giải khác: người mẹ (女) ôm bồng con nhỏ (子) là hình ảnh chan chứa tình yêu thương và tốt đẹp.',
    hskLevel: 'HSK 1',
    exampleWord: { word: '你好', pinyin: 'nǐ hǎo', meaning: 'Xin chào' }
  },
  {
    id: 'kan',
    hanzi: '看',
    pinyin: 'kàn',
    hanviet: 'KHÁN',
    meaning: 'Nhìn, xem, đọc',
    category: 'compound_classic',
    categoryLabel: 'Hội ý kinh điển',
    formula: '手/⺿ (Thủ - Bàn tay) + 目 (Mục - Mắt)',
    components: [
      { component: '手', pinyin: 'shǒu', name: 'Bộ Thủ', meaning: 'Bàn tay' },
      { component: '目', pinyin: 'mù', name: 'Bộ Mục', meaning: 'Đôi mắt' }
    ],
    mnemonicStory: 'Đưa bàn tay lên trán che nắng trên đôi mắt để hướng tầm nhìn trông ngóng ra phía xa.',
    culturalNote: 'Nửa trên là chữ Thủ (tay) viết vát nét, nửa dưới là chữ Mục (mắt) thẳng đứng.',
    hskLevel: 'HSK 1',
    exampleWord: { word: '看书', pinyin: 'kàn shū', meaning: 'Đọc sách' }
  },
  {
    id: 'nan',
    hanzi: '男',
    pinyin: 'nán',
    hanviet: 'NAM',
    meaning: 'Đàn ông, nam giới, con trai',
    category: 'human_life',
    categoryLabel: 'Con người & Đời sống',
    formula: '田 (Điền - Ruộng đồng) + 力 (Lực - Sức lực)',
    components: [
      { component: '田', pinyin: 'tián', name: 'Bộ Điền', meaning: 'Ruộng đồng đất đai' },
      { component: '力', pinyin: 'lì', name: 'Bộ Lực', meaning: 'Sức mạnh, sức lực' }
    ],
    mnemonicStory: 'Người dùng sức lực (力) cày cuốc, gánh vác việc nặng nhọc trên đồng ruộng (田) chính là người đàn ông.',
    culturalNote: 'Phản ánh nền văn minh nông nghiệp lúa nước, nơi sức lao động đồng áng của phái nam là trụ cột.',
    hskLevel: 'HSK 1',
    exampleWord: { word: '男人', pinyin: 'nánrén', meaning: 'Người đàn ông' }
  },
  {
    id: 'lei',
    hanzi: '泪',
    pinyin: 'lèi',
    hanviet: 'LỆ',
    meaning: 'Nước mắt, giọt lệ',
    category: 'mind_emotion',
    categoryLabel: 'Tâm trí & Cảm xúc',
    formula: '氵(Chấm Thủy - Nước) + 目 (Mục - Mắt)',
    components: [
      { component: '氵', pinyin: 'shuǐ', name: 'Bộ Ba chấm thủy', meaning: 'Nước, chất lỏng' },
      { component: '目', pinyin: 'mù', name: 'Bộ Mục', meaning: 'Đôi mắt' }
    ],
    mnemonicStory: 'Dòng nước (氵) tuôn chảy ra từ khóe mắt (目) khi xúc động hay đau buồn chính là giọt nước mắt (泪).',
    culturalNote: 'Chữ hội ý vô cùng trực quan và giàu chất thơ trong văn học chữ Hán.',
    hskLevel: 'HSK 2',
    exampleWord: { word: '流泪', pinyin: 'liú lèi', meaning: 'Rơi lệ, chảy nước mắt' }
  },
  {
    id: 'zuo',
    hanzi: '坐',
    pinyin: 'zuò',
    hanviet: 'TỌA',
    meaning: 'Ngồi, đi (tàu, xe)',
    category: 'compound_classic',
    categoryLabel: 'Hội ý kinh điển',
    formula: '人 (Người) + 人 (Người) + 土 (Thổ - Mặt đất)',
    components: [
      { component: '人', pinyin: 'rén', name: 'Bộ Nhân', meaning: 'Người (2 người đối diện)' },
      { component: '土', pinyin: 'tǔ', name: 'Bộ Thổ', meaning: 'Mặt đất, nền đất' }
    ],
    mnemonicStory: 'Hai người (人人) cùng ngồi bệt xuống mặt đất (土) mặt đối mặt tâm sự trò chuyện.',
    culturalNote: 'Thời cổ đại chưa có ghế cao, người xưa ngồi chiếu hoặc bồ đoàn sát mặt đất.',
    hskLevel: 'HSK 1',
    exampleWord: { word: '请坐', pinyin: 'qǐng zuò', meaning: 'Mời ngồi' }
  },
  {
    id: 'xin',
    hanzi: '信',
    pinyin: 'xìn',
    hanviet: 'TÍN',
    meaning: 'Tin tưởng, uy tín, bức thư',
    category: 'mind_emotion',
    categoryLabel: 'Tâm trí & Cảm xúc',
    formula: '亻 (Nhân đứng - Con người) + 言 (Ngôn - Lời nói)',
    components: [
      { component: '亻', pinyin: 'rén', name: 'Bộ Nhân đứng', meaning: 'Con người' },
      { component: '言', pinyin: 'yán', name: 'Bộ Ngôn', meaning: 'Lời nói, ngôn ngữ' }
    ],
    mnemonicStory: 'Lời nói (言) của con người (亻) thốt ra phải nhất quán, đáng tin cậy thì mới tạo dựng được chữ tín.',
    culturalNote: 'Trong Ngũ thường của Nho giáo: Nhân, Lễ, Nghĩa, Trí, Tín - Tín là nền tảng để giao hảo.',
    hskLevel: 'HSK 2',
    exampleWord: { word: '相信', pinyin: 'xiāngxìn', meaning: 'Tin tưởng' }
  },
  {
    id: 'jian',
    hanzi: '尖',
    pinyin: 'jiān',
    hanviet: 'TIÊM',
    meaning: 'Đầu nhọn, mũi nhọn, sắc bén',
    category: 'nature_elements',
    categoryLabel: 'Thiên nhiên & Vũ trụ',
    formula: '小 (Tiểu - Nhỏ) + 大 (Đại - To lớn)',
    components: [
      { component: '小', pinyin: 'xiǎo', name: 'Bộ Tiểu', meaning: 'Nhỏ, bé' },
      { component: '大', pinyin: 'dà', name: 'Bộ Đại', meaning: 'To, lớn' }
    ],
    mnemonicStory: 'Vật thể có đáy ở dưới thì to (大), càng vuốt lên trên thì càng nhỏ lại (小), tạo thành một mũi nhọn.',
    culturalNote: 'Cấu tạo chữ đơn giản nhưng cực kỳ hình tượng, dễ nhớ ngay từ lần đầu nhìn thấy.',
    hskLevel: 'HSK 2',
    exampleWord: { word: '笔尖', pinyin: 'bǐjiān', meaning: 'Ngòi bút' }
  },
  {
    id: 'chen',
    hanzi: '尘',
    pinyin: 'chén',
    hanviet: 'TRẦN',
    meaning: 'Bụi bặm, trần thế',
    category: 'nature_elements',
    categoryLabel: 'Thiên nhiên & Vũ trụ',
    formula: '小 (Tiểu - Nhỏ) + 土 (Thổ - Đất cát)',
    components: [
      { component: '小', pinyin: 'xiǎo', name: 'Bộ Tiểu', meaning: 'Nhỏ tí xíu' },
      { component: '土', pinyin: 'tǔ', name: 'Bộ Thổ', meaning: 'Đất cát' }
    ],
    mnemonicStory: 'Những hạt đất cát (土) có kích thước li ti siêu nhỏ (小) bay lơ lửng trong không gian chính là hạt bụi.',
    culturalNote: 'Chữ phồn thể là 塵 (hươu chạy tung bụi đất), chữ giản thể đã tinh giản thành 小 + 土 vô cùng thông minh.',
    hskLevel: 'HSK 2',
    exampleWord: { word: '灰尘', pinyin: 'huīchén', meaning: 'Bụi bẩn' }
  },
  {
    id: 'mie',
    hanzi: '灭',
    pinyin: 'miè',
    hanviet: 'DIỆT',
    meaning: 'Dập tắt, tiêu diệt, tàn lụi',
    category: 'compound_classic',
    categoryLabel: 'Hội ý kinh điển',
    formula: '一 (Nhất - Thanh chắn đè) + 火 (Hỏa - Ngọn lửa)',
    components: [
      { component: '一', pinyin: 'yī', name: 'Nét ngang', meaning: 'Thanh chắn, vật đậy lên' },
      { component: '火', pinyin: 'huǒ', name: 'Bộ Hỏa', meaning: 'Ngọn lửa, đám cháy' }
    ],
    mnemonicStory: 'Lấy nắp đậy hoặc thanh chắn (一) đè úp lên trên ngọn lửa (火) để cắt nguồn oxy, dập tắt ngọn lửa.',
    culturalNote: 'Chữ hội ý thể hiện nguyên lý dập lửa cơ bản của nhân loại.',
    hskLevel: 'HSK 2',
    exampleWord: { word: '消灭', pinyin: 'xiāomiè', meaning: 'Tiêu diệt' }
  },
  {
    id: 'wai',
    hanzi: '歪',
    pinyin: 'wāi',
    hanviet: 'OAI',
    meaning: 'Xiêu vẹo, lệch lạc, nghiêng ngả',
    category: 'compound_classic',
    categoryLabel: 'Hội ý kinh điển',
    formula: '不 (Bất - Không) + 正 (Chính - Ngay thẳng)',
    components: [
      { component: '不', pinyin: 'bù', name: 'Chữ Bất', meaning: 'Không, phủ định' },
      { component: '正', pinyin: 'zhèng', name: 'Chữ Chính', meaning: 'Ngay ngắn, chuẩn mực' }
    ],
    mnemonicStory: 'Cái gì không (不) chịu đứng ngay ngắn, chính trực (正) thì ắt hẳn là xiêu vẹo, nghiêng ngả (歪).',
    culturalNote: 'Chữ Hán ghép trực tiếp hai từ phản nghĩa "Bất" + "Chính" để tạo nên từ chỉ tính chất vẹo lệch.',
    hskLevel: 'HSK 2',
    exampleWord: { word: '歪斜', pinyin: 'wāixié', meaning: 'Xiêu vẹo' }
  },
  {
    id: 'jia',
    hanzi: '家',
    pinyin: 'jiā',
    hanviet: 'GIA',
    meaning: 'Nhà, gia đình',
    category: 'human_life',
    categoryLabel: 'Con người & Đời sống',
    formula: '宀 (Miên - Mái nhà) + 豕 (Thỉ - Con heo/lợn)',
    components: [
      { component: '宀', pinyin: 'mián', name: 'Bộ Miên', meaning: 'Mái nhà' },
      { component: '豕', pinyin: 'shǐ', name: 'Bộ Thỉ', meaning: 'Con heo, gia súc' }
    ],
    mnemonicStory: 'Thời cổ đại, dưới mái nhà (宀) có chăn nuôi heo (豕) là minh chứng cho một mái ấm sung túc, no đủ.',
    culturalNote: 'Heo là gia súc định canh định cư quan trọng nhất trong xã hội nông nghiệp cổ đại Trung Hoa.',
    hskLevel: 'HSK 1',
    exampleWord: { word: '大家', pinyin: 'dàjiā', meaning: 'Mọi người (Gia đình lớn)' }
  },
  {
    id: 'sen',
    hanzi: '森',
    pinyin: 'sēn',
    hanviet: 'SÂM',
    meaning: 'Rừng rậm rạp, u ám',
    category: 'nature_elements',
    categoryLabel: 'Thiên nhiên & Vũ trụ',
    formula: '木 (Cây) + 木 (Cây) + 木 (Cây)',
    components: [
      { component: '木', pinyin: 'mù', name: 'Bộ Mộc', meaning: 'Cây cối' }
    ],
    mnemonicStory: 'Một cây là Mộc, hai cây là Rừng nhỏ (林), ba cây 木 cùng mọc ken dày tầng tầng lớp lớp tạo nên cánh rừng rậm rạp (森).',
    culturalNote: 'Hình thức cấu tạo chữ Hán điệp tam (chồng 3 chữ giống nhau) để biểu thị số lượng nhiều vô kể.',
    hskLevel: 'HSK 2',
    exampleWord: { word: '森林', pinyin: 'sēnlín', meaning: 'Rừng rậm' }
  },
  {
    id: 'zhong',
    hanzi: '众',
    pinyin: 'zhòng',
    hanviet: 'CHÚNG',
    meaning: 'Quần chúng, đám đông, nhiều người',
    category: 'human_life',
    categoryLabel: 'Con người & Đời sống',
    formula: '人 (Người) + 人 (Người) + 人 (Người)',
    components: [
      { component: '人', pinyin: 'rén', name: 'Bộ Nhân', meaning: 'Con người' }
    ],
    mnemonicStory: 'Một người đứng trên hai người ở dưới, nhiều người tụ hội lại với nhau tạo thành quần chúng đông đảo.',
    culturalNote: 'Chữ phồn thể là 衆, chữ giản thể là 众 lấy 3 chữ Nhân xếp hình tam giác cực kỳ gợi tả.',
    hskLevel: 'HSK 2',
    exampleWord: { word: '大家', pinyin: 'zhòngrén', meaning: 'Mọi người, đám đông' }
  },
  {
    id: 'dan',
    hanzi: '旦',
    pinyin: 'dàn',
    hanviet: 'ĐÁN',
    meaning: 'Buổi sớm, bình minh, ngày',
    category: 'nature_elements',
    categoryLabel: 'Thiên nhiên & Vũ trụ',
    formula: '日 (Nhật - Mặt trời) + 一 (Nhất - Đường chân trời)',
    components: [
      { component: '日', pinyin: 'rì', name: 'Bộ Nhật', meaning: 'Mặt trời' },
      { component: '一', pinyin: 'yī', name: 'Đường chân trời', meaning: 'Đường ranh giới mặt đất' }
    ],
    mnemonicStory: 'Quả cầu mặt trời (日) vừa ló rạng vượt lên khỏi đường chân trời (一), báo hiệu một ngày mới bắt đầu.',
    culturalNote: 'Xuất hiện trong từ 元旦 (Yuándàn - Tết Dương lịch / Ngày đầu năm mới).',
    hskLevel: 'HSK 2',
    exampleWord: { word: '元旦', pinyin: 'yuándàn', meaning: 'Tết Dương lịch' }
  },
  {
    id: 'wen',
    hanzi: '问',
    pinyin: 'wèn',
    hanviet: 'VẤN',
    meaning: 'Hỏi, thăm hỏi, chất vấn',
    category: 'compound_classic',
    categoryLabel: 'Hội ý kinh điển',
    formula: '门 (Môn - Cánh cửa) + 口 (Khẩu - Miệng)',
    components: [
      { component: '门', pinyin: 'mén', name: 'Bộ Môn', meaning: 'Cánh cổng, cửa nhà' },
      { component: '口', pinyin: 'kǒu', name: 'Bộ Khẩu', meaning: 'Cái miệng, lời nói' }
    ],
    mnemonicStory: 'Đến cổng nhà người ta (门), cất tiếng miệng (口) gọi hỏi thăm gia chủ: "Có ai ở nhà không?".',
    culturalNote: 'Khác với chữ 闻 (Văn - Lắng nghe, ngửi) là ở cửa ghé tai 耳 vào nghe.',
    hskLevel: 'HSK 1',
    exampleWord: { word: '请问', pinyin: 'qǐngwèn', meaning: 'Xin hỏi' }
  },
  {
    id: 'mang',
    hanzi: '忙',
    pinyin: 'máng',
    hanviet: 'MANG',
    meaning: 'Bận rộn, tất bật',
    category: 'mind_emotion',
    categoryLabel: 'Tâm trí & Cảm xúc',
    formula: '忄(Tâm đứng - Trái tim) + 亡 (Vong - Mất mát, chết)',
    components: [
      { component: '忄', pinyin: 'xīn', name: 'Bộ Tâm đứng', meaning: 'Tâm trí, lòng dạ' },
      { component: '亡', pinyin: 'wáng', name: 'Bộ Vong', meaning: 'Mất mát, tan biến' }
    ],
    mnemonicStory: 'Công việc ngập đầu khiến tâm trí và con tim (忄) như muốn tan biến (亡), không còn thời gian thở.',
    culturalNote: 'Lời nhắc nhở thâm thúy của người xưa: đừng để bận rộn làm trái tim và cảm xúc bị hao mòn.',
    hskLevel: 'HSK 1',
    exampleWord: { word: '很忙', pinyin: 'hěn máng', meaning: 'Rất bận' }
  },
  {
    id: 'wang',
    hanzi: '忘',
    pinyin: 'wàng',
    hanviet: 'VONG',
    meaning: 'Quên, quên lãng',
    category: 'mind_emotion',
    categoryLabel: 'Tâm trí & Cảm xúc',
    formula: '亡 (Vong - Mất đi) + 心 (Tâm - Trái tim)',
    components: [
      { component: '亡', pinyin: 'wáng', name: 'Bộ Vong', meaning: 'Mất mát, rơi rụng' },
      { component: '心', pinyin: 'xīn', name: 'Bộ Tâm', meaning: 'Trái tim, trí nhớ' }
    ],
    mnemonicStory: 'Ký ức hay việc gì đó rơi rụng, mất đi (亡) khỏi trái tim và tâm trí (心) nghĩa là ta đã lãng quên (忘).',
    culturalNote: 'Bộ Tâm nằm ở dưới đáy, thể hiện nơi lưu giữ tình cảm và ký ức của con người.',
    hskLevel: 'HSK 2',
    exampleWord: { word: '忘记', pinyin: 'wàngjì', meaning: 'Quên, lãng quên' }
  },
  {
    id: 'si',
    hanzi: '思',
    pinyin: 'sī',
    hanviet: 'TƯ',
    meaning: 'Suy nghĩ, tư tưởng, nhớ nhung',
    category: 'mind_emotion',
    categoryLabel: 'Tâm trí & Cảm xúc',
    formula: '田 (Điền - Não bộ/Thửa ruộng) + 心 (Tâm - Trái tim)',
    components: [
      { component: '田', pinyin: 'tián', name: 'Hình tượng não bộ', meaning: 'Đầu óc, thửa ruộng tâm trí' },
      { component: '心', pinyin: 'xīn', name: 'Bộ Tâm', meaning: 'Trái tim, cảm xúc' }
    ],
    mnemonicStory: 'Tâm trí và não bộ (田) kết nối chặt chẽ cùng con tim (心) để cày xới, suy ngẫm sâu xa một vấn đề.',
    culturalNote: 'Trong Giáp cốt văn, chữ Điền vốn là hình vẽ đỉnh đầu hoặc hộp sọ chứa não bộ của con người.',
    hskLevel: 'HSK 2',
    exampleWord: { word: '意思', pinyin: 'yìsi', meaning: 'Ý nghĩa, sở thích' }
  },
  {
    id: 'xiang',
    hanzi: '想',
    pinyin: 'xiǎng',
    hanviet: 'TƯỞNG',
    meaning: 'Nghĩ, muốn, nhớ nhung',
    category: 'mind_emotion',
    categoryLabel: 'Tâm trí & Cảm xúc',
    formula: '相 (Tương - Hình bóng đối phương) + 心 (Tâm - Trái tim)',
    components: [
      { component: '相', pinyin: 'xiāng', name: 'Chữ Tương', meaning: 'Hình ảnh, nhìn ngắm nhau' },
      { component: '心', pinyin: 'xīn', name: 'Bộ Tâm', meaning: 'Trái tim, tâm hồn' }
    ],
    mnemonicStory: 'Trong sâu thẳm trái tim (心) luôn hiện lên hình bóng (相) của người ấy, đó chính là nỗi nhớ nhung.',
    culturalNote: 'Chữ Hình thanh kiêm Hội ý kinh điển: 相 vừa là âm đọc (xiāng -> xiǎng) vừa gợi ý niệm tương tư.',
    hskLevel: 'HSK 1',
    exampleWord: { word: '想念', pinyin: 'xiǎngniàn', meaning: 'Nhớ nhung' }
  },
  {
    id: 'pa',
    hanzi: '怕',
    pinyin: 'pà',
    hanviet: 'PHẠ',
    meaning: 'Sợ hãi, lo sợ',
    category: 'mind_emotion',
    categoryLabel: 'Tâm trí & Cảm xúc',
    formula: '忄(Tâm đứng - Trái tim) + 白 (Bạch - Trắng bệch)',
    components: [
      { component: '忄', pinyin: 'xīn', name: 'Bộ Tâm đứng', meaning: 'Trái tim, cảm xúc' },
      { component: '白', pinyin: 'bái', name: 'Bộ Bạch', meaning: 'Trắng, tái nhợt' }
    ],
    mnemonicStory: 'Khi gặp điều hãi hùng, trái tim (忄) đập loạn xạ khiến sắc mặt tái nhợt, trắng bệch (白) vì sợ hãi.',
    culturalNote: 'Chữ thể hiện phản ứng sinh học tự nhiên của cơ thể con người khi đối diện nỗi sợ hãi.',
    hskLevel: 'HSK 2',
    exampleWord: { word: '害怕', pinyin: 'hàipà', meaning: 'Sợ hãi' }
  },
  {
    id: 'cai',
    hanzi: '采',
    pinyin: 'cǎi',
    hanviet: 'THẢI',
    meaning: 'Hái, nhặt, thu thập',
    category: 'compound_classic',
    categoryLabel: 'Hội ý kinh điển',
    formula: '爫 (Trảo - Móng tay/Bàn tay) + 木 (Mộc - Cây cối)',
    components: [
      { component: '爫', pinyin: 'zhǎo', name: 'Bộ Trảo', meaning: 'Bàn tay với móng vuốt' },
      { component: '木', pinyin: 'mù', name: 'Bộ Mộc', meaning: 'Cành cây, hoa quả' }
    ],
    mnemonicStory: 'Bàn tay khéo léo (爫) vươn lên trên cành cây (木) để hái quả chín mọng và lá trà thơm.',
    culturalNote: 'Hình ảnh quen thuộc của người phụ nữ nông nghiệp thời xưa đi hái dâu nuôi tằm, hái chè.',
    hskLevel: 'HSK 2',
    exampleWord: { word: '采取', pinyin: 'cǎiqǔ', meaning: 'Áp dụng, tiếp nhận' }
  }
];
