export interface SpokenQAPair {
  id: string;
  category: 'greeting' | 'thanks_apology' | 'dining_payment' | 'shopping' | 'directions' | 'opinion_social' | 'emergency';
  categoryName: string;
  categoryIcon: string;
  question: {
    chinese: string;
    pinyin: string;
    meaning: string;
    speaker?: string;
  };
  response: {
    chinese: string;
    pinyin: string;
    meaning: string;
    speaker?: string;
  };
  alternativeResponse?: {
    chinese: string;
    pinyin: string;
    meaning: string;
  };
  culturalTip?: string;
  keywords?: Array<{ word: string; pinyin: string; meaning: string }>;
}

export interface SpokenQuizQuestion {
  id: string;
  prompt: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const SPOKEN_CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: '✨' },
  { id: 'greeting', name: 'Chào hỏi & Xã giao', icon: '👋' },
  { id: 'thanks_apology', name: 'Cảm ơn & Xin lỗi', icon: '🙏' },
  { id: 'dining_payment', name: 'Ăn uống & Thanh toán', icon: '🍜' },
  { id: 'shopping', name: 'Mua sắm & Trả giá', icon: '🛍️' },
  { id: 'directions', name: 'Hỏi đường & Di chuyển', icon: '🗺️' },
  { id: 'opinion_social', name: 'Giao lưu & Ý kiến', icon: '💬' },
  { id: 'emergency', name: 'Khẩn cấp & Nhờ giúp', icon: '🆘' },
] as const;

