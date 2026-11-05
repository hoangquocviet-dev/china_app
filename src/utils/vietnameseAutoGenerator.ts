import type { ChineseWord } from '../types';
import { DICTIONARY_WORDS } from '../data/dictionaryData';

// Common Character Map for Pinyin and Han-Viet synthesis
const CHAR_MAP: Record<string, { pinyin: string; hanviet: string }> = {
  你: { pinyin: 'nǐ', hanviet: 'NHĨ' },
  好: { pinyin: 'hǎo', hanviet: 'HẢO' },
  我: { pinyin: 'wǒ', hanviet: 'NGÃ' },
  他: { pinyin: 'tā', hanviet: 'THA' },
  她: { pinyin: 'tā', hanviet: 'THA' },
  们: { pinyin: 'men', hanviet: 'MÔN' },
  这: { pinyin: 'zhè', hanviet: 'GIÁ' },
  那: { pinyin: 'nà', hanviet: 'NA' },
  是: { pinyin: 'shì', hanviet: 'THỊ' },
  在: { pinyin: 'zài', hanviet: 'TẠI' },
  有: { pinyin: 'yǒu', hanviet: 'HỮU' },
  不: { pinyin: 'bù', hanviet: 'BẤT' },
  很: { pinyin: 'hěn', hanviet: 'HẨN' },
  大: { pinyin: 'dà', hanviet: 'ĐẠI' },
  小: { pinyin: 'xiǎo', hanviet: 'TIỂU' },
  多: { pinyin: 'duō', hanviet: 'ĐA' },
  少: { pinyin: 'shǎo', hanviet: 'THIỂU' },
  爱: { pinyin: 'ài', hanviet: 'ÁI' },
  喜: { pinyin: 'xǐ', hanviet: 'HỶ' },
  欢: { pinyin: 'huan', hanviet: 'HOAN' },
  吃: { pinyin: 'chī', hanviet: 'CẬT' },
  喝: { pinyin: 'hē', hanviet: 'HÁT' },
  茶: { pinyin: 'chá', hanviet: 'TRÀ' },
  水: { pinyin: 'shuǐ', hanviet: 'THỦY' },
  咖: { pinyin: 'kā', hanviet: 'CA' },
  啡: { pinyin: 'fēi', hanviet: 'PHÊ' },
  饭: { pinyin: 'fàn', hanviet: 'PHẠN' },
  米: { pinyin: 'mǐ', hanviet: 'MỄ' },
  菜: { pinyin: 'cài', hanviet: 'THÁI' },
  肉: { pinyin: 'ròu', hanviet: 'NHỤC' },
  鱼: { pinyin: 'yú', hanviet: 'NGƯ' },
  看: { pinyin: 'kàn', hanviet: 'KHÁN' },
  听: { pinyin: 'tīng', hanviet: 'THÍNH' },
  说: { pinyin: 'shuō', hanviet: 'THUYẾT' },
  写: { pinyin: 'xiě', hanviet: 'TẢ' },
  读: { pinyin: 'dú', hanviet: 'ĐỘC' },
  字: { pinyin: 'zì', hanviet: 'TỰ' },
  书: { pinyin: 'shū', hanviet: 'THƯ' },
  学: { pinyin: 'xué', hanviet: 'HỌC' },
  习: { pinyin: 'xí', hanviet: 'TẬP' },
  校: { pinyin: 'xiào', hanviet: 'HIỆU' },
  生: { pinyin: 'shēng', hanviet: 'SINH' },
  师: { pinyin: 'shī', hanviet: 'SƯ' },
  老: { pinyin: 'lǎo', hanviet: 'LÃO' },
  朋: { pinyin: 'péng', hanviet: 'BẰNG' },
  友: { pinyin: 'you', hanviet: 'HỮU' },
  医: { pinyin: 'yī', hanviet: 'Y' },
  院: { pinyin: 'yuàn', hanviet: 'VIỆN' },
  钱: { pinyin: 'qián', hanviet: 'TIỀN' },
  买: { pinyin: 'mǎi', hanviet: 'MÃI' },
  卖: { pinyin: 'mài', hanviet: 'MẠI' },
  去: { pinyin: 'qù', hanviet: 'KHỨ' },
  来: { pinyin: 'lái', hanviet: 'LAI' },
  回: { pinyin: 'huí', hanviet: 'HỒI' },
  到: { pinyin: 'dào', hanviet: 'ĐÁO' },
  想: { pinyin: 'xiǎng', hanviet: 'TƯỞNG' },
  要: { pinyin: 'yào', hanviet: 'YẾU' },
  能: { pinyin: 'néng', hanviet: 'NĂNG' },
  会: { pinyin: 'huì', hanviet: 'HỘI' },
  做: { pinyin: 'zuò', hanviet: 'TỐ' },
  工: { pinyin: 'gōng', hanviet: 'CÔNG' },
  作: { pinyin: 'zuò', hanviet: 'TÁC' },
  天: { pinyin: 'tiān', hanviet: 'THIÊN' },
  气: { pinyin: 'qì', hanviet: 'KHÍ' },
  冷: { pinyin: 'lěng', hanviet: 'LÃNH' },
  热: { pinyin: 'rè', hanviet: 'NHIỆT' },
  猫: { pinyin: 'māo', hanviet: 'MIÊU' },
  狗: { pinyin: 'gǒu', hanviet: 'CẨU' },
  车: { pinyin: 'chē', hanviet: 'XA' },
  电: { pinyin: 'diàn', hanviet: 'ĐIỆN' },
  视: { pinyin: 'shì', hanviet: 'THỊ' },
  影: { pinyin: 'yǐng', hanviet: 'ẢNH' },
  脑: { pinyin: 'nǎo', hanviet: 'NÃO' },
  话: { pinyin: 'huà', hanviet: 'THOẠI' },
  手: { pinyin: 'shǒu', hanviet: 'THỦ' },
  机: { pinyin: 'jī', hanviet: 'CƠ' },
  飞: { pinyin: 'fēi', hanviet: 'PHI' },
  年: { pinyin: 'nián', hanviet: 'NIÊN' },
  月: { pinyin: 'yuè', hanviet: 'NGUYỆT' },
  日: { pinyin: 'rì', hanviet: 'NHẬT' },
  时: { pinyin: 'shí', hanviet: 'THỜI' },
  分: { pinyin: 'fēn', hanviet: 'PHÂN' },
  点: { pinyin: 'diǎn', hanviet: 'ĐIỂM' },
  上: { pinyin: 'shàng', hanviet: 'THƯỢNG' },
  下: { pinyin: 'xià', hanviet: 'HẠ' },
  前: { pinyin: 'qián', hanviet: 'TIỀN' },
  后: { pinyin: 'hòu', hanviet: 'HẬU' },
  里: { pinyin: 'lǐ', hanviet: 'LÝ' },
  高: { pinyin: 'gāo', hanviet: 'CAO' },
  兴: { pinyin: 'xìng', hanviet: 'HƯNG' },
  谢: { pinyin: 'xiè', hanviet: 'TẠ' },
  再: { pinyin: 'zài', hanviet: 'TÁI' },
  见: { pinyin: 'jiàn', hanviet: 'KIẾN' },
  对: { pinyin: 'duì', hanviet: 'ĐỐI' },
  起: { pinyin: 'qǐ', hanviet: 'KHỞI' },
  没: { pinyin: 'méi', hanviet: 'MỘI' },
  关: { pinyin: 'guān', hanviet: 'QUAN' },
  系: { pinyin: 'xì', hanviet: 'HỆ' },
  苹: { pinyin: 'píng', hanviet: 'BÌNH' },
  果: { pinyin: 'guǒ', hanviet: 'QUẢ' },
  睡: { pinyin: 'shuì', hanviet: 'THỤY' },
  觉: { pinyin: 'jiào', hanviet: 'GIÁC' },
  衣: { pinyin: 'yī', hanviet: 'Y' },
  服: { pinyin: 'fu', hanviet: 'PHỤC' },
  快: { pinyin: 'kuài', hanviet: 'KHOÁI' },
  乐: { pinyin: 'lè', hanviet: 'LẠC' },
  中: { pinyin: 'zhōng', hanviet: 'TRUNG' },
  国: { pinyin: 'guó', hanviet: 'QUỐC' },
  越: { pinyin: 'yuè', hanviet: 'VIỆT' },
  南: { pinyin: 'nán', hanviet: 'NAM' },
  语: { pinyin: 'yǔ', hanviet: 'NGỮ' },
  文: { pinyin: 'wén', hanviet: 'VĂN' },
  汉: { pinyin: 'hàn', hanviet: 'HÁN' },
};

