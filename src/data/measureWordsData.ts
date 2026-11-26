export interface MeasureWordNounExample {
  hanzi: string;
  pinyin: string;
  meaning: string;
  phrase: string;
  phrasePinyin: string;
  phraseMeaning: string;
}

export interface MeasureWordItem {
  id: string;
  hanzi: string;
  pinyin: string;
  hanviet: string;
  usage: string;
  level: 'HSK 1' | 'HSK 2';
  formula: string;
  tip: string;
  examples: MeasureWordNounExample[];
}

export const MEASURE_WORDS: MeasureWordItem[] = [
  {
    id: 'ge',
    hanzi: '个',
    pinyin: 'gè',
    hanviet: 'CÁ / CÁI',
    usage: 'Lượng từ vạn năng thông dụng nhất; dùng cho người, quả, cái, thời gian và các sự vật chung.',
    level: 'HSK 1',
    formula: 'Số từ + 个 + Danh từ',
    tip: 'Thường đọc khinh thanh (ge). Khi chưa chắc chắn lượng từ riêng của một đồ vật, người học có thể tạm dùng 个 trong khẩu ngữ giao tiếp.',
    examples: [
      { hanzi: '人', pinyin: 'rén', meaning: 'Người', phrase: '一个人', phrasePinyin: 'yí gè rén', phraseMeaning: 'Một người' },
      { hanzi: '苹果', pinyin: 'píngguǒ', meaning: 'Quả táo', phrase: '一个苹果', phrasePinyin: 'yí gè píngguǒ', phraseMeaning: 'Một quả táo' },
      { hanzi: '星期', pinyin: 'xīngqī', meaning: 'Tuần lễ', phrase: '一个星期', phrasePinyin: 'yí gè xīngqī', phraseMeaning: 'Một tuần lễ' },
      { hanzi: '学生', pinyin: 'xuésheng', meaning: 'Học sinh', phrase: '三个学生', phrasePinyin: 'sān gè xuésheng', phraseMeaning: 'Ba bạn học sinh' },
    ],
  },
  {
    id: 'ben',
    hanzi: '本',
    pinyin: 'běn',
    hanviet: 'BẢN / QUYỂN',
    usage: 'Dùng cho sách vở, từ điển, tạp chí, ấn phẩm đóng thành tập cuốn.',
    level: 'HSK 1',
    formula: 'Số từ + 本 + Sách / Vở / Từ điển',
    tip: 'Chữ 本 có gốc Mộc (木) và nét gạch ở rễ, tượng trưng cho giấy sách làm từ bột gỗ.',
    examples: [
      { hanzi: '书', pinyin: 'shū', meaning: 'Sách', phrase: '一本书', phrasePinyin: 'yì běn shū', phraseMeaning: 'Một quyển sách' },
      { hanzi: '词典', pinyin: 'cídiǎn', meaning: 'Từ điển', phrase: '一本词典', phrasePinyin: 'yì běn cídiǎn', phraseMeaning: 'Một cuốn từ điển' },
      { hanzi: '本子', pinyin: 'běnzi', meaning: 'Vở ghi', phrase: '两本本子', phrasePinyin: 'liǎng běn běnzi', phraseMeaning: 'Hai cuốn vở' },
    ],
  },
  {
    id: 'zhang',
    hanzi: '张',
    pinyin: 'zhāng',
    hanviet: 'TRƯƠNG / TỜ, TẤM, CÁI',
    usage: 'Dùng cho các vật có bề mặt phẳng, mỏng rộng (giấy, bàn, giường, vé, ảnh, thẻ ngân hàng).',
    level: 'HSK 1',
    formula: 'Số từ + 张 + Vật có bề mặt phẳng',
    tip: 'Có bộ Cung (弓) và chữ Trường (长), hình tượng kéo căng mặt phẳng như giương cung.',
    examples: [
      { hanzi: '纸', pinyin: 'zhǐ', meaning: 'Tờ giấy', phrase: '一张纸', phrasePinyin: 'yì zhāng zhǐ', phraseMeaning: 'Một tờ giấy' },
      { hanzi: '桌子', pinyin: 'zhuōzi', meaning: 'Cái bàn', phrase: '一张桌子', phrasePinyin: 'yì zhāng zhuōzi', phraseMeaning: 'Một cái bàn' },
      { hanzi: '床', pinyin: 'chuáng', meaning: 'Chiếc giường', phrase: '一张床', phrasePinyin: 'yì zhāng chuáng', phraseMeaning: 'Một chiếc giường' },
      { hanzi: '照片', pinyin: 'zhàopiàn', meaning: 'Bức ảnh', phrase: '一张照片', phrasePinyin: 'yì zhāng zhàopiàn', phraseMeaning: 'Một tấm ảnh' },
      { hanzi: '票', pinyin: 'piào', meaning: 'Tấm vé', phrase: '两张票', phrasePinyin: 'liǎng zhāng piào', phraseMeaning: 'Hai tấm vé' },
    ],
  },
  {
    id: 'zhi',
    hanzi: '只',
    pinyin: 'zhī',
    hanviet: 'CHÍCH / CON, CHIẾC',
    usage: 'Dùng cho động vật nhỏ, chim muông hoặc một chiếc đơn lẻ trong đồ vật có đôi (mắt, tay, tai).',
    level: 'HSK 1',
    formula: 'Số từ + 只 + Con vật / Chiếc lẻ',
    tip: 'Phân biệt 只 (zhī - lượng từ con vật) và 只 (zhǐ - phó từ "chỉ/duy nhất").',
    examples: [
      { hanzi: '猫', pinyin: 'māo', meaning: 'Con mèo', phrase: '一只猫', phrasePinyin: 'yì zhī māo', phraseMeaning: 'Một con mèo' },
      { hanzi: '狗', pinyin: 'gǒu', meaning: 'Con chó', phrase: '一只狗', phrasePinyin: 'yì zhī gǒu', phraseMeaning: 'Một con chó' },
      { hanzi: '鸟', pinyin: 'niǎo', meaning: 'Con chim', phrase: '三只鸟', phrasePinyin: 'sān zhī niǎo', phraseMeaning: 'Ba con chim' },
      { hanzi: '手', pinyin: 'shǒu', meaning: 'Bàn tay', phrase: '一只手', phrasePinyin: 'yì zhī shǒu', phraseMeaning: 'Một bàn tay lẻ' },
    ],
  },
  {
    id: 'tiao',
    hanzi: '条',
    pinyin: 'tiáo',
    hanviet: 'ĐIỀU / CON, SỢI, CHIẾC',
    usage: 'Dùng cho vật thon dài, uốn lượn mềm mại (cá, con đường, dòng sông, quần, khăn).',
    level: 'HSK 1',
    formula: 'Số từ + 条 + Vật thon dài mềm',
    tip: 'Cá (鱼) bơi uốn lượn và quần (裤子) ống dài đều bắt buộc dùng lượng từ 条.',
    examples: [
      { hanzi: '鱼', pinyin: 'yú', meaning: 'Con cá', phrase: '一条鱼', phrasePinyin: 'yì tiáo yú', phraseMeaning: 'Một con cá' },
      { hanzi: '路', pinyin: 'lù', meaning: 'Con đường', phrase: '一条路', phrasePinyin: 'yì tiáo lù', phraseMeaning: 'Một con đường' },
      { hanzi: '裤子', pinyin: 'kùzi', meaning: 'Chiếc quần', phrase: '一条裤子', phrasePinyin: 'yì tiáo kùzi', phraseMeaning: 'Một chiếc quần' },
      { hanzi: '河', pinyin: 'hé', meaning: 'Dòng sông', phrase: '一条河', phrasePinyin: 'yì tiáo hé', phraseMeaning: 'Một dòng sông' },
    ],
  },
  {
    id: 'jian',
    hanzi: '件',
    pinyin: 'jiàn',
    hanviet: 'KIỆN / CHIẾC, BỘ, VỤ',
    usage: 'Dùng cho quần áo (đặc biệt áo thân trên, áo khoác), sự việc, hành lý, quà tặng.',
    level: 'HSK 1',
    formula: 'Số từ + 件 + Áo / Sự việc',
    tip: 'Ghi nhớ cặp đối lập: Quần dùng 条, áo dùng 件.',
    examples: [
      { hanzi: '衣服', pinyin: 'yīfu', meaning: 'Quần áo', phrase: '一件衣服', phrasePinyin: 'yí jiàn yīfu', phraseMeaning: 'Một bộ quần áo' },
      { hanzi: '事', pinyin: 'shì', meaning: 'Sự việc', phrase: '一件事', phrasePinyin: 'yí jiàn shì', phraseMeaning: 'Một sự việc' },
      { hanzi: '礼物', pinyin: 'lǐwù', meaning: 'Món quà', phrase: '一件礼物', phrasePinyin: 'yí jiàn lǐwù', phraseMeaning: 'Một món quà' },
    ],
  },
  {
    id: 'bei',
    hanzi: '杯',
    pinyin: 'bēi',
    hanviet: 'BÔI / CỐC, LY',
    usage: 'Lượng từ chỉ vật chứa; dùng cho đồ uống đựng trong ly, tách, cốc (nước, trà, cà phê).',
    level: 'HSK 1',
    formula: 'Số từ + 杯 + Đồ uống đựng trong cốc',
    tip: 'Bản thân chữ 杯 (cốc) cũng là danh từ 杯子.',
    examples: [
      { hanzi: '水', pinyin: 'shuǐ', meaning: 'Nước lọc', phrase: '一杯水', phrasePinyin: 'yì bēi shuǐ', phraseMeaning: 'Một cốc nước' },
      { hanzi: '茶', pinyin: 'chá', meaning: 'Trà nóng', phrase: '一杯茶', phrasePinyin: 'yì bēi chá', phraseMeaning: 'Một tách trà' },
      { hanzi: '咖啡', pinyin: 'kāfēi', meaning: 'Cà phê', phrase: '两杯咖啡', phrasePinyin: 'liǎng bēi kāfēi', phraseMeaning: 'Hai ly cà phê' },
    ],
  },
  {
    id: 'ping',
    hanzi: '瓶',
    pinyin: 'píng',
    hanviet: 'BÌNH / CHAI, LỌ',
    usage: 'Dùng cho chất lỏng, đồ uống đóng trong chai, lọ cổ hẹp.',
    level: 'HSK 1',
    formula: 'Số từ + 瓶 + Đồ uống trong chai',
    tip: 'Phân biệt 杯 (ly/cốc miệng rộng uống tại chỗ) và 瓶 (chai đóng kín có nắp).',
    examples: [
      { hanzi: '水', pinyin: 'shuǐ', meaning: 'Nước suối', phrase: '一瓶水', phrasePinyin: 'yì píng shuǐ', phraseMeaning: 'Một chai nước' },
      { hanzi: '可乐', pinyin: 'kělè', meaning: 'Nước ngọt cola', phrase: '一瓶可乐', phrasePinyin: 'yì píng kělè', phraseMeaning: 'Một chai cola' },
      { hanzi: '酒', pinyin: 'jiǔ', meaning: 'Rượu', phrase: '一瓶酒', phrasePinyin: 'yì píng jiǔ', phraseMeaning: 'Một chai rượu' },
    ],
  },
  {
    id: 'kuai',
    hanzi: '块',
    pinyin: 'kuài',
    hanviet: 'KHỐI / MIẾNG, CỤC, ĐỒNG',
    usage: 'Dùng cho vật cắt khúc, cắt lát (bánh, dưa hấu, thịt) và đơn vị tiền tệ khẩu ngữ (đồng tệ).',
    level: 'HSK 1',
    formula: 'Số từ + 块 + Tiền tệ / Miếng cắt',
    tip: 'Trong giao tiếp hàng ngày, 块 luôn được dùng thay cho 元 (yuán).',
    examples: [
      { hanzi: '钱', pinyin: 'qián', meaning: 'Tiền tệ', phrase: '五块钱', phrasePinyin: 'wǔ kuài qián', phraseMeaning: 'Năm tệ (năm đồng)' },
      { hanzi: '蛋糕', pinyin: 'dàngāo', meaning: 'Bánh kem', phrase: '一块蛋糕', phrasePinyin: 'yí kuài dàngāo', phraseMeaning: 'Một miếng bánh ngọt' },
      { hanzi: '西瓜', pinyin: 'xīguā', meaning: 'Dưa hấu', phrase: '一块西瓜', phrasePinyin: 'yí kuài xīguā', phraseMeaning: 'Một miếng dưa hấu' },
    ],
  },
  {
    id: 'zhi-pen',
    hanzi: '支',
    pinyin: 'zhī',
    hanviet: 'CHI / CÂY, CÁN',
    usage: 'Dùng cho vật thon dài, cứng cáp hình que cán (bút viết, bút chì).',
    level: 'HSK 1',
    formula: 'Số từ + 支 + Cây bút',
    tip: 'Chữ 支 có hình bàn tay đang cầm một nhánh tre cứng.',
    examples: [
      { hanzi: '笔', pinyin: 'bǐ', meaning: 'Cây bút', phrase: '一支笔', phrasePinyin: 'yì zhī bǐ', phraseMeaning: 'Một cây bút' },
      { hanzi: '铅笔', pinyin: 'qiānbǐ', meaning: 'Bút chì', phrase: '两支铅笔', phrasePinyin: 'liǎng zhī qiānbǐ', phraseMeaning: 'Hai chiếc bút chì' },
    ],
  },
  {
    id: 'shuang',
    hanzi: '双',
    pinyin: 'shuāng',
    hanviet: 'SONG / ĐÔI',
    usage: 'Dùng cho đồ vật luôn đi thành đôi, thành cặp đối xứng (đũa, giày, tất, mắt, tay).',
    level: 'HSK 2',
    formula: 'Số từ + 双 + Đồ vật có đôi',
    tip: 'Chữ 双 gồm 2 chữ Hựu (又) đặt cạnh nhau, biểu trưng cho 2 bàn tay có đôi có cặp.',
    examples: [
      { hanzi: '筷子', pinyin: 'kuàizi', meaning: 'Đôi đũa', phrase: '一双筷子', phrasePinyin: 'yì shuāng kuàizi', phraseMeaning: 'Một đôi đũa' },
      { hanzi: '鞋', pinyin: 'xié', meaning: 'Đôi giày', phrase: '一双鞋', phrasePinyin: 'yì shuāng xié', phraseMeaning: 'Một đôi giày' },
      { hanzi: '眼睛', pinyin: 'yǎnjing', meaning: 'Đôi mắt', phrase: '一双眼睛', phrasePinyin: 'yì shuāng yǎnjing', phraseMeaning: 'Một đôi mắt' },
    ],
  },
  {
    id: 'jia',
    hanzi: '家',
    pinyin: 'jiā',
    hanviet: 'GIA / CĂN, NHÀ, CƠ SỞ',
    usage: 'Dùng cho cơ sở kinh doanh, địa điểm dịch vụ hoặc tổ chức (công ty, nhà hàng, bệnh viện, khách sạn, cửa tiệm).',
    level: 'HSK 2',
    formula: 'Số từ + 家 + Cơ sở kinh doanh',
    tip: 'Coi mỗi địa điểm kinh doanh như một mái nhà tổ chức độc lập.',
    examples: [
      { hanzi: '饭馆', pinyin: 'fànguǎn', meaning: 'Nhà hàng, quán ăn', phrase: '一家饭馆', phrasePinyin: 'yì jiā fànguǎn', phraseMeaning: 'Một quán ăn' },
      { hanzi: '医院', pinyin: 'yīyuàn', meaning: 'Bệnh viện', phrase: '一家医院', phrasePinyin: 'yì jiā yīyuàn', phraseMeaning: 'Một bệnh viện' },
      { hanzi: '公司', pinyin: 'gōngsī', meaning: 'Công ty', phrase: '一家公司', phrasePinyin: 'yì jiā gōngsī', phraseMeaning: 'Một công ty' },
      { hanzi: '商店', pinyin: 'shāngdiàn', meaning: 'Cửa hàng', phrase: '两家商店', phrasePinyin: 'liǎng jiā shāngdiàn', phraseMeaning: 'Hai cửa hàng' },
    ],
  },
  {
    id: 'wei',
    hanzi: '位',
    pinyin: 'wèi',
    hanviet: 'VỊ / VỊ, NGƯỜI',
    usage: 'Lượng từ trang trọng, tôn kính dùng cho người (thầy cô giáo, bác sĩ, khách quý, chuyên gia).',
    level: 'HSK 2',
    formula: 'Số từ + 位 + Người được tôn kính',
    tip: 'Dùng 位 thay cho 个 để thể hiện sự lễ phép và văn minh trong giao tiếp.',
    examples: [
      { hanzi: '老师', pinyin: 'lǎoshī', meaning: 'Giáo viên', phrase: '一位老师', phrasePinyin: 'yí wèi lǎoshī', phraseMeaning: 'Một vị giáo viên' },
      { hanzi: '客人', pinyin: 'kèrén', meaning: 'Khách quý', phrase: '两位客人', phrasePinyin: 'liǎng wèi kèrén', phraseMeaning: 'Hai vị khách' },
      { hanzi: '医生', pinyin: 'yīshēng', meaning: 'Bác sĩ', phrase: '一位医生', phrasePinyin: 'yí wèi yīshēng', phraseMeaning: 'Một vị bác sĩ' },
    ],
  },
  {
    id: 'liang',
    hanzi: '辆',
    pinyin: 'liàng',
    hanviet: 'LƯỢNG / CHIẾC XE',
    usage: 'Dùng cho phương tiện giao thông trên cạn có bánh lốp (ô tô, xe đạp, xe buýt).',
    level: 'HSK 2',
    formula: 'Số từ + 辆 + Phương tiện có bánh xe',
    tip: 'Có bộ Xa (车) đứng trước biểu trưng cho bánh xe lăn.',
    examples: [
      { hanzi: '汽车', pinyin: 'qìchē', meaning: 'Xe ô tô', phrase: '一辆汽车', phrasePinyin: 'yí liàng qìchē', phraseMeaning: 'Một chiếc ô tô' },
      { hanzi: '自行车', pinyin: 'zìxíngchē', meaning: 'Xe đạp', phrase: '一辆自行车', phrasePinyin: 'yí liàng zìxíngchē', phraseMeaning: 'Một chiếc xe đạp' },
      { hanzi: '出租车', pinyin: 'chūzūchē', meaning: 'Xe taxi', phrase: '一辆出租车', phrasePinyin: 'yí liàng chūzūchē', phraseMeaning: 'Một chiếc taxi' },
    ],
  },
  {
    id: 'tai',
    hanzi: '台',
    pinyin: 'tái',
    hanviet: 'ĐÀI / CHIẾC MÁY',
    usage: 'Dùng cho thiết bị điện tử, máy móc cơ khí (máy tính, tivi, máy giặt).',
    level: 'HSK 2',
    formula: 'Số từ + 台 + Thiết bị máy móc',
    tip: 'Chữ 台 có bộ Khẩu trên giá đỡ, hình tượng máy móc đặt trên bệ.',
    examples: [
      { hanzi: '电脑', pinyin: 'diànnǎo', meaning: 'Máy vi tính', phrase: '一台电脑', phrasePinyin: 'yì tái diànnǎo', phraseMeaning: 'Một chiếc máy tính' },
      { hanzi: '电视', pinyin: 'diànshì', meaning: 'Ti vi', phrase: '一台电视', phrasePinyin: 'yì tái diànshì', phraseMeaning: 'Một chiếc ti vi' },
    ],
  },
  {
    id: 'xie',
    hanzi: '些',
    pinyin: 'xiē',
    hanviet: 'THOA / MỘT VÀI, MỘT SỐ',
    usage: 'Lượng từ chỉ số lượng không xác định (một vài, một số, ít nhiều).',
    level: 'HSK 1',
    formula: '一 / 这 / 那 + 些 + Danh từ số nhiều',
    tip: 'Chỉ kết hợp với 一 (一些 - một vài), 这 (这些 - những cái này), 那 (那些 - những cái kia). Không kết hợp với số đếm 2, 3, 4.',
    examples: [
      { hanzi: '苹果', pinyin: 'píngguǒ', meaning: 'Táo', phrase: '一些苹果', phrasePinyin: 'yì xiē píngguǒ', phraseMeaning: 'Một vài quả táo' },
      { hanzi: '书', pinyin: 'shū', meaning: 'Sách', phrase: '这些书', phrasePinyin: 'zhè xiē shū', phraseMeaning: 'Những cuốn sách này' },
      { hanzi: '人', pinyin: 'rén', meaning: 'Người', phrase: '那些人', phrasePinyin: 'nà xiē rén', phraseMeaning: 'Những người kia' },
    ],
  },
];