export const SPOKEN_QA_PAIRS: SpokenQAPair[] = [
  // 1. Chào hỏi & Xã giao
  {
    id: 'spk-1',
    category: 'greeting',
    categoryName: 'Chào hỏi & Xã giao',
    categoryIcon: '👋',
    question: {
      chinese: '你最近怎么样？',
      pinyin: 'Nǐ zuìjìn zěnmeyàng?',
      meaning: 'Dạo này bạn thế nào?',
      speaker: 'Bạn bè hỏi',
    },
    response: {
      chinese: '还不错，你呢？',
      pinyin: 'Hái bùcuò, nǐ ne?',
      meaning: 'Vẫn khá ổn, còn bạn thì sao?',
      speaker: 'Bạn đáp',
    },
    alternativeResponse: {
      chinese: '老样子，挺忙的。',
      pinyin: 'Lǎoyàngzi, tǐng máng de.',
      meaning: 'Vẫn như cũ thôi, khá là bận.',
    },
    culturalTip: 'Người Trung Quốc hiện đại thường dùng "还不错" (vẫn ổn) hoặc "老样子" (như cũ) thay vì câu sách vở "我很好".',
    keywords: [
      { word: '最近', pinyin: 'zuìjìn', meaning: 'dạo này / gần đây' },
      { word: '还不错', pinyin: 'hái bùcuò', meaning: 'vẫn khá tốt / không tệ' },
    ],
  },
  {
    id: 'spk-2',
    category: 'greeting',
    categoryName: 'Chào hỏi & Xã giao',
    categoryIcon: '👋',
    question: {
      chinese: '好久不见！去哪儿了？',
      pinyin: 'Hǎojiǔ bùjiàn! Qù nǎr le?',
      meaning: 'Lâu rồi không gặp! Đi đâu đấy?',
      speaker: 'Người quen gặp',
    },
    response: {
      chinese: '我刚从北京回来！你呢？',
      pinyin: 'Wǒ gāng cóng Běijīng huílái! Nǐ ne?',
      meaning: 'Mình vừa từ Bắc Kinh về! Còn bạn?',
      speaker: 'Bạn đáp',
    },
    culturalTip: '"好久不见" là lời chào kinh điển khi lâu ngày gặp lại. "去哪儿" trong văn hóa TQ chỉ là câu hỏi xã giao tương tự "ăn cơm chưa", không nhất thiết phải báo cáo lịch trình cụ thể.',
    keywords: [
      { word: '好久不见', pinyin: 'hǎojiǔ bùjiàn', meaning: 'lâu rồi không gặp' },
      { word: '刚', pinyin: 'gāng', meaning: 'vừa mới' },
    ],
  },
  {
    id: 'spk-3',
    category: 'greeting',
    categoryName: 'Chào hỏi & Xã giao',
    categoryIcon: '👋',
    question: {
      chinese: '工作辛苦了！',
      pinyin: 'Gōngzuò xīnkǔ le!',
      meaning: 'Công việc vất vả rồi!',
      speaker: 'Đồng nghiệp / Sếp',
    },
    response: {
      chinese: '不辛苦，应该的。',
      pinyin: 'Bù xīnkǔ, yīnggāi de.',
      meaning: 'Không vất vả đâu, là việc nên làm mà.',
    },
    alternativeResponse: {
      chinese: '大家都很辛苦！',
      pinyin: 'Dàjiā dōu hěn xīnkǔ!',
      meaning: 'Mọi người đều rất vất vả mà!',
    },
    culturalTip: 'Khi được người khác nói "辛苦了" (vất vả rồi), câu đáp thể hiện sự khiêm tốn chuẩn mực nhất là "不辛苦，应该的" (Không vất vả, bổn phận của em thôi).',
    keywords: [
      { word: '辛苦', pinyin: 'xīnkǔ', meaning: 'vất vả / cực nhọc' },
      { word: '应该', pinyin: 'yīnggāi', meaning: 'nên / đáng lẽ' },
    ],
  },

  // 2. Cảm ơn & Xin lỗi
  {
    id: 'spk-4',
    category: 'thanks_apology',
    categoryName: 'Cảm ơn & Xin lỗi',
    categoryIcon: '🙏',
    question: {
      chinese: '今天太谢谢你了，帮了我大忙！',
      pinyin: 'Jīntiān tài xièxiè nǐ le, bāng le wǒ dà máng!',
      meaning: 'Hôm nay cảm ơn bạn nhiều nhé, giúp mình một việc lớn!',
      speaker: 'Bạn bè cảm ơn',
    },
    response: {
      chinese: '别客气，小事一桩！',
      pinyin: 'Bié kèqì, xiǎoshì yì zhuāng!',
      meaning: 'Đừng khách sáo, chuyện nhỏ như con thỏ thôi!',
      speaker: 'Bạn đáp',
    },
    alternativeResponse: {
      chinese: '没事，随时叫我。',
      pinyin: 'Méishì, suíshí jiào wǒ.',
      meaning: 'Không có chi, cần gì cứ gọi mình.',
    },
    culturalTip: '"小事一桩" (xiǎoshì yì zhuāng) là thành ngữ khẩu ngữ cực kỳ tự nhiên mang ý nghĩa "chuyện nhỏ, không bõ bận tâm".',
    keywords: [
      { word: '帮大忙', pinyin: 'bāng dà máng', meaning: 'giúp việc lớn' },
      { word: '小事一桩', pinyin: 'xiǎoshì yì zhuāng', meaning: 'chuyện nhỏ' },
    ],
  },
  {
    id: 'spk-5',
    category: 'thanks_apology',
    categoryName: 'Cảm ơn & Xin lỗi',
    categoryIcon: '🙏',
    question: {
      chinese: '真不好意思，给您添麻烦了。',
      pinyin: 'Zhēn bù hǎoyìsi, gěi nín tiān máfan le.',
      meaning: 'Thật ngại quá, đã làm phiền quý khách/bác rồi.',
      speaker: 'Người khác áy náy',
    },
    response: {
      chinese: '哪里哪里，没关系的。',
      pinyin: 'Nǎlǐ nǎlǐ, méi guānxi de.',
      meaning: 'Đâu có đâu ạ, không sao cả đâu.',
    },
    alternativeResponse: {
      chinese: '别放在心上。',
      pinyin: 'Bié fàng zài xīn shàng.',
      meaning: 'Đừng để trong lòng nhé.',
    },
    culturalTip: '"添麻烦" (tiān máfan) là cụm từ lịch thiệp thể hiện sự tôn trọng khi làm phiền người khác.',
    keywords: [
      { word: '麻烦', pinyin: 'máfan', meaning: 'phiền toái / làm phiền' },
      { word: '没关系', pinyin: 'méi guānxi', meaning: 'không có gì / không sao' },
    ],
  },
  {
    id: 'spk-6',
    category: 'thanks_apology',
    categoryName: 'Cảm ơn & Xin lỗi',
    categoryIcon: '🙏',
    question: {
      chinese: '对不起，路上堵车我迟到了！',
      pinyin: 'Duìbuqǐ, lùshang dǔchē wǒ chídào le!',
      meaning: 'Xin lỗi, trên đường kẹt xe nên mình đến trễ!',
      speaker: 'Bạn đến muộn',
    },
    response: {
      chinese: '没关系，我也刚到不久。',
      pinyin: 'Méi guānxi, wǒ yě gāng dào bù jiǔ.',
      meaning: 'Không sao đâu, mình cũng vừa tới một chút thôi.',
    },
    culturalTip: 'Câu đáp "我也刚到" (mình cũng vừa tới) là cách ứng xử tinh tế giúp người đối diện bớt cảm giác áy náy khi lỡ hẹn.',
    keywords: [
      { word: '堵车', pinyin: 'dǔchē', meaning: 'kẹt xe / tắc đường' },
      { word: '迟到', pinyin: 'chídào', meaning: 'đến muộn / trễ' },
    ],
  },

  // 3. Ăn uống & Thanh toán
  {
    id: 'spk-7',
    category: 'dining_payment',
    categoryName: 'Ăn uống & Thanh toán',
    categoryIcon: '🍜',
    question: {
      chinese: '服务员，买单！一共多少钱？',
      pinyin: 'Fúwùyuán, mǎidān! Yígòng duōshao qián?',
      meaning: 'Phục vụ ơi, tính tiền! Tổng cộng bao nhiêu tiền?',
      speaker: 'Bạn gọi thanh toán',
    },
    response: {
      chinese: '您好，一共是158块。',
      pinyin: 'Nín hǎo, yígòng shì yībǎi wǔshíbā kuài.',
      meaning: 'Chào anh/chị, tổng cộng là 158 tệ ạ.',
      speaker: 'Nhân viên đáp',
    },
    alternativeResponse: {
      chinese: '扫桌上的二维码也可以买单。',
      pinyin: 'Sǎo zhuō shàng de èrwéimǎ yě kěyǐ mǎidān.',
      meaning: 'Quét mã QR trên bàn cũng thanh toán được ạ.',
    },
    culturalTip: 'Ở Trung Quốc ngày nay, gọi "服务员" (phục vụ) hoặc "帅哥 / 美女" (anh đẹp trai / chị đẹp gái) đều rất phổ biến.',
    keywords: [
      { word: '买单', pinyin: 'mǎidān', meaning: 'thanh toán / tính tiền' },
      { word: '一共', pinyin: 'yígòng', meaning: 'tổng cộng' },
    ],
  },
  {
    id: 'spk-8',
    category: 'dining_payment',
    categoryName: 'Ăn uống & Thanh toán',
    categoryIcon: '🍜',
    question: {
      chinese: '微信还是支付宝？',
      pinyin: 'Wēixìn háishi Zhīfùbǎo?',
      meaning: 'Anh/chị thanh toán WeChat hay Alipay?',
      speaker: 'Thu ngân hỏi',
    },
    response: {
      chinese: '微信，我扫你还是你扫我？',
      pinyin: 'Wēixìn, wǒ sǎo nǐ háishi nǐ sǎo wǒ?',
      meaning: 'WeChat, tôi quét mã bạn hay bạn quét mã tôi?',
      speaker: 'Bạn đáp',
    },
    alternativeResponse: {
      chinese: '我扫你吧，二维码在哪儿？',
      pinyin: 'Wǒ sǎo nǐ ba, èrwéimǎ zài nǎr?',
      meaning: 'Để tôi quét bạn nhé, mã QR ở đâu?',
    },
    culturalTip: 'Đây là câu cửa miệng sống còn 100% khi sinh sống hay du lịch tại Trung Quốc không tiền mặt!',
    keywords: [
      { word: '微信', pinyin: 'Wēixìn', meaning: 'WeChat' },
      { word: '支付宝', pinyin: 'Zhīfùbǎo', meaning: 'Alipay' },
      { word: '扫', pinyin: 'sǎo', meaning: 'quét (mã)' },
    ],
  },
  {
    id: 'spk-9',
    category: 'dining_payment',
    categoryName: 'Ăn uống & Thanh toán',
    categoryIcon: '🍜',
    question: {
      chinese: '请问有忌口吗？能吃辣吗？',
      pinyin: 'Qǐngwèn yǒu jìkǒu ma? Néng chī là ma?',
      meaning: 'Xin hỏi quý khách có kiêng ăn gì không? Có ăn cay được không?',
      speaker: 'Nhân viên quán ăn hỏi',
    },
    response: {
      chinese: '微辣就行，不要香菜。',
      pinyin: 'Wēi là jiù xíng, bú yào xiāngcài.',
      meaning: 'Cay nhẹ là được, không cho rau mùi (ngò rí) nhé.',
      speaker: 'Bạn đáp',
    },
    alternativeResponse: {
      chinese: '一点儿辣都不能吃，请免辣。',
      pinyin: 'Yìdiǎnr là dōu bù néng chī, qǐng miǎnlà.',
      meaning: 'Không ăn cay được chút nào, xin đừng cho cay.',
    },
    culturalTip: 'Các cấp độ cay: 不辣 (không cay), 微辣 (cay nhẹ), 中辣 (cay vừa), 特辣 (siêu cay). "香菜" (rau mùi) là món kiêng kỵ của nhiều người.',
    keywords: [
      { word: '忌口', pinyin: 'jìkǒu', meaning: 'kiêng khem đồ ăn' },
      { word: '微辣', pinyin: 'wēilà', meaning: 'cay nhẹ' },
      { word: '香菜', pinyin: 'xiāngcài', meaning: 'rau mùi / ngò rí' },
    ],
  },

  // 4. Mua sắm & Trả giá
  {
    id: 'spk-10',
    category: 'shopping',
    categoryName: 'Mua sắm & Trả giá',
    categoryIcon: '🛍️',
    question: {
      chinese: '老板，这件衣服怎么卖？',
      pinyin: 'Lǎobǎn, zhè jiàn yīfu zěnme mài?',
      meaning: 'Chủ quán ơi, cái áo này bán thế nào?',
      speaker: 'Bạn hỏi mua',
    },
    response: {
      chinese: '两百块一件，纯棉的。',
      pinyin: 'Liǎng bǎi kuài yí jiàn, chúnmián de.',
      meaning: '200 tệ một chiếc, chất liệu cotton 100% đấy.',
      speaker: 'Chủ quán đáp',
    },
    culturalTip: '"怎么卖" (bán thế nào) là cách hỏi giá tự nhiên và bình dân nhất, thân mật hơn "多少钱".',
    keywords: [
      { word: '怎么卖', pinyin: 'zěnme mài', meaning: 'bán thế nào / bao nhiêu tiền' },
      { word: '纯棉', pinyin: 'chúnmián', meaning: 'cotton thuần chất' },
    ],
  },
  {
    id: 'spk-11',
    category: 'shopping',
    categoryName: 'Mua sắm & Trả giá',
    categoryIcon: '🛍️',
    question: {
      chinese: '太贵了！便宜点行不行？',
      pinyin: 'Tài guì le! Piányi diǎn xíng bù xíng?',
      meaning: 'Đắt quá! Bớt chút được không anh/chị?',
      speaker: 'Bạn mặc cả',
    },
    response: {
      chinese: '最低一百五，不能再少了！',
      pinyin: 'Zuìdī yībǎi wǔ, bù néng zài shǎo le!',
      meaning: 'Thấp nhất 150 tệ, không bớt hơn được nữa đâu!',
      speaker: 'Chủ quán đáp',
    },
    alternativeResponse: {
      chinese: '给你打个九折吧。',
      pinyin: 'Gěi nǐ dǎ gè jiǔ zhé ba.',
      meaning: 'Thôi giảm cho bạn 10% (tính 90%) nhé.',
    },
    culturalTip: 'Chú ý cách giảm giá ở TQ: "九折" (cửu chiết) là giảm 10% (trả 90%), "八折" là giảm 20%, "半价" là giảm 50%.',
    keywords: [
      { word: '便宜', pinyin: 'piányi', meaning: 'rẻ' },
      { word: '最低', pinyin: 'zuìdī', meaning: 'thấp nhất' },
      { word: '打折', pinyin: 'dǎzhé', meaning: 'giảm giá' },
    ],
  },
  {
    id: 'spk-12',
    category: 'shopping',
    categoryName: 'Mua sắm & Trả giá',
    categoryIcon: '🛍️',
    question: {
      chinese: '这个有大一号的吗？能试一下吗？',
      pinyin: 'Zhège yǒu dà yí hào de ma? Néng shì yíxià ma?',
      meaning: 'Cái này có size lớn hơn một số không? Có thể thử được không?',
      speaker: 'Bạn hỏi',
    },
    response: {
      chinese: '有L码的，试衣间在那边。',
      pinyin: 'Yǒu L mǎ de, shìyījiān zài nàbiān.',
      meaning: 'Có size L, phòng thử đồ ở bên kia ạ.',
      speaker: 'Nhân viên đáp',
    },
    culturalTip: 'Size áo: S码 (nhỏ), M码 (vừa), L码 (lớn), XL码 (rất lớn).',
    keywords: [
      { word: '大一号', pinyin: 'dà yí hào', meaning: 'lớn hơn 1 size' },
      { word: '试衣间', pinyin: 'shìyījiān', meaning: 'phòng thử đồ' },
    ],
  },

  // 5. Hỏi đường & Di chuyển
  {
    id: 'spk-13',
    category: 'directions',
    categoryName: 'Hỏi đường & Di chuyển',
    categoryIcon: '🗺️',
    question: {
      chinese: '请问，最近的地铁站在哪儿？',
      pinyin: 'Qǐngwèn, zuìjìn de dìtiězhàn zài nǎr?',
      meaning: 'Xin hỏi, trạm tàu điện ngầm gần nhất ở đâu ạ?',
      speaker: 'Bạn hỏi đường',
    },
    response: {
      chinese: '一直往前走，过马路就是。',
      pinyin: 'Yìzhí wǎng qián zǒu, guò mǎlù jiù shì.',
      meaning: 'Cứ đi thẳng về phía trước, băng qua đường là tới.',
      speaker: 'Người đi đường chỉ',
    },
    alternativeResponse: {
      chinese: '走五分钟，在红绿灯右拐。',
      pinyin: 'Zǒu wǔ fēnzhōng, zài hónglǜdēng yòu guǎi.',
      meaning: 'Đi bộ 5 phút, rẽ phải ở cột đèn giao thông.',
    },
    culturalTip: '"往前走" (đi về phía trước), "过马路" (băng qua đường), "右拐 / 左拐" (rẽ phải / rẽ trái) là các cụm từ chỉ đường cốt lõi.',
    keywords: [
      { word: '地铁站', pinyin: 'dìtiězhàn', meaning: 'trạm tàu điện ngầm' },
      { word: '过马路', pinyin: 'guò mǎlù', meaning: 'qua đường' },
      { word: '右拐', pinyin: 'yòu guǎi', meaning: 'rẽ phải' },
    ],
  },
  {
    id: 'spk-14',
    category: 'directions',
    categoryName: 'Hỏi đường & Di chuyển',
    categoryIcon: '🗺️',
    question: {
      chinese: '师傅，去机场大概要多长时间？',
      pinyin: 'Shīfu, qù jīchǎng dàgài yào duōcháng shíjiān?',
      meaning: 'Bác tài ơi, đến sân bay mất khoảng bao lâu?',
      speaker: 'Bạn hỏi tài xế taxi',
    },
    response: {
      chinese: '不堵车的话，四十分钟左右。',
      pinyin: 'Bù dǔchē dehuà, sìshí fēnzhōng zuǒyòu.',
      meaning: 'Nếu không kẹt xe thì khoảng chừng 40 phút.',
      speaker: 'Tài xế đáp',
    },
    culturalTip: '"师傅" (shīfu - sư phụ/bác tài) là danh xưng lịch sự, thân mật cho tài xế, thợ thủ công hoặc nhân viên dịch vụ nam giới.',
    keywords: [
      { word: '师傅', pinyin: 'shīfu', meaning: 'bác tài / bác thợ' },
      { word: '机场', pinyin: 'jīchǎng', meaning: 'sân bay' },
      { word: '左右', pinyin: 'zuǒyòu', meaning: 'khoảng chừng' },
    ],
  },

  // 6. Giao lưu & Ý kiến
  {
    id: 'spk-15',
    category: 'opinion_social',
    categoryName: 'Giao lưu & Ý kiến',
    categoryIcon: '💬',
    question: {
      chinese: '你觉得这道菜味道怎么样？',
      pinyin: 'Nǐ juéde zhè dào cài wèidào zěnmeyàng?',
      meaning: 'Bạn thấy mùi vị món ăn này thế nào?',
      speaker: 'Bạn bè hỏi',
    },
    response: {
      chinese: '味道好极了，非常有特色！',
      pinyin: 'Wèidào hǎo jí le, fēicháng yǒu tèsè!',
      meaning: 'Mùi vị ngon tuyệt cú mèo, rất đặc sắc!',
      speaker: 'Bạn đáp',
    },
    alternativeResponse: {
      chinese: '稍微有点咸，不过还挺好吃的。',
      pinyin: 'Shāowēi yǒudiǎnr xián, búguò hái tǐng hǎochī de.',
      meaning: 'Hơi mặn một tí, nhưng mà vẫn khá ngon.',
    },
    culturalTip: '"好极了" (tuyệt vời), "有特色" (đặc sắc/độc đáo) là lời khen được ưa chuộng khi thưởng thức ẩm thực Trung Hoa.',
    keywords: [
      { word: '味道', pinyin: 'wèidào', meaning: 'hương vị / mùi vị' },
      { word: '好极了', pinyin: 'hǎo jí le', meaning: 'tốt/ngon cực kỳ' },
      { word: '特色', pinyin: 'tèsè', meaning: 'đặc sắc / đặc sản' },
    ],
  },
  {
    id: 'spk-16',
    category: 'opinion_social',
    categoryName: 'Giao lưu & Ý kiến',
    categoryIcon: '💬',
    question: {
      chinese: '周末有空吗？一起看电影吧！',
      pinyin: 'Zhōumò yǒu kòng ma? Yìqǐ kàn diànyǐng ba!',
      meaning: 'Cuối tuần có rảnh không? Cùng đi xem phim đi!',
      speaker: 'Bạn bè rủ',
    },
    response: {
      chinese: '好啊！哪部电影？几点见？',
      pinyin: 'Hǎo a! Nǎ bù diànyǐng? Jǐ diǎn jiàn?',
      meaning: 'Được chứ! Phim nào thế? Mấy giờ gặp nhau?',
      speaker: 'Bạn đáp',
    },
    alternativeResponse: {
      chinese: '真不巧，这个周末我要加班。',
      pinyin: 'Zhēn bù qiǎo, zhège zhōumò wǒ yào jiābān.',
      meaning: 'Thật không may, cuối tuần này mình phải tăng ca rồi.',
    },
    culturalTip: 'Khi từ chối lời mời, nói "真不巧" (thật không may/tiếc quá) trước lý do sẽ thể hiện thái độ nhã nhặn, tôn trọng đối phương.',
    keywords: [
      { word: '有空', pinyin: 'yǒu kòng', meaning: 'có thời gian rảnh' },
      { word: '不巧', pinyin: 'bù qiǎo', meaning: 'trùng hợp không may / tiếc quá' },
      { word: '加班', pinyin: 'jiābān', meaning: 'tăng ca / làm thêm giờ' },
    ],
  },
  {
    id: 'spk-17',
    category: 'opinion_social',
    categoryName: 'Giao lưu & Ý kiến',
    categoryIcon: '💬',
    question: {
      chinese: '我这次考试没考好，好难过。',
      pinyin: 'Wǒ zhè cì kǎoshì méi kǎo hǎo, hǎo nánguò.',
      meaning: 'Kỳ thi lần này mình làm bài không tốt, buồn quá.',
      speaker: 'Bạn tâm sự',
    },
    response: {
      chinese: '别灰心，下次继续努力，加油！',
      pinyin: 'Bié huīxīn, xià cì jìxù nǔlì, jiāyóu!',
      meaning: 'Đừng nản lòng, lần sau tiếp tục cố gắng, cố lên nhé!',
      speaker: 'Bạn an ủi',
    },
    culturalTip: '"加油" (jiāyóu - đổ thêm dầu / cố lên) là câu khẩu ngữ cổ vũ phổ biến nhất trong thế giới nói tiếng Hoa.',
    keywords: [
      { word: '灰心', pinyin: 'huīxīn', meaning: 'nản lòng / thoái chí' },
      { word: '加油', pinyin: 'jiāyóu', meaning: 'cố lên' },
    ],
  },

  // 7. Khẩn cấp & Nhờ giúp đỡ
  {
    id: 'spk-18',
    category: 'emergency',
    categoryName: 'Khẩn cấp & Nhờ giúp',
    categoryIcon: '🆘',
    question: {
      chinese: '不好意思，我的手机没电了，能借用一下充电宝吗？',
      pinyin: 'Bù hǎoyìsi, wǒ de shǒujī méi diàn le, néng jièyòng yíxià chōngdiànbǎo ma?',
      meaning: 'Ngại quá, điện thoại của tôi hết pin rồi, có thể mượn cục sạc dự phòng một lát được không?',
      speaker: 'Bạn hỏi nhờ',
    },
    response: {
      chinese: '可以，给你，线也在这儿。',
      pinyin: 'Kěyǐ, gěi nǐ, xiàn yě zài zhèr.',
      meaning: 'Được chứ, gửi bạn, dây cáp sạc cũng ở đây nhé.',
      speaker: 'Người kia đáp',
    },
    culturalTip: 'Ở TQ có các trạm thuê sạc dự phòng công cộng gọi là "共享充电宝" (gòngxiǎng chōngdiànbǎo) ở hầu hết mọi nhà hàng, quán nước.',
    keywords: [
      { word: '没电', pinyin: 'méi diàn', meaning: 'hết pin / mất điện' },
      { word: '充电宝', pinyin: 'chōngdiànbǎo', meaning: 'sạc dự phòng' },
    ],
  },
  {
    id: 'spk-19',
    category: 'emergency',
    categoryName: 'Khẩn cấp & Nhờ giúp',
    categoryIcon: '🆘',
    question: {
      chinese: '救命啊！有人偷了我的包！',
      pinyin: 'Jiùmìng a! Yǒurén tōu le wǒ de bāo!',
      meaning: 'Cứu tôi với! Có người trộm túi xách của tôi!',
      speaker: 'Người gặp nạn',
    },
    response: {
      chinese: '快报警！打110！',
      pinyin: 'Kuài bàojǐng! Dǎ yāoyāolíng!',
      meaning: 'Mau báo cảnh sát! Gọi số 110!',
      speaker: 'Người hỗ trợ',
    },
    culturalTip: 'Số khẩn cấp tại Trung Quốc: 110 (Cảnh sát - đọc là yāoyāolíng), 120 (Cấp cứu y tế), 119 (Cứu hỏa). Chú ý số 1 đọc là "yāo" trong số điện thoại.',
    keywords: [
      { word: '救命', pinyin: 'jiùmìng', meaning: 'cứu mạng' },
      { word: '报警', pinyin: 'bàojǐng', meaning: 'báo cảnh sát' },
    ],
  },
  {
    id: 'spk-20',
    category: 'emergency',
    categoryName: 'Khẩn cấp & Nhờ giúp',
    categoryIcon: '🆘',
    question: {
      chinese: '我好像发烧了，头很疼。',
      pinyin: 'Wǒ hǎoxiàng fāshāo le, tóu hěn téng.',
      meaning: 'Hình như mình bị sốt rồi, đầu đau quá.',
      speaker: 'Bạn bị ốm',
    },
    response: {
      chinese: '多喝热水，我们赶紧去医院看看吧。',
      pinyin: 'Duō hē rèshuǐ, wǒmen gǎnjǐn qù yīyuàn kànkan ba.',
      meaning: 'Uống nhiều nước ấm vào, tụi mình mau đi bệnh viện khám thôi.',
      speaker: 'Bạn chăm sóc',
    },
    culturalTip: '"多喝热水" (uống nhiều nước ấm) là lời khuyên sức khỏe thần thánh đặc trưng nhất của người Trung Quốc trong mọi hoàn cảnh!',
    keywords: [
      { word: '发烧', pinyin: 'fāshāo', meaning: 'phát sốt' },
      { word: '热水', pinyin: 'rèshuǐ', meaning: 'nước nóng / ấm' },
      { word: '赶紧', pinyin: 'gǎnjǐn', meaning: 'khẩn trương / mau chóng' },
    ],
  },
];

