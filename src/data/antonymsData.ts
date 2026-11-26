export interface AntonymWord {
  hanzi: string;
  pinyin: string;
  hanviet: string;
  meaning: string;
}

export interface AntonymContrastSentence {
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface AntonymPairItem {
  id: string;
  level: 'HSK 1' | 'HSK 2';
  category: 'size_amount' | 'nature_weather' | 'action_direction' | 'description';
  categoryName: string;
  wordA: AntonymWord;
  wordB: AntonymWord;
  contrastSentence: AntonymContrastSentence;
  tip: string;
}

export const ANTONYM_PAIRS: AntonymPairItem[] = [
  {
    id: 'da_xiao',
    level: 'HSK 1',
    category: 'size_amount',
    categoryName: 'Kích thước & Số lượng',
    wordA: { hanzi: '大', pinyin: 'dà', hanviet: 'ĐẠI', meaning: 'To lớn' },
    wordB: { hanzi: '小', pinyin: 'xiǎo', hanviet: 'TIỂU', meaning: 'Nhỏ bé' },
    contrastSentence: {
      hanzi: '西瓜大，苹果小。',
      pinyin: 'xī guā dà ， píng guǒ xiǎo 。',
      meaning: 'Dưa hấu to, quả táo nhỏ.',
    },
    tip: 'Chữ 大 như người dang rộng hai tay. Chữ 小 tượng trưng cho chia nhỏ ra các phần.',
  },
  {
    id: 'duo_shao',
    level: 'HSK 1',
    category: 'size_amount',
    categoryName: 'Kích thước & Số lượng',
    wordA: { hanzi: '多', pinyin: 'duō', hanviet: 'ĐA', meaning: 'Nhiều' },
    wordB: { hanzi: '少', pinyin: 'shǎo', hanviet: 'THIỂU', meaning: 'Ít' },
    contrastSentence: {
      hanzi: '这里的学生多，老师少。',
      pinyin: 'zhè lǐ de xué sheng duō ， lǎo shī shǎo 。',
      meaning: 'Học sinh ở đây nhiều, giáo viên ít.',
    },
    tip: 'Khi ghép lại 多少 (duōshao) trở thành đại từ nghi vấn: "bao nhiêu". Chữ 多 gồm hai bộ Tịch (夕) xếp chồng.',
  },
  {
    id: 'leng_re',
    level: 'HSK 1',
    category: 'nature_weather',
    categoryName: 'Tự nhiên & Thời tiết',
    wordA: { hanzi: '冷', pinyin: 'lěng', hanviet: 'LÃNH', meaning: 'Lạnh' },
    wordB: { hanzi: '热', pinyin: 'rè', hanviet: 'NHIỆT', meaning: 'Nóng' },
    contrastSentence: {
      hanzi: '冬天很冷，夏天很热。',
      pinyin: 'dōng tiān hěn lěng ， xià tiān hěn rè 。',
      meaning: 'Mùa đông rất lạnh, mùa hè rất nóng.',
    },
    tip: 'Chữ 冷 có bộ Băng (冫 - hai giọt nước đóng băng). Chữ 热 có 4 chấm hỏa (灬) ở dưới tượng trưng ngọn lửa đun nóng.',
  },
  {
    id: 'kuai_man',
    level: 'HSK 2',
    category: 'description',
    categoryName: 'Tính chất & Miêu tả',
    wordA: { hanzi: '快', pinyin: 'kuài', hanviet: 'KHOÁI', meaning: 'Nhanh' },
    wordB: { hanzi: '慢', pinyin: 'màn', hanviet: 'MẠN', meaning: 'Chậm' },
    contrastSentence: {
      hanzi: '坐高铁很快，骑自行车很慢。',
      pinyin: 'zuò gāo tiě hěn kuài ， qí zì xíng chē hěn màn 。',
      meaning: 'Đi tàu cao tốc rất nhanh, đi xe đạp rất chậm.',
    },
    tip: 'Cả hai chữ 快 và 慢 đều mang bộ Tâm đứng (忄 - liên quan cảm xúc và tốc độ xử lý tâm trạng).',
  },
  {
    id: 'gao_ai',
    level: 'HSK 1',
    category: 'size_amount',
    categoryName: 'Kích thước & Số lượng',
    wordA: { hanzi: '高', pinyin: 'gāo', hanviet: 'CAO', meaning: 'Cao' },
    wordB: { hanzi: '矮', pinyin: 'ǎi', hanviet: 'OẢI', meaning: 'Thấp / lùn' },
    contrastSentence: {
      hanzi: '哥哥比弟弟高，弟弟比哥哥矮。',
      pinyin: 'gē ge bǐ dì di gāo ， dì di bǐ gē ge ǎi 。',
      meaning: 'Anh trai cao hơn em trai, em trai thấp hơn anh trai.',
    },
    tip: 'Dùng cho chiều cao người hoặc vật thể. Chữ 矮 có bộ Thỉ (矢 - mũi tên ngắn).',
  },
  {
    id: 'hao_huai',
    level: 'HSK 1',
    category: 'description',
    categoryName: 'Tính chất & Miêu tả',
    wordA: { hanzi: '好', pinyin: 'hǎo', hanviet: 'HẢO', meaning: 'Tốt / đẹp' },
    wordB: { hanzi: '坏', pinyin: 'huài', hanviet: 'HOẠI', meaning: 'Xấu / hỏng' },
    contrastSentence: {
      hanzi: '手机坏了，电脑还是好的。',
      pinyin: 'shǒu jī huài le ， diàn nǎo hái shì hǎo de 。',
      meaning: 'Điện thoại hỏng rồi, máy tính vẫn còn tốt.',
    },
    tip: 'Chữ 好 gồm Nữ (女) và Tử (子). Chữ 坏 gồm Thổ (土) và Bất (不 - đất bị xói mòn hư hại).',
  },
  {
    id: 'xin_jiu',
    level: 'HSK 2',
    category: 'description',
    categoryName: 'Tính chất & Miêu tả',
    wordA: { hanzi: '新', pinyin: 'xīn', hanviet: 'TÂN', meaning: 'Mới' },
    wordB: { hanzi: '旧', pinyin: 'jiù', hanviet: 'CỰU', meaning: 'Cũ' },
    contrastSentence: {
      hanzi: '这是一本新书，那是一本旧杂志。',
      pinyin: 'zhè shì yì běn xīn shū ， nà shì yì běn jiù zá zhì 。',
      meaning: 'Đây là cuốn sách mới, kia là cuốn tạp chí cũ.',
    },
    tip: 'Phân biệt: 旧 chỉ dùng cho đồ vật cũ (旧书, 旧车). Đối với người già, ta dùng 老 (lǎo), không dùng 旧.',
  },
  {
    id: 'mai_mai',
    level: 'HSK 1',
    category: 'action_direction',
    categoryName: 'Hành động & Phương hướng',
    wordA: { hanzi: '买', pinyin: 'mǎi', hanviet: 'MÃI', meaning: 'Mua (Thanh 3)' },
    wordB: { hanzi: '卖', pinyin: 'mài', hanviet: 'MẠI', meaning: 'Bán (Thanh 4)' },
    contrastSentence: {
      hanzi: '商店里有人买东西，也有人卖东西。',
      pinyin: 'shāng diàn lǐ yǒu rén mǎi dōng xi ， yě yǒu rén mài dōng xi 。',
      meaning: 'Trong cửa hàng có người mua đồ, cũng có người bán đồ.',
    },
    tip: 'MẸO VÀNG PHÂN BIỆT: 买 (mǎi - thanh 3, không có dấu thập phía trên) = Mua. 卖 (mài - thanh 4, có thêm bộ Thập 十 ở đỉnh) = Bán. Ghép lại 买卖 (mǎimai) = Mua bán / Buôn bán.',
  },
  {
    id: 'kai_guan',
    level: 'HSK 1',
    category: 'action_direction',
    categoryName: 'Hành động & Phương hướng',
    wordA: { hanzi: '开', pinyin: 'kāi', hanviet: 'KHAI', meaning: 'Mở / bật' },
    wordB: { hanzi: '关', pinyin: 'guān', hanviet: 'QUAN', meaning: 'Đóng / tắt' },
    contrastSentence: {
      hanzi: '请开门，别关窗户。',
      pinyin: 'qǐng kāi mén ， bié guān chuāng hu 。',
      meaning: 'Xin hãy mở cửa, đừng đóng cửa sổ.',
    },
    tip: 'Dùng cho cả đồ vật (cửa, hộp) và thiết bị điện tử: 开灯 (bật đèn), 关手机 (tắt điện thoại).',
  },
  {
    id: 'lai_qu',
    level: 'HSK 1',
    category: 'action_direction',
    categoryName: 'Hành động & Phương hướng',
    wordA: { hanzi: '来', pinyin: 'lái', hanviet: 'LAI', meaning: 'Đến (hướng về phía người nói)' },
    wordB: { hanzi: '去', pinyin: 'qù', hanviet: 'KHỨ', meaning: 'Đi (rời xa người nói)' },
    contrastSentence: {
      hanzi: '他从北京来，明天去上海。',
      pinyin: 'tā cóng běi jīng lái ， míng tiān qù shàng hǎi 。',
      meaning: 'Anh ấy từ Bắc Kinh đến, ngày mai đi Thượng Hải.',
    },
    tip: '来 và 去 là hai động từ chỉ phương hướng cơ bản nhất trong tiếng Trung.',
  },
  {
    id: 'jin_chu',
    level: 'HSK 2',
    category: 'action_direction',
    categoryName: 'Hành động & Phương hướng',
    wordA: { hanzi: '进', pinyin: 'jìn', hanviet: 'TIẾN', meaning: 'Vào' },
    wordB: { hanzi: '出', pinyin: 'chū', hanviet: 'XUẤT', meaning: 'Ra' },
    contrastSentence: {
      hanzi: '请进，不要在外面站着；我们要出去了。',
      pinyin: 'qǐng jìn ， bú yào zài wài mian zhàn zhe ； wǒ men yào chū qù le 。',
      meaning: 'Xin mời vào, đừng đứng bên ngoài; chúng tôi sắp đi ra rồi.',
    },
    tip: 'Chữ 进 có bộ Quai xước (辶). Chữ 出 gồm hai chữ Sơn (山) xếp chồng.',
  },
  {
    id: 'shang_xia',
    level: 'HSK 1',
    category: 'action_direction',
    categoryName: 'Hành động & Phương hướng',
    wordA: { hanzi: '上', pinyin: 'shàng', hanviet: 'THƯỢNG', meaning: 'Trên / lên' },
    wordB: { hanzi: '下', pinyin: 'xià', hanviet: 'HẠ', meaning: 'Dưới / xuống' },
    contrastSentence: {
      hanzi: '桌子上是电脑，桌子下是一只猫。',
      pinyin: 'zhuō zi shang shì diàn nǎo ， zhuō zi xià shì yì zhī māo 。',
      meaning: 'Trên bàn là máy tính, dưới bàn là một chú mèo.',
    },
    tip: 'Vừa là phương vị từ (trên/dưới), vừa là động từ: 上车 (lên xe), 下车 (xuống xe), 上课 (vào học), 下课 (tan học).',
  },
  {
    id: 'qian_hou',
    level: 'HSK 1',
    category: 'action_direction',
    categoryName: 'Hành động & Phương hướng',
    wordA: { hanzi: '前', pinyin: 'qián', hanviet: 'TIỀN', meaning: 'Trước' },
    wordB: { hanzi: '后', pinyin: 'hòu', hanviet: 'HẬU', meaning: 'Sau' },
    contrastSentence: {
      hanzi: '学校前面是公园，学校后面是医院。',
      pinyin: 'xué xiào qián mian shì gōng yuán ， xué xiào hòu mian shì yī yuàn 。',
      meaning: 'Phía trước trường học là công viên, phía sau trường học là bệnh viện.',
    },
    tip: 'Dùng cho cả không gian (前面 / 后面) và thời gian (三天前 - 3 ngày trước, 以后 - sau này).',
  },
  {
    id: 'zuo_you',
    level: 'HSK 1',
    category: 'action_direction',
    categoryName: 'Hành động & Phương hướng',
    wordA: { hanzi: '左', pinyin: 'zuǒ', hanviet: 'TẢ', meaning: 'Trái' },
    wordB: { hanzi: '右', pinyin: 'yòu', hanviet: 'HỮU', meaning: 'Phải' },
    contrastSentence: {
      hanzi: '往左走是超市，往右走是书店。',
      pinyin: 'wǎng zuǒ zǒu shì chāo shì ， wǎng yòu zǒu shì shū diàn 。',
      meaning: 'Đi về bên trái là siêu thị, đi về bên phải là hiệu sách.',
    },
    tip: 'MẸO NHỚ NÉT: Chữ 左 có chữ Công (工 - thợ thủ công dùng tay trái cầm thước). Chữ 右 có chữ Khẩu (口 - miệng dùng tay phải đưa cơm).',
  },
  {
    id: 'yuan_jin',
    level: 'HSK 2',
    category: 'nature_weather',
    categoryName: 'Tự nhiên & Thời tiết',
    wordA: { hanzi: '远', pinyin: 'yuǎn', hanviet: 'VIỄN', meaning: 'Xa' },
    wordB: { hanzi: '近', pinyin: 'jìn', hanviet: 'CẬN', meaning: 'Gần' },
    contrastSentence: {
      hanzi: '我家离学校很近，离公司很远。',
      pinyin: 'wǒ jiā lí xué xiào hěn jìn ， lí gōng sī hěn yuǎn 。',
      meaning: 'Nhà tôi cách trường rất gần, cách công ty rất xa.',
    },
    tip: 'Cả hai chữ đều có bộ Quai xước (辶 - khoảng cách đường đi). Cấu trúc kinh điển: A 离 B 很近 / 很远.',
  },
  {
    id: 'dui_cuo',
    level: 'HSK 2',
    category: 'description',
    categoryName: 'Tính chất & Miêu tả',
    wordA: { hanzi: '对', pinyin: 'duì', hanviet: 'ĐỐI', meaning: 'Đúng' },
    wordB: { hanzi: '错', pinyin: 'cuò', hanviet: 'THÁC', meaning: 'Sai' },
    contrastSentence: {
      hanzi: '这个答案是对的，那个是错的。',
      pinyin: 'zhè ge dá àn shì duì de ， nà ge shì cuò de 。',
      meaning: 'Đáp án này đúng, đáp án kia sai.',
    },
    tip: 'Thường dùng trong khẩu ngữ: 你说得对 (Bạn nói đúng rồi), 我做错了 (Tôi làm sai rồi).',
  },
  {
    id: 'gui_pianyi',
    level: 'HSK 2',
    category: 'description',
    categoryName: 'Tính chất & Miêu tả',
    wordA: { hanzi: '贵', pinyin: 'guì', hanviet: 'QUÝ', meaning: 'Đắt / quý' },
    wordB: { hanzi: '便宜', pinyin: 'pián yi', hanviet: 'TIỆN NGHI', meaning: 'Rẻ' },
    contrastSentence: {
      hanzi: '这件衣服太贵了，那件比较便宜。',
      pinyin: 'zhè jiàn yī fu tài guì le ， nà jiàn bǐ jiào pián yi 。',
      meaning: 'Bộ quần áo này đắt quá, bộ kia tương đối rẻ.',
    },
    tip: 'Chữ 贵 có bộ Bối (贝 - vỏ sò tiền cổ, biểu thị giá trị tiền bạc). Chữ 便宜 đọc khinh thanh ở chữ 宜 (piányi).',
  },
  {
    id: 'nan_rongyi',
    level: 'HSK 2',
    category: 'description',
    categoryName: 'Tính chất & Miêu tả',
    wordA: { hanzi: '难', pinyin: 'nán', hanviet: 'NAN', meaning: 'Khó' },
    wordB: { hanzi: '容易', pinyin: 'róng yì', hanviet: 'DUNG DỊ', meaning: 'Dễ dàng' },
    contrastSentence: {
      hanzi: '写汉字很难，说汉语比较容易。',
      pinyin: 'xiě hàn zì hěn nán ， shuō hàn yǔ bǐ jiào róng yì 。',
      meaning: 'Viết chữ Hán rất khó, nói tiếng Trung tương đối dễ.',
    },
    tip: 'Phân biệt: 难 (nán) = khó khăn, đối lập hoàn toàn với 容易 (róngyì).',
  },
  {
    id: 'zao_wan',
    level: 'HSK 2',
    category: 'nature_weather',
    categoryName: 'Tự nhiên & Thời tiết',
    wordA: { hanzi: '早', pinyin: 'zǎo', hanviet: 'TẢO', meaning: 'Sớm / buổi sáng' },
    wordB: { hanzi: '晚', pinyin: 'wǎn', hanviet: 'VÃN', meaning: 'Muộn / buổi tối' },
    contrastSentence: {
      hanzi: '他今天来得太早了，我来得有点儿晚。',
      pinyin: 'tā jīn tiān lái de tài zǎo le ， wǒ lái de yǒu diǎnr wǎn 。',
      meaning: 'Hôm nay anh ấy đến quá sớm, tôi đến hơi muộn một chút.',
    },
    tip: 'Cả hai chữ đều có bộ Nhật (日 - mặt trời). 早 là mặt trời mọc sớm, 晚 là mặt trời lặn muộn.',
  },
  {
    id: 'chang_duan',
    level: 'HSK 2',
    category: 'size_amount',
    categoryName: 'Kích thước & Số lượng',
    wordA: { hanzi: '长', pinyin: 'cháng', hanviet: 'TRƯỜNG', meaning: 'Dài' },
    wordB: { hanzi: '短', pinyin: 'duǎn', hanviet: 'ĐOẢN', meaning: 'Ngắn' },
    contrastSentence: {
      hanzi: '这根绳子很长，那根很短。',
      pinyin: 'zhè gēn shéng zi hěn cháng ， nà gēn hěn duǎn 。',
      meaning: 'Sợi dây này rất dài, sợi kia rất ngắn.',
    },
    tip: 'LƯU Ý ĐA ÂM TỰ: 长 đọc cháng là tính từ "dài". Đọc zhǎng là động từ "lớn lên, trưởng thành".',
  },
  {
    id: 'hei_bai',
    level: 'HSK 2',
    category: 'description',
    categoryName: 'Tính chất & Miêu tả',
    wordA: { hanzi: '黑', pinyin: 'hēi', hanviet: 'HẮC', meaning: 'Đen' },
    wordB: { hanzi: '白', pinyin: 'bái', hanviet: 'BẠCH', meaning: 'Trắng' },
    contrastSentence: {
      hanzi: '大熊猫的身体是黑白两色的。',
      pinyin: 'dà xióng māo de shēn tǐ shì hēi bái liǎng sè de 。',
      meaning: 'Thân hình gấu trúc lớn có hai màu đen và trắng.',
    },
    tip: 'Hai màu sắc tương phản kinh điển nhất trong bảng màu văn hóa phương Đông.',
  },
  {
    id: 'qing_yin',
    level: 'HSK 2',
    category: 'nature_weather',
    categoryName: 'Tự nhiên & Thời tiết',
    wordA: { hanzi: '晴', pinyin: 'qíng', hanviet: 'TÌNH', meaning: 'Nắng ráo / trời quang' },
    wordB: { hanzi: '阴', pinyin: 'yīn', hanviet: 'ÂM', meaning: 'Âm u / nhiều mây' },
    contrastSentence: {
      hanzi: '昨天是晴天，今天变成阴天了。',
      pinyin: 'zuó tiān shì qíng tiān ， jīn tiān biàn chéng yīn tiān le 。',
      meaning: 'Hôm qua là ngày nắng đẹp, hôm nay chuyển thành trời âm u rồi.',
    },
    tip: 'Chữ 晴 có bộ Nhật (日). Chữ 阴 có bộ Phụ (阝) tượng trưng sườn núi che khuất bóng râm.',
  },
  {
    id: 'wen_da',
    level: 'HSK 2',
    category: 'action_direction',
    categoryName: 'Hành động & Phương hướng',
    wordA: { hanzi: '问', pinyin: 'wèn', hanviet: 'VẤN', meaning: 'Hỏi' },
    wordB: { hanzi: '答', pinyin: 'dá', hanviet: 'ĐÁP', meaning: 'Trả lời' },
    contrastSentence: {
      hanzi: '老师问了一个问题，学生回答得很好。',
      pinyin: 'lǎo shī wèn le yí gè wèn tí ， xué sheng huí dá de hěn hǎo 。',
      meaning: 'Thầy giáo đã hỏi một câu hỏi, học sinh trả lời rất tốt.',
    },
    tip: 'Ghép lại 问答 (wèndá) = Hỏi đáp (Q&A). Chữ 问 có bộ Môn (门) và bộ Khẩu (口) ở trong.',
  },
  {
    id: 'xiao_ku',
    level: 'HSK 2',
    category: 'action_direction',
    categoryName: 'Hành động & Phương hướng',
    wordA: { hanzi: '笑', pinyin: 'xiào', hanviet: 'TIẾU', meaning: 'Cười' },
    wordB: { hanzi: '哭', pinyin: 'kū', hanviet: 'KHỐC', meaning: 'Khóc' },
    contrastSentence: {
      hanzi: '宝宝一会儿笑，一会儿哭。',
      pinyin: 'bǎo bao yí huìr xiào ， yí huìr kū 。',
      meaning: 'Em bé một lát thì cười, một lát lại khóc.',
    },
    tip: 'Chữ 笑 có bộ Trúc (⺮) ở trên. Chữ 哭 có hai bộ Khẩu (口 口) tượng trưng hai con mắt rơi nước mắt.',
  },
];