// Common Vietnamese Vocabulary to Chinese mappings
const VIET_TO_CHINESE: Array<{
  keywords: string[];
  word: Omit<ChineseWord, 'id'>;
}> = [
  {
    keywords: ['ca phe', 'cà phê', 'cà phê sữa', 'cafe'],
    word: {
      hanzi: '咖啡',
      pinyin: 'kāfēi',
      hanviet: 'CA PHÊ',
      meaning: 'Cà phê',
      pos: 'Danh từ',
      level: 'HSK1',
      examples: [
        { zh: '我想喝一杯咖啡。', pinyin: 'Wǒ xiǎng hē yī bēi kāfēi.', vi: 'Tôi muốn uống một ly cà phê.' }
      ]
    }
  },
  {
    keywords: ['tra', 'trà', 'chè', 'uong tra', 'uống trà'],
    word: {
      hanzi: '茶',
      pinyin: 'chá',
      hanviet: 'TRÀ',
      meaning: 'Trà, chè',
      pos: 'Danh từ',
      level: 'HSK1',
      examples: [
        { zh: '请喝茶。', pinyin: 'Qǐng hē chá.', vi: 'Mời uống trà.' }
      ]
    }
  },
  {
    keywords: ['bac si', 'bác sĩ', 'thay thuoc', 'thầy thuốc'],
    word: {
      hanzi: '医生',
      pinyin: 'yīshēng',
      hanviet: 'Y SINH',
      meaning: 'Bác sĩ',
      pos: 'Danh từ',
      level: 'HSK1',
      examples: [
        { zh: '他是医院的医生。', pinyin: 'Tā shì yīyuàn de yīshēng.', vi: 'Anh ấy là bác sĩ của bệnh viện.' }
      ]
    }
  },
  {
    keywords: ['benh vien', 'bệnh viện', 'nha thuong', 'nhà thương'],
    word: {
      hanzi: '医院',
      pinyin: 'yīyuàn',
      hanviet: 'Y VIỆN',
      meaning: 'Bệnh viện',
      pos: 'Danh từ',
      level: 'HSK1',
      examples: [
        { zh: '他去医院看病。', pinyin: 'Tā qù yīyuàn kànbìng.', vi: 'Anh ấy đi bệnh viện khám bệnh.' }
      ]
    }
  },
  {
    keywords: ['truong hoc', 'trường học', 'truong', 'trường'],
    word: {
      hanzi: '学校',
      pinyin: 'xuéxiào',
      hanviet: 'HỌC HIỆU',
      meaning: 'Trường học',
      pos: 'Danh từ',
      level: 'HSK1',
      examples: [
        { zh: '我的学校很大。', pinyin: 'Wǒ de xuéxiào hěn dà.', vi: 'Trường học của tôi rất to lớn.' }
      ]
    }
  },
  {
    keywords: ['ban be', 'bạn bè', 'ban than', 'bạn thân', 'nguoi ban', 'người bạn'],
    word: {
      hanzi: '朋友',
      pinyin: 'péngyou',
      hanviet: 'BẰNG HỮU',
      meaning: 'Bạn bè, người bạn',
      pos: 'Danh từ',
      level: 'HSK1',
      examples: [
        { zh: '他是我的好朋友。', pinyin: 'Tā shì wǒ de hǎo péngyou.', vi: 'Cậu ấy là người bạn tốt của tôi.' }
      ]
    }
  },
  {
    keywords: ['xin chao', 'xin chào', 'chao', 'chào'],
    word: {
      hanzi: '你好',
      pinyin: 'nǐ hǎo',
      hanviet: 'NHĨ HẢO',
      meaning: 'Xin chào',
      pos: 'Thán từ',
      level: 'HSK1',
      examples: [
        { zh: '你好！很高兴认识你。', pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshí nǐ.', vi: 'Xin chào! Rất vui được quen bạn.' }
      ]
    }
  },
  {
    keywords: ['cam on', 'cảm ơn', 'cam ta', 'cảm tạ'],
    word: {
      hanzi: '谢谢',
      pinyin: 'xiè xie',
      hanviet: 'TẠ TẠ',
      meaning: 'Cảm ơn',
      pos: 'Động từ',
      level: 'HSK1',
      examples: [
        { zh: '太谢谢你了！', pinyin: 'Tài xièxie nǐ le!', vi: 'Rất cảm ơn bạn!' }
      ]
    }
  },
  {
    keywords: ['tam biet', 'tạm biệt', 'hen gap lai', 'hẹn gặp lại'],
    word: {
      hanzi: '再见',
      pinyin: 'zài jiàn',
      hanviet: 'TÁI KIẾN',
      meaning: 'Tạm biệt, hẹn gặp lại',
      pos: 'Động từ',
      level: 'HSK1',
      examples: [
        { zh: '明天见，再见！', pinyin: 'Míngtiān jiàn, zàijiàn!', vi: 'Ngày mai gặp lại, tạm biệt!' }
      ]
    }
  },
  {
    keywords: ['yeu', 'yêu', 'tinh yeu', 'tình yêu', 'yeu thuong', 'yêu thương'],
    word: {
      hanzi: '爱',
      pinyin: 'ài',
      hanviet: 'ÁI',
      meaning: 'Yêu, yêu thương',
      pos: 'Động từ',
      level: 'HSK1',
      examples: [
        { zh: '我爱你。', pinyin: 'Wǒ ài nǐ.', vi: 'Tôi yêu bạn.' }
      ]
    }
  },
  {
    keywords: ['thich', 'thích', 'yeu thich', 'yêu thích', 'thich thu', 'thích thú'],
    word: {
      hanzi: '喜欢',
      pinyin: 'xǐhuan',
      hanviet: 'HỶ HOAN',
      meaning: 'Thích, yêu thích',
      pos: 'Động từ',
      level: 'HSK1',
      examples: [
        { zh: '我很喜欢学中文。', pinyin: 'Wǒ hěn xǐhuan xué zhōngwén.', vi: 'Tôi rất thích học tiếng Trung.' }
      ]
    }
  },
  {
    keywords: ['nghe nhac', 'nghe nhạc', 'am nhac', 'âm nhạc', 'bai hat', 'bài hát'],
    word: {
      hanzi: '听音乐',
      pinyin: 'tīng yīnyuè',
      hanviet: 'THÍNH ÂM NHẠC',
      meaning: 'Nghe nhạc',
      pos: 'Cụm động từ',
      level: 'HSK2',
      examples: [
        { zh: '我喜欢一边看书一边听音乐。', pinyin: 'Wǒ xǐhuan yībiān kànshū yībiān tīng yīnyuè.', vi: 'Tôi thích vừa đọc sách vừa nghe nhạc.' }
      ]
    }
  },
  {
    keywords: ['xem phim', 'xem điện ảnh', 'dien anh', 'điện ảnh'],
    word: {
      hanzi: '看电影',
      pinyin: 'kàn diànyǐng',
      hanviet: 'KHÁN ĐIỆN ẢNH',
      meaning: 'Xem phim',
      pos: 'Cụm động từ',
      level: 'HSK1',
      examples: [
        { zh: '星期六我们去看电影吧。', pinyin: 'Xīngqīliù wǒmen qù kàn diànyǐng ba.', vi: 'Thứ bảy chúng ta cùng đi xem phim nhé.' }
      ]
    }
  },
  {
    keywords: ['nuoc', 'nước', 'uong nuoc', 'uống nước'],
    word: {
      hanzi: '水',
      pinyin: 'shuǐ',
      hanviet: 'THỦY',
      meaning: 'Nước, uống nước',
      pos: 'Danh từ',
      level: 'HSK1',
      examples: [
        { zh: '多喝水对身体好。', pinyin: 'Duō hē shuǐ duì shēntǐ hǎo.', vi: 'Uống nhiều nước tốt cho cơ thể.' }
      ]
    }
  },
  {
    keywords: ['sach', 'sách', 'doc sach', 'đọc sách'],
    word: {
      hanzi: '书',
      pinyin: 'shū',
      hanviet: 'THƯ',
      meaning: 'Sách, cuốn sách',
      pos: 'Danh từ',
      level: 'HSK1',
      examples: [
        { zh: '桌子上有一本书。', pinyin: 'Zhuōzi shàng yǒu yī běn shū.', vi: 'Trên bàn có một quyển sách.' }
      ]
    }
  },
  {
    keywords: ['meo', 'mèo', 'con meo', 'con mèo'],
    word: {
      hanzi: '猫',
      pinyin: 'māo',
      hanviet: 'MIÊU',
      meaning: 'Mèo, con mèo',
      pos: 'Danh từ',
      level: 'HSK1',
      examples: [
        { zh: '这只小猫很可爱。', pinyin: 'Zhè zhī xiǎo māo hěn kě\'ài.', vi: 'Con mèo nhỏ này rất đáng yêu.' }
      ]
    }
  },
  {
    keywords: ['cho', 'chó', 'con cho', 'con chó'],
    word: {
      hanzi: '狗',
      pinyin: 'gǒu',
      hanviet: 'CẨU',
      meaning: 'Chó, con chó',
      pos: 'Danh từ',
      level: 'HSK1',
      examples: [
        { zh: '他家有一只大狗。', pinyin: 'Tā jiā yǒu yī zhī dà gǒu.', vi: 'Nhà anh ấy có một con chó to.' }
      ]
    }
  },
  {
    keywords: ['tao', 'táo', 'qua tao', 'quả táo'],
    word: {
      hanzi: '苹果',
      pinyin: 'píngguǒ',
      hanviet: 'BÌNH QUẢ',
      meaning: 'Quả táo',
      pos: 'Danh từ',
      level: 'HSK1',
      examples: [
        { zh: '我想买两斤苹果。', pinyin: 'Wǒ xiǎng mǎi liǎng jīn píngguǒ.', vi: 'Tôi muốn mua hai cân táo.' }
      ]
    }
  },
  {
    keywords: ['dien thoai', 'điện thoại', 'di dong', 'di động'],
    word: {
      hanzi: '手机',
      pinyin: 'shǒujī',
      hanviet: 'THỦ CƠ',
      meaning: 'Điện thoại di động',
      pos: 'Danh từ',
      level: 'HSK2',
      examples: [
        { zh: '这是我的新手机。', pinyin: 'Zhè shì wǒ de xīn shǒujī.', vi: 'Đây là chiếc điện thoại mới của tôi.' }
      ]
    }
  },
  {
    keywords: ['may tinh', 'máy tính', 'laptop'],
    word: {
      hanzi: '电脑',
      pinyin: 'diànnǎo',
      hanviet: 'ĐIỆN NÃO',
      meaning: 'Máy tính, máy vi tính',
      pos: 'Danh từ',
      level: 'HSK1',
      examples: [
        { zh: '我在电脑前工作。', pinyin: 'Wǒ zài diànnǎo qián gōngzuò.', vi: 'Tôi làm việc trước máy tính.' }
      ]
    }
  },
  {
    keywords: ['tien', 'tiền', 'dong tien', 'đồng tiền'],
    word: {
      hanzi: '钱',
      pinyin: 'qián',
      hanviet: 'TIỀN',
      meaning: 'Tiền bạc, tiền tệ',
      pos: 'Danh từ',
      level: 'HSK1',
      examples: [
        { zh: '这个多少钱？', pinyin: 'Zhège duōshao qián?', vi: 'Cái này bao nhiêu tiền?' }
      ]
    }
  },
  {
    keywords: ['nha', 'nhà', 'gia dinh', 'gia đình'],
    word: {
      hanzi: '家',
      pinyin: 'jiā',
      hanviet: 'GIA',
      meaning: 'Nhà, gia đình',
      pos: 'Danh từ',
      level: 'HSK1',
      examples: [
        { zh: '我家在河内。', pinyin: 'Wǒ jiā zài Hénèi.', vi: 'Nhà tôi ở Hà Nội.' }
      ]
    }
  },
  {
    keywords: ['hoc', 'học', 'hoc tap', 'học tập', 'nghien cuu', 'nghiên cứu'],
    word: {
      hanzi: '学习',
      pinyin: 'xuéxí',
      hanviet: 'HỌC TẬP',
      meaning: 'Học tập, nghiên cứu',
      pos: 'Động từ',
      level: 'HSK1',
      examples: [
        { zh: '好好学习，天天向上。', pinyin: 'Hǎohǎo xuéxí, tiāntiān xiàngshàng.', vi: 'Học tập thật tốt, mỗi ngày một tiến bộ.' }
      ]
    }
  },
  {
    keywords: ['lam viec', 'làm việc', 'cong viec', 'công việc'],
    word: {
      hanzi: '工作',
      pinyin: 'gōngzuò',
      hanviet: 'CÔNG TÁC',
      meaning: 'Công việc, làm việc',
      pos: 'Động từ',
      level: 'HSK1',
      examples: [
        { zh: '你明天工作吗？', pinyin: 'Nǐ míngtiān gōngzuò ma?', vi: 'Ngày mai bạn có đi làm không?' }
      ]
    }
  },
  {
    keywords: ['ngu', 'ngủ', 'di ngu', 'đi ngủ'],
    word: {
      hanzi: '睡觉',
      pinyin: 'shuìjiào',
      hanviet: 'THỤY GIÁC',
      meaning: 'Ngủ, đi ngủ',
      pos: 'Động từ',
      level: 'HSK1',
      examples: [
        { zh: '太晚了，快去睡觉吧。', pinyin: 'Tài wǎn le, kuài qù shuìjiào ba.', vi: 'Muộn quá rồi, mau đi ngủ đi.' }
      ]
    }
  },
  {
    keywords: ['vui ve', 'vui vẻ', 'vui mung', 'vui mừng', 'vui', 'hạnh phúc'],
    word: {
      hanzi: '高兴',
      pinyin: 'gāoxìng',
      hanviet: 'CAO HƯNG',
      meaning: 'Vui vẻ, hân hoan',
      pos: 'Tính từ',
      level: 'HSK1',
      examples: [
        { zh: '今天大家都很高兴。', pinyin: 'Jīntiān dàjiā dōu hěn gāoxìng.', vi: 'Hôm nay mọi người đều rất vui vẻ.' }
      ]
    }
  },
  {
    keywords: ['dep', 'đẹp', 'xinh dep', 'xinh đẹp', 'dep de', 'đẹp đẽ'],
    word: {
      hanzi: '漂亮',
      pinyin: 'piàoliang',
      hanviet: 'PHIÊU LƯỢNG',
      meaning: 'Đẹp, xinh đẹp',
      pos: 'Tính từ',
      level: 'HSK1',
      examples: [
        { zh: '这件衣服真漂亮！', pinyin: 'Zhè jiàn yīfu zhēn piàoliang!', vi: 'Bộ quần áo này thật là đẹp!' }
      ]
    }
  },
  {
    keywords: ['sinh nhat', 'sinh nhật', 'ngay sinh', 'ngày sinh'],
    word: {
      hanzi: '生日',
      pinyin: 'shēngrì',
      hanviet: 'SINH NHẬT',
      meaning: 'Sinh nhật, ngày sinh',
      pos: 'Danh từ',
      level: 'HSK2',
      examples: [
        { zh: '祝你生日快乐！', pinyin: 'Zhù nǐ shēngrì kuàilè!', vi: 'Chúc bạn sinh nhật vui vẻ!' }
      ]
    }
  },
  {
    keywords: ['thoi tiet', 'thời tiết', 'khi troi', 'khí trời'],
    word: {
      hanzi: '天气',
      pinyin: 'tiānqì',
      hanviet: 'THIÊN KHÍ',
      meaning: 'Thời tiết',
      pos: 'Danh từ',
      level: 'HSK1',
      examples: [
        { zh: '今天天气很好。', pinyin: 'Jīntiān tiānqì hěn hǎo.', vi: 'Thời tiết hôm nay rất đẹp.' }
      ]
    }
  },
];

// Helper to remove accents for fuzzy matching
function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

// Generate Pinyin and Han-Viet from Hanzi characters
export function synthesizePinyinAndHanviet(hanzi: string): { pinyin: string; hanviet: string } {
  const chars = Array.from(hanzi.trim());
  const pinyins: string[] = [];
  const hanviets: string[] = [];

  for (const char of chars) {
    if (CHAR_MAP[char]) {
      pinyins.push(CHAR_MAP[char].pinyin);
      hanviets.push(CHAR_MAP[char].hanviet);
    } else {
      // Look up in DICTIONARY_WORDS for this char
      const dictMatch = DICTIONARY_WORDS.find((w) => w.hanzi.includes(char));
      if (dictMatch) {
        const charIdx = Array.from(dictMatch.hanzi).indexOf(char);
        const pinyinTokens = dictMatch.pinyin.split(/\s+/);
        const hanvietTokens = dictMatch.hanviet ? dictMatch.hanviet.split(/\s+/) : [];
        pinyins.push(pinyinTokens[charIdx] || pinyinTokens[0] || char);
        hanviets.push(hanvietTokens[charIdx] || hanvietTokens[0] || '');
      } else {
        pinyins.push(char);
      }
    }
  }

  return {
    pinyin: pinyins.join(' ').trim(),
    hanviet: hanviets.filter(Boolean).join(' ').trim().toUpperCase(),
  };
}

/**
 * Auto-generate a ChineseWord from a Vietnamese input.
 * Priority:
 * 1. Matching in curated VIET_TO_CHINESE dictionary.
 * 2. Matching in full DICTIONARY_WORDS (by Vietnamese meaning).
 * 3. Calling free translation API (MyMemory) and synthesizing Pinyin & Hanviet.
 */
export async function autoGenerateWordFromVietnamese(
  vietnameseInput: string
): Promise<{ success: boolean; word?: Omit<ChineseWord, 'id'>; message: string }> {
  const raw = vietnameseInput.trim();
  if (!raw) {
    return { success: false, message: 'Vui lòng nhập từ tiếng Việt.' };
  }

  const clean = raw.toLowerCase();
  const normalized = removeVietnameseTones(raw);

  // 1. Check curated VIET_TO_CHINESE
  const curatedMatch = VIET_TO_CHINESE.find((item) =>
    item.keywords.some((kw) => {
      const kwNorm = removeVietnameseTones(kw);
      return kwNorm === normalized || kw === clean;
    })
  );

  if (curatedMatch) {
    return {
      success: true,
      word: { ...curatedMatch.word },
      message: `Đã tìm thấy từ chuẩn "${curatedMatch.word.hanzi}" (${curatedMatch.word.pinyin}).`,
    };
  }

  // 2. Check DICTIONARY_WORDS by meaning
  const dictMatch = DICTIONARY_WORDS.find((w) => {
    const meaningNorm = removeVietnameseTones(w.meaning);
    return (
      meaningNorm === normalized ||
      w.meaning.toLowerCase().includes(clean) ||
      meaningNorm.includes(normalized)
    );
  });

  if (dictMatch) {
    return {
      success: true,
      word: {
        hanzi: dictMatch.hanzi,
        pinyin: dictMatch.pinyin,
        hanviet: dictMatch.hanviet,
        meaning: dictMatch.meaning,
        pos: dictMatch.pos,
        level: dictMatch.level,
        examples: dictMatch.examples || [],
      },
      message: `Đã tra từ điển: "${dictMatch.hanzi}" (${dictMatch.pinyin}).`,
    };
  }

  // 3. Fallback: Call Translation API
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(raw)}&langpair=vi|zh-CN`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const translatedText = data?.responseData?.translatedText;
      if (translatedText && typeof translatedText === 'string') {
        const cleanHanzi = translatedText.replace(/[^\u4e00-\u9fa5]/g, '');
        if (cleanHanzi) {
          const { pinyin, hanviet } = synthesizePinyinAndHanviet(cleanHanzi);
          return {
            success: true,
            word: {
              hanzi: cleanHanzi,
              pinyin: pinyin || '...',
              hanviet: hanviet || '',
              meaning: raw,
              pos: 'Danh từ',
              level: 'HSK1',
              examples: [
                {
                  zh: `这是${cleanHanzi}。`,
                  pinyin: `Zhè shì ${pinyin}.`,
                  vi: `Đây là ${raw}.`,
                },
              ],
            },
            message: `AI đã tự động tạo thành công: "${cleanHanzi}" (${pinyin})!`,
          };
        }
      }
    }
  } catch (err) {
    console.warn('[AutoGenerateWord] Online translation error:', err);
  }

  return {
    success: false,
    message: `Chưa thể tự tạo cho từ "${raw}". Bạn hãy chọn từ gợi ý hoặc nhập chi tiết nhé!`,
  };
}