export const SPOKEN_QUIZ_LIST: SpokenQuizQuestion[] = [
  {
    id: 'q-spk-1',
    scenario: 'Đồng nghiệp nói với bạn khi kết thúc một ngày làm việc dự án mệt mỏi: "今天工作辛苦了！"',
    prompt: 'Bạn nên phản hồi lại bằng câu nào lịch sự và đúng mực nhất?',
    options: [
      '不辛苦，应该的。',
      '不用谢，你走吧。',
      '太贵了，便宜点。',
      '好的，请买单。',
    ],
    correctIndex: 0,
    explanation: 'Đáp lại "辛苦了" lịch thiệp nhất là "不辛苦，应该的" (Không vất vả, là bổn phận của em thôi) hoặc "你也辛苦了".',
  },
  {
    id: 'q-spk-2',
    scenario: 'Tại quầy thu ngân quán trà sữa, nhân viên hỏi: "微信还是支付宝？"',
    prompt: 'Câu trả lời nào tự nhiên và đúng chuẩn đời thực nhất?',
    options: [
      '微信，我扫你还是你扫我？',
      '我不需要喝茶。',
      '一共八十块。',
      '地铁站在哪儿？',
    ],
    correctIndex: 0,
    explanation: 'Khi trả lời hình thức quét mã điện thoại, người bản xứ thường chọn loại ví và hỏi tiếp "我扫你还是你扫我？" (Tôi quét bạn hay bạn quét tôi?).',
  },
  {
    id: 'q-spk-3',
    scenario: 'Bạn đi ăn lẩu, nhân viên hỏi: "请问有忌口吗？能吃辣吗？"',
    prompt: 'Nếu bạn chỉ ăn được cay nhẹ và ghét rau mùi tàu, bạn nói thế nào?',
    options: [
      '微辣就行，不要香菜。',
      '服务员，买单！',
      '我要大一号的。',
      '老样子，挺忙的。',
    ],
    correctIndex: 0,
    explanation: '"微辣就行，不要香菜" (Cay nhẹ là được, không lấy rau mùi) là mẫu câu chuẩn xác để nói về khẩu vị kiêng kỵ.',
  },
  {
    id: 'q-spk-4',
    scenario: 'Tại chợ đêm, bạn hỏi người bán hàng chiếc áo khoác và thấy giá hơi cao.',
    prompt: 'Mẫu câu nào dùng để mặc cả giảm giá chuẩn ngữ điệu tự nhiên?',
    options: [
      '太贵了！便宜点行不行？',
      '太好吃了！再来一碗。',
      '救命啊！有人偷包。',
      '别客气，小事一桩。',
    ],
    correctIndex: 0,
    explanation: '"太贵了！便宜点行不行？" (Đắt quá! Bớt chút được không?) là câu mặc cả cửa miệng kinh điển.',
  },
  {
    id: 'q-spk-5',
    scenario: 'Bạn của bạn chuẩn bị bước vào phòng thi hoặc phỏng vấn xin việc và rất hồi hộp.',
    prompt: 'Bạn dùng câu nào để động viên bạn mình?',
    options: [
      '别紧张，相信自己，加油！',
      '对不起，我迟到了。',
      '请问洗手间在哪儿？',
      '一共一百块。',
    ],
    correctIndex: 0,
    explanation: '"别紧张，相信自己，加油！" (Đừng căng thẳng, hãy tin vào chính mình, cố lên!) là lời động viên hoàn hảo.',
  },
  {
    id: 'q-spk-6',
    scenario: 'Người bạn vừa giúp đỡ nói: "今天太谢谢你了，帮了我大忙！"',
    prompt: 'Câu đáp lại nào thể hiện thái độ nhiệt tình, hào sảng và thân thiện nhất?',
    options: [
      '别客气，小事一桩！',
      '你真烦人。',
      '多少钱一斤？',
      '向右拐就到了。',
    ],
    correctIndex: 0,
    explanation: '"别客气，小事一桩！" (Đừng khách sáo, chuyện nhỏ thôi!) thể hiện sự phóng khoáng, thân mật.',
  },
  {
    id: 'q-spk-7',
    scenario: 'Bạn cần gọi số khẩn cấp của Cảnh sát Trung Quốc khi xảy ra vụ việc.',
    prompt: 'Số điện thoại gọi cảnh sát tại Trung Quốc là số nào và đọc chuẩn là gì?',
    options: [
      '110 (yāoyāolíng)',
      '119 (yāoyāojiǔ)',
      '120 (yāorlíng)',
      '911 (jiǔyāoyāo)',
    ],
    correctIndex: 0,
    explanation: 'Cảnh sát Trung Quốc là 110, phát âm là "yāoyāolíng" (số 1 trong số điện thoại đọc là yāo).',
  },
  {
    id: 'q-spk-8',
    scenario: 'Khi muốn rủ một người bạn đi uống cà phê hoặc xem phim vào cuối tuần, bạn mở lời thế nào?',
    prompt: 'Mẫu câu hỏi xem đối phương có rảnh không là gì?',
    options: [
      '周末有空吗？一起去喝咖啡吧！',
      '周末堵车吗？我要买单。',
      '老板，这件衣服怎么卖？',
      '请问，可以试穿一下吗？',
    ],
    correctIndex: 0,
    explanation: '"周末有空吗？一起去喝咖啡吧！" là câu mở đầu rủ rê tự nhiên nhất.',
  },
];
